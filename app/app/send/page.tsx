"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";
import { useZkLogin } from "@/contexts/ZkLoginContext";
import { makeDeepBookClient, buildSwapAndSendTx, getSwapQuote, DBUSDC_TYPE } from "@/lib/deepbook";

type Recipient = { address: string; amount: string };

const COIN_OPTIONS = [
  { label: "SUI", value: COIN_TYPES.SUI },
  { label: "USDC", value: COIN_TYPES.USDC },
  { label: "USDT", value: COIN_TYPES.USDT },
];

export default function Send() {
  const account = useCurrentAccount();
  const { session, execute } = useZkLogin();
  const activeAddress = account?.address ?? session?.address ?? null;
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending: walletPending } = useSignAndExecuteTransaction();

  const [mode, setMode] = useState<"single" | "split">("single");
  const [crossCurrency, setCrossCurrency] = useState(false);
  const [coinType, setCoinType] = useState(COIN_TYPES.SUI);

  const [singleRecipient, setSingleRecipient] = useState("");
  const [singleAmount, setSingleAmount] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", amount: "" },
    { address: "", amount: "" },
  ]);

  const [crossAddresses, setCrossAddresses] = useState<string[]>(["", ""]);
  const [crossSuiAmount, setCrossSuiAmount] = useState("");
  const [quoteDbusdc, setQuoteDbusdc] = useState<number | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const isPending = walletPending || loading;
  const coinLabel = COIN_OPTIONS.find((o) => o.value === coinType)?.label;
  const totalSplit = recipients.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const fetchQuote = useCallback(async () => {
    const amount = Number(crossSuiAmount);
    if (!amount || amount <= 0 || !activeAddress) return;
    setQuoteLoading(true);
    try {
      const quote = await getSwapQuote(suiClient as never, activeAddress, amount);
      setQuoteDbusdc(quote);
    } catch {
      setQuoteDbusdc(null);
    } finally {
      setQuoteLoading(false);
    }
  }, [crossSuiAmount, activeAddress, suiClient]);

  useEffect(() => {
    if (!crossCurrency) return;
    const timer = setTimeout(fetchQuote, 600);
    return () => clearTimeout(timer);
  }, [crossSuiAmount, crossCurrency, fetchQuote]);

  function addCrossAddress() { setCrossAddresses([...crossAddresses, ""]); }
  function updateCrossAddress(i: number, val: string) {
    const updated = [...crossAddresses]; updated[i] = val; setCrossAddresses(updated);
  }
  function removeCrossAddress(i: number) { setCrossAddresses(crossAddresses.filter((_, idx) => idx !== i)); }

  function addRecipient() { setRecipients([...recipients, { address: "", amount: "" }]); }
  function updateRecipient(i: number, field: keyof Recipient, value: string) {
    const updated = [...recipients]; updated[i][field] = value; setRecipients(updated);
  }
  function removeRecipient(i: number) { setRecipients(recipients.filter((_, idx) => idx !== i)); }

  async function handleSend() {
    if (!activeAddress) return;
    setError(""); setSuccess("");

    try {
      const tx = new Transaction();

      if (crossCurrency) {
        const suiAmt = Number(crossSuiAmount);
        if (!suiAmt || suiAmt <= 0) { setError("Enter a valid SUI amount to swap."); return; }
        const validAddrs = crossAddresses.map((a) => a.trim()).filter((a) => a.length > 0);
        if (validAddrs.length === 0) { setError("Enter at least one recipient address."); return; }
        if (validAddrs.some((a) => !a.startsWith("0x"))) { setError("All recipient addresses must start with 0x."); return; }

        const estimated = quoteDbusdc ?? 0;
        const db = makeDeepBookClient(suiClient as never, activeAddress);
        buildSwapAndSendTx(tx, db, suiAmt, validAddrs, estimated, activeAddress);
      } else if (mode === "single") {
        if (!singleRecipient.trim().startsWith("0x")) { setError("Enter a valid Sui address starting with 0x."); return; }
        if (!singleAmount || Number(singleAmount) <= 0) { setError("Enter a valid amount."); return; }
        const amount = suiToMist(singleAmount);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
        tx.moveCall({ target: `${PACKAGE_ID}::instant::send`, typeArguments: [coinType], arguments: [coin, tx.pure.address(singleRecipient.trim())] });
      } else {
        for (const r of recipients) {
          if (!r.address.trim().startsWith("0x")) { setError("All addresses must start with 0x."); return; }
          if (!r.amount || Number(r.amount) <= 0) { setError("All amounts must be greater than 0."); return; }
        }
        const addrs = recipients.map((r) => r.address.trim());
        const amounts = recipients.map((r) => suiToMist(r.amount));
        const total = amounts.reduce((a, b) => a + b, 0n);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(total)]);
        tx.moveCall({ target: `${PACKAGE_ID}::instant::split_send`, typeArguments: [coinType], arguments: [coin, tx.pure.vector("address", addrs), tx.pure.vector("u64", amounts)] });
      }

      if (session) {
        setLoading(true);
        await execute(tx);
        setSuccess(crossCurrency ? "Swap and send complete. Recipients received DBUSDC." : "Payment sent.");
        setSingleRecipient(""); setSingleAmount(""); setCrossSuiAmount(""); setQuoteDbusdc(null);
        setRecipients([{ address: "", amount: "" }, { address: "", amount: "" }]);
        setCrossAddresses(["", ""]);
      } else {
        signAndExecute({ transaction: tx }, {
          onSuccess: () => {
            setSuccess(crossCurrency ? "Swap and send complete. Recipients received DBUSDC." : "Payment sent.");
            setSingleRecipient(""); setSingleAmount(""); setCrossSuiAmount(""); setQuoteDbusdc(null);
            setRecipients([{ address: "", amount: "" }, { address: "", amount: "" }]);
            setCrossAddresses(["", ""]);
          },
          onError: (err) => setError(err.message),
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!activeAddress) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-40 text-center">
          <p className="text-[#6B7280]">Sign in with Google or connect a wallet to continue.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-2">Send</h1>
        <p className="text-sm text-[#6B7280] mb-8">Instant payment to one or many addresses.</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCrossCurrency(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!crossCurrency ? "bg-[#2563EB] text-white" : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"}`}
            >
              Standard
            </button>
            <button
              onClick={() => setCrossCurrency(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${crossCurrency ? "bg-[#2563EB] text-white" : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"}`}
            >
              Cross-currency
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${crossCurrency ? "bg-white/20 text-white" : "bg-[#2563EB]/10 text-[#2563EB]"}`}>DeepBook</span>
            </button>
          </div>

          {crossCurrency ? (
            <>
              <div className="p-4 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/5 text-xs text-[#374151] leading-relaxed">
                Pay in SUI. Recipients receive DBUSDC. Swap routes through DeepBook atomically in the same transaction.
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">SUI to swap</label>
                <div className="relative">
                  <input
                    type="number"
                    value={crossSuiAmount}
                    onChange={(e) => setCrossSuiAmount(e.target.value)}
                    placeholder="1.0"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16"
                  />
                  <span className="absolute right-4 top-3 text-sm text-[#6B7280]">SUI</span>
                </div>
                {crossSuiAmount && (
                  <p className="text-xs text-[#6B7280] mt-1">
                    {quoteLoading
                      ? "Getting quote..."
                      : quoteDbusdc !== null
                      ? `Estimated output: ${quoteDbusdc.toFixed(4)} DBUSDC — split equally across ${crossAddresses.filter((a) => a.trim()).length || 1} recipient(s)`
                      : "Could not fetch quote — pool may be empty"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recipients (receive DBUSDC equally)</label>
                <div className="space-y-2">
                  {crossAddresses.map((addr, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-[#6B7280] w-5">{i + 1}</span>
                      <input
                        type="text"
                        value={addr}
                        onChange={(e) => updateCrossAddress(i, e.target.value)}
                        placeholder="0x..."
                        className="flex-1 px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono"
                      />
                      {crossAddresses.length > 1 && (
                        <button onClick={() => removeCrossAddress(i)} className="text-[#6B7280] hover:text-[#EF4444] text-lg leading-none">×</button>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={addCrossAddress} className="text-sm text-[#2563EB] hover:underline mt-2">+ Add recipient</button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#6B7280] p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0"></span>
                Receiving token: DBUSDC (DeepBook testnet USDC)
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Asset</label>
                <div className="flex gap-2">
                  {COIN_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setCoinType(opt.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${coinType === opt.value ? "bg-[#2563EB] text-white" : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {(["single", "split"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${mode === m ? "bg-[#E2E8F0] text-[#111827] border border-[#2563EB]" : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"}`}>
                    {m}
                  </button>
                ))}
              </div>

              {mode === "single" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Recipient</label>
                    <input type="text" value={singleRecipient} onChange={(e) => setSingleRecipient(e.target.value)} placeholder="0x..."
                      className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <div className="relative">
                      <input type="number" value={singleAmount} onChange={(e) => setSingleAmount(e.target.value)} placeholder="1.0" step="0.01" min="0"
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16" />
                      <span className="absolute right-4 top-3 text-sm text-[#6B7280]">{coinLabel}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {recipients.map((r, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-xs text-[#6B7280] w-5">{i + 1}</span>
                      <input type="text" value={r.address} onChange={(e) => updateRecipient(i, "address", e.target.value)} placeholder="0x..."
                        className="flex-1 px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono" />
                      <div className="relative">
                        <input type="number" value={r.amount} onChange={(e) => updateRecipient(i, "amount", e.target.value)} placeholder="0.0" step="0.01" min="0"
                          className="w-28 px-3 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-10" />
                        <span className="absolute right-3 top-3 text-xs text-[#6B7280]">{coinLabel}</span>
                      </div>
                      {recipients.length > 2 && <button onClick={() => removeRecipient(i)} className="text-[#6B7280] hover:text-[#EF4444]">×</button>}
                    </div>
                  ))}
                  <button onClick={addRecipient} className="text-sm text-[#2563EB] hover:underline">+ Add recipient</button>
                  {totalSplit > 0 && <p className="text-xs text-[#6B7280]">Total: {totalSplit.toFixed(4)} {coinLabel}</p>}
                </>
              )}
            </>
          )}

          {error && <p className="text-sm text-[#EF4444] bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-[#10B981] bg-green-50 px-4 py-3 rounded-lg">{success}</p>}

          <button
            onClick={handleSend}
            disabled={
              isPending ||
              (crossCurrency && (!crossSuiAmount || crossAddresses.every((a) => !a.trim()))) ||
              (!crossCurrency && mode === "single" && (!singleRecipient || !singleAmount)) ||
              (!crossCurrency && mode === "split" && recipients.some((r) => !r.address || !r.amount))
            }
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isPending
              ? crossCurrency ? "Swapping..." : "Sending..."
              : crossCurrency ? "Swap and Send"
              : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";
import { useZkLogin } from "@/contexts/ZkLoginContext";

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
  const { mutate: signAndExecute, isPending: walletPending } = useSignAndExecuteTransaction();

  const [mode, setMode] = useState<"single" | "split">("single");
  const [coinType, setCoinType] = useState(COIN_TYPES.SUI);
  const [singleRecipient, setSingleRecipient] = useState("");
  const [singleAmount, setSingleAmount] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: "", amount: "" }, { address: "", amount: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const isPending = walletPending || loading;
  const coinLabel = COIN_OPTIONS.find((o) => o.value === coinType)?.label;
  const totalSplit = recipients.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  function addRecipient() { setRecipients([...recipients, { address: "", amount: "" }]); }
  function updateRecipient(i: number, field: keyof Recipient, value: string) {
    const updated = [...recipients]; updated[i][field] = value; setRecipients(updated);
  }
  function removeRecipient(i: number) { setRecipients(recipients.filter((_, idx) => idx !== i)); }

  async function handleSend() {
    if (!activeAddress) return;
    setError(""); setSuccess("");

    if (mode === "single") {
      if (!singleRecipient.trim()) { setError("Recipient address is required."); return; }
      if (!singleRecipient.startsWith("0x")) { setError("Enter a valid Sui address starting with 0x."); return; }
      if (!singleAmount || Number(singleAmount) <= 0) { setError("Enter a valid amount."); return; }
    } else {
      for (const r of recipients) {
        if (!r.address.trim() || !r.address.startsWith("0x")) { setError("All recipient addresses must be valid Sui addresses."); return; }
        if (!r.amount || Number(r.amount) <= 0) { setError("All amounts must be greater than 0."); return; }
      }
    }

    try {
      const tx = new Transaction();
      if (mode === "single") {
        const amount = suiToMist(singleAmount);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
        tx.moveCall({ target: `${PACKAGE_ID}::instant::send`, typeArguments: [coinType], arguments: [coin, tx.pure.address(singleRecipient.trim())] });
      } else {
        const addrs = recipients.map((r) => r.address.trim());
        const amounts = recipients.map((r) => suiToMist(r.amount));
        const total = amounts.reduce((a, b) => a + b, 0n);
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(total)]);
        tx.moveCall({ target: `${PACKAGE_ID}::instant::split_send`, typeArguments: [coinType], arguments: [coin, tx.pure.vector("address", addrs), tx.pure.vector("u64", amounts)] });
      }

      if (session) {
        setLoading(true);
        await execute(tx);
        setSuccess("Payment sent.");
        setSingleRecipient(""); setSingleAmount("");
        setRecipients([{ address: "", amount: "" }, { address: "", amount: "" }]);
      } else {
        signAndExecute({ transaction: tx }, {
          onSuccess: () => { setSuccess("Payment sent."); setSingleRecipient(""); setSingleAmount(""); setRecipients([{ address: "", amount: "" }, { address: "", amount: "" }]); },
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
          {error && <p className="text-sm text-[#EF4444] bg-red-50 px-4 py-3 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-[#10B981] bg-green-50 px-4 py-3 rounded-lg">{success}</p>}
          <button
            onClick={handleSend}
            disabled={
              isPending ||
              (mode === "single" && (!singleRecipient || !singleAmount)) ||
              (mode === "split" && recipients.some((r) => !r.address || !r.amount))
            }
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors">
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

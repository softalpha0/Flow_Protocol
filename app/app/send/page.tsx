"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";

type Recipient = { address: string; amount: string };

const COIN_OPTIONS = [
  { label: "SUI", value: COIN_TYPES.SUI },
  { label: "USDC", value: COIN_TYPES.USDC },
  { label: "USDT", value: COIN_TYPES.USDT },
];

export default function Send() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [mode, setMode] = useState<"single" | "split">("single");
  const [coinType, setCoinType] = useState(COIN_TYPES.SUI);
  const [singleRecipient, setSingleRecipient] = useState("");
  const [singleAmount, setSingleAmount] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", amount: "" },
    { address: "", amount: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function addRecipient() {
    setRecipients([...recipients, { address: "", amount: "" }]);
  }

  function updateRecipient(i: number, field: keyof Recipient, value: string) {
    const updated = [...recipients];
    updated[i][field] = value;
    setRecipients(updated);
  }

  function removeRecipient(i: number) {
    setRecipients(recipients.filter((_, idx) => idx !== i));
  }

  const totalSplit = recipients.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const coinLabel = COIN_OPTIONS.find((o) => o.value === coinType)?.label;

  async function handleSend() {
    if (!account) return;
    setError("");
    setSuccess("");

    try {
      const tx = new Transaction();

      if (mode === "single") {
        const amount = suiToMist(singleAmount);
        const [coin] = tx.splitCoins(tx.gas, [amount]);
        tx.moveCall({
          target: `${PACKAGE_ID}::instant::send`,
          typeArguments: [coinType],
          arguments: [coin, tx.pure.address(singleRecipient)],
        });
      } else {
        const addrs = recipients.map((r) => r.address);
        const amounts = recipients.map((r) => suiToMist(r.amount));
        const total = amounts.reduce((a, b) => a + b, 0n);
        const [coin] = tx.splitCoins(tx.gas, [total]);
        tx.moveCall({
          target: `${PACKAGE_ID}::instant::split_send`,
          typeArguments: [coinType],
          arguments: [
            coin,
            tx.pure.vector("address", addrs),
            tx.pure.vector("u64", amounts),
          ],
        });
      }

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setSuccess("Payment sent.");
            setSingleRecipient("");
            setSingleAmount("");
            setRecipients([{ address: "", amount: "" }, { address: "", amount: "" }]);
          },
          onError: (err) => setError(err.message),
        }
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!account) {
    return (
      <main className="min-h-screen bg-[#FFFFFF]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-40 text-center">
          <p className="text-[#6B7280]">Connect your wallet first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-2">Send</h1>
        <p className="text-sm text-[#6B7280] mb-8">Instant payment to one or many addresses.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Asset</label>
            <div className="flex gap-2">
              {COIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCoinType(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    coinType === opt.value
                      ? "bg-[#2563EB] text-[#111827]"
                      : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("single")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "single"
                  ? "bg-[#E2E8F0] text-[#111827] border border-[#2563EB]"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setMode("split")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === "split"
                  ? "bg-[#E2E8F0] text-[#111827] border border-[#2563EB]"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Split
            </button>
          </div>

          {mode === "single" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Recipient</label>
                <input
                  type="text"
                  value={singleRecipient}
                  onChange={(e) => setSingleRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={singleAmount}
                    onChange={(e) => setSingleAmount(e.target.value)}
                    placeholder="1.0"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16"
                  />
                  <span className="absolute right-4 top-3 text-sm text-[#6B7280]">{coinLabel}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {recipients.map((r, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-[#6B7280] w-5">{i + 1}</span>
                    <input
                      type="text"
                      value={r.address}
                      onChange={(e) => updateRecipient(i, "address", e.target.value)}
                      placeholder="0x..."
                      className="flex-1 px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={r.amount}
                        onChange={(e) => updateRecipient(i, "amount", e.target.value)}
                        placeholder="0.0"
                        step="0.01"
                        min="0"
                        className="w-28 px-3 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-10"
                      />
                      <span className="absolute right-3 top-3 text-xs text-[#6B7280]">{coinLabel}</span>
                    </div>
                    {recipients.length > 2 && (
                      <button
                        onClick={() => removeRecipient(i)}
                        className="text-[#6B7280] hover:text-[#EF4444] text-sm"
                      >
                        x
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={addRecipient}
                className="text-sm text-[#A78BFA] hover:text-[#2563EB] transition-colors"
              >
                + Add recipient
              </button>
              {totalSplit > 0 && (
                <p className="text-xs text-[#6B7280]">Total: {totalSplit.toFixed(4)} {coinLabel}</p>
              )}
            </>
          )}

          {error && (
            <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-sm text-[#10B981] bg-[#10B98110] px-4 py-3 rounded-lg">{success}</p>
          )}

          <button
            onClick={handleSend}
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

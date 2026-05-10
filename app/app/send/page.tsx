"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { suiToMist } from "@/lib/sui";

type Recipient = { address: string; amount: string };

export default function Send() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [mode, setMode] = useState<"single" | "split">("single");
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
          arguments: [coin, tx.pure.address(singleRecipient)],
        });
      } else {
        const addrs = recipients.map((r) => r.address);
        const amounts = recipients.map((r) => suiToMist(r.amount));
        const total = amounts.reduce((a, b) => a + b, 0n);
        const [coin] = tx.splitCoins(tx.gas, [total]);
        tx.moveCall({
          target: `${PACKAGE_ID}::instant::split_send`,
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
            setSuccess("Payment sent successfully.");
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
      <main className="min-h-screen bg-[#08080F]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-40 text-center">
          <p className="text-[#6B7280]">Connect your wallet first.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080F]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-2">Send</h1>
        <p className="text-sm text-[#6B7280] mb-8">Instant payment to one or many addresses.</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "single"
                ? "bg-[#7C3AED] text-white"
                : "bg-[#0F0F1A] border border-[#1A1A2E] text-[#6B7280] hover:text-white"
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setMode("split")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "split"
                ? "bg-[#7C3AED] text-white"
                : "bg-[#0F0F1A] border border-[#1A1A2E] text-[#6B7280] hover:text-white"
            }`}
          >
            Split
          </button>
        </div>

        <div className="space-y-4">
          {mode === "single" ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Recipient</label>
                <input
                  type="text"
                  value={singleRecipient}
                  onChange={(e) => setSingleRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (SUI)</label>
                <input
                  type="number"
                  value={singleAmount}
                  onChange={(e) => setSingleAmount(e.target.value)}
                  placeholder="1.0"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </>
          ) : (
            <>
              {recipients.map((r, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={r.address}
                      onChange={(e) => updateRecipient(i, "address", e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] font-mono mb-2"
                    />
                    <input
                      type="number"
                      value={r.amount}
                      onChange={(e) => updateRecipient(i, "amount", e.target.value)}
                      placeholder="SUI amount"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                  {recipients.length > 2 && (
                    <button
                      onClick={() => removeRecipient(i)}
                      className="mt-3 text-[#6B7280] hover:text-[#EF4444] text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addRecipient}
                className="text-sm text-[#A78BFA] hover:text-[#7C3AED] transition-colors"
              >
                + Add recipient
              </button>
              {totalSplit > 0 && (
                <p className="text-xs text-[#6B7280]">Total: {totalSplit.toFixed(4)} SUI</p>
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
            className="w-full py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}

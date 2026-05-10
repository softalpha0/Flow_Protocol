"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { suiToMist } from "@/lib/sui";

export default function NewStream() {
  const account = useCurrentAccount();
  const router = useRouter();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [recipient, setRecipient] = useState("");
  const [ratePerSecond, setRatePerSecond] = useState("");
  const [depositSui, setDepositSui] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!account) return;
    setError("");

    try {
      const rateMist = suiToMist(ratePerSecond);
      const depositMist = suiToMist(depositSui);

      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [depositMist]);

      tx.moveCall({
        target: `${PACKAGE_ID}::stream::create_stream`,
        arguments: [
          tx.pure.address(recipient),
          tx.pure.u64(rateMist),
          coin,
          tx.object("0x6"),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Stream created:", result);
            router.push("/app");
          },
          onError: (err) => {
            setError(err.message);
          },
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
        <h1 className="text-2xl font-bold mb-2">Create Stream</h1>
        <p className="text-sm text-[#6B7280] mb-8">Pay per second to any Sui address.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rate per second (SUI)</label>
            <input
              type="number"
              value={ratePerSecond}
              onChange={(e) => setRatePerSecond(e.target.value)}
              placeholder="0.0001"
              step="0.0001"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total deposit (SUI)</label>
            <input
              type="number"
              value={depositSui}
              onChange={(e) => setDepositSui(e.target.value)}
              placeholder="1.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
            />
            {depositSui && ratePerSecond && (
              <p className="text-xs text-[#6B7280] mt-1">
                Stream duration: ~{Math.floor(Number(depositSui) / Number(ratePerSecond))} seconds
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={isPending || !recipient || !ratePerSecond || !depositSui}
            className="w-full py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isPending ? "Creating..." : "Create Stream"}
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { suiToMist } from "@/lib/sui";

export default function NewPact() {
  const account = useCurrentAccount();
  const router = useRouter();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [depositSui, setDepositSui] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!account) return;
    setError("");

    try {
      const depositMist = suiToMist(depositSui);
      const deadlineMs = deadline ? new Date(deadline).getTime() : 0;

      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [depositMist]);

      const descBytes = Array.from(new TextEncoder().encode(description));
      const blobBytes: number[] = [];

      tx.moveCall({
        target: `${PACKAGE_ID}::pact::create_pact`,
        arguments: [
          tx.pure.address(recipient),
          tx.pure.vector("u8", descBytes),
          tx.pure.vector("u8", blobBytes),
          tx.pure.u64(deadlineMs),
          coin,
          tx.object("0x6"),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("Pact created:", result);
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
        <h1 className="text-2xl font-bold mb-2">Create Pact</h1>
        <p className="text-sm text-[#6B7280] mb-8">Lock funds in milestone escrow. Release when work is done.</p>

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
            <label className="block text-sm font-medium mb-1">Description / milestone terms</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deliver landing page design by end of sprint..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (SUI)</label>
            <input
              type="number"
              value={depositSui}
              onChange={(e) => setDepositSui(e.target.value)}
              placeholder="5.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          {error && (
            <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleCreate}
            disabled={isPending || !recipient || !description || !depositSui}
            className="w-full py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isPending ? "Creating..." : "Lock Funds in Pact"}
          </button>
        </div>
      </div>
    </main>
  );
}

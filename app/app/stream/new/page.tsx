"use client";

import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";
import { useZkLogin } from "@/contexts/ZkLoginContext";

const COIN_OPTIONS = [
  { label: "SUI", value: COIN_TYPES.SUI },
  { label: "USDC", value: COIN_TYPES.USDC },
  { label: "USDT", value: COIN_TYPES.USDT },
];

export default function NewStream() {
  const account = useCurrentAccount();
  const { session, execute } = useZkLogin();
  const activeAddress = account?.address ?? session?.address ?? null;
  const router = useRouter();
  const { mutate: signAndExecute, isPending: walletPending } = useSignAndExecuteTransaction();

  const [recipient, setRecipient] = useState("");
  const [ratePerSecond, setRatePerSecond] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [coinType, setCoinType] = useState(COIN_TYPES.SUI);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isPending = walletPending || loading;

  async function handleCreate() {
    if (!activeAddress) return;
    setError("");

    try {
      const rateMist = suiToMist(ratePerSecond);
      const depositMist = suiToMist(depositAmount);
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(depositMist)]);
      tx.moveCall({
        target: `${PACKAGE_ID}::stream::create_stream`,
        typeArguments: [coinType],
        arguments: [tx.pure.address(recipient), tx.pure.u64(rateMist), coin, tx.object("0x6")],
      });

      if (session) {
        setLoading(true);
        await execute(tx);
        router.push("/app");
      } else {
        signAndExecute({ transaction: tx }, {
          onSuccess: () => router.push("/app"),
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
        <h1 className="text-2xl font-bold mb-2">Create Stream</h1>
        <p className="text-sm text-[#6B7280] mb-8">Pay per second to any Sui address.</p>

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

          <div>
            <label className="block text-sm font-medium mb-1">Recipient address</label>
            <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="0x..."
              className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] font-mono" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rate per second</label>
            <div className="relative">
              <input type="number" value={ratePerSecond} onChange={(e) => setRatePerSecond(e.target.value)} placeholder="0.0001" step="0.0001" min="0"
                className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16" />
              <span className="absolute right-4 top-3 text-sm text-[#6B7280]">{COIN_OPTIONS.find((o) => o.value === coinType)?.label}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total deposit</label>
            <div className="relative">
              <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="1.0" step="0.01" min="0"
                className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16" />
              <span className="absolute right-4 top-3 text-sm text-[#6B7280]">{COIN_OPTIONS.find((o) => o.value === coinType)?.label}</span>
            </div>
            {depositAmount && ratePerSecond && (
              <p className="text-xs text-[#6B7280] mt-1">Duration: ~{Math.floor(Number(depositAmount) / Number(ratePerSecond))} seconds</p>
            )}
          </div>

          {error && <p className="text-sm text-[#EF4444] bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

          <button onClick={handleCreate} disabled={isPending || !recipient || !ratePerSecond || !depositAmount}
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors">
            {isPending ? "Creating..." : "Create Stream"}
          </button>
        </div>
      </div>
    </main>
  );
}

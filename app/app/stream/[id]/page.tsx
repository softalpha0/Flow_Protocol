"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { mistToSui, shortenAddress } from "@/lib/sui";

export default function StreamDetail() {
  const { id } = useParams<{ id: string }>();
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [claimable, setClaimable] = useState(0n);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data, isLoading, refetch } = useSuiClientQuery("getObject", {
    id,
    options: { showContent: true },
  });

  const fields = (data?.data?.content as { fields?: Record<string, string> })?.fields;

  useEffect(() => {
    if (!fields) return;
    if (fields.is_active !== "true" && fields.is_active !== true) return;

    const interval = setInterval(() => {
      const now = BigInt(Date.now());
      const lastWithdrawn = BigInt(fields.last_withdrawn);
      const rate = BigInt(fields.rate_per_second);
      const balance = BigInt(fields.balance);
      const elapsedMs = now - lastWithdrawn;
      const elapsedSec = elapsedMs / 1000n;
      const earned = elapsedSec * rate;
      setClaimable(earned > balance ? balance : earned);
    }, 1000);

    return () => clearInterval(interval);
  }, [fields]);

  function handleWithdraw() {
    if (!account || !fields) return;
    setError("");
    setSuccess("");

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [claimable]);

    tx.moveCall({
      target: `${PACKAGE_ID}::stream::withdraw_stream`,
      arguments: [
        tx.object(id),
        coin,
        tx.object("0x6"),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setSuccess("Withdrawal successful.");
          refetch();
        },
        onError: (err) => setError(err.message),
      }
    );
  }

  function handleCancel() {
    if (!account) return;
    setError("");
    setSuccess("");

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::stream::cancel_stream`,
      arguments: [
        tx.object(id),
        tx.object("0x6"),
      ],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setSuccess("Stream cancelled.");
          refetch();
        },
        onError: (err) => setError(err.message),
      }
    );
  }

  const isSender = account?.address === fields?.sender;
  const isRecipient = account?.address === fields?.recipient;
  const isActive = fields?.is_active === true || fields?.is_active === "true";

  return (
    <main className="min-h-screen bg-[#08080F]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Stream</h1>
          {fields && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? "bg-[#10B98120] text-[#10B981]" : "bg-[#6B728020] text-[#6B7280]"}`}>
              {isActive ? "Active" : "Ended"}
            </span>
          )}
        </div>

        {isLoading && <p className="text-[#6B7280] text-sm">Loading...</p>}

        {fields && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">From</span>
                <span className="font-mono">{shortenAddress(fields.sender)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">To</span>
                <span className="font-mono">{shortenAddress(fields.recipient)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Rate</span>
                <span>{mistToSui(BigInt(fields.rate_per_second))} SUI / sec</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Remaining balance</span>
                <span>{mistToSui(BigInt(fields.balance))} SUI</span>
              </div>
            </div>

            {isActive && (
              <div className="p-6 rounded-xl border border-[#7C3AED40] bg-[#1E1040] text-center">
                <p className="text-xs text-[#A78BFA] mb-1 uppercase tracking-wide">Claimable now</p>
                <p className="text-4xl font-bold font-mono text-white">
                  {mistToSui(claimable)} SUI
                </p>
                <p className="text-xs text-[#6B7280] mt-1">Updates every second</p>
              </div>
            )}

            {error && (
              <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>
            )}
            {success && (
              <p className="text-sm text-[#10B981] bg-[#10B98110] px-4 py-3 rounded-lg">{success}</p>
            )}

            <div className="flex gap-3">
              {isRecipient && isActive && (
                <button
                  onClick={handleWithdraw}
                  disabled={isPending || claimable === 0n}
                  className="flex-1 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                >
                  {isPending ? "Processing..." : "Withdraw"}
                </button>
              )}
              {isSender && isActive && (
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 py-3 rounded-lg border border-[#EF4444] text-[#EF4444] hover:bg-[#EF444410] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                >
                  {isPending ? "Processing..." : "Cancel Stream"}
                </button>
              )}
            </div>

            <p className="text-xs text-[#6B7280] text-center break-all">ID: {id}</p>
          </div>
        )}
      </div>
    </main>
  );
}

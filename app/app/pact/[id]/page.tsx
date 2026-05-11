"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { mistToSui, shortenAddress } from "@/lib/sui";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  "0": { label: "Pending", color: "text-[#F59E0B] bg-[#F59E0B20]" },
  "1": { label: "Completed", color: "text-[#10B981] bg-[#10B98120]" },
  "2": { label: "Disputed", color: "text-[#EF4444] bg-[#EF444420]" },
  "3": { label: "Cancelled", color: "text-[#6B7280] bg-[#6B728020]" },
};

export default function PactDetail() {
  const { id } = useParams<{ id: string }>();
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const { data, isLoading, refetch } = useSuiClientQuery("getObject", {
    id,
    options: { showContent: true },
  });

  const fields = (data?.data?.content as { fields?: Record<string, string> })?.fields;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleComplete() {
    if (!account || !fields) return;
    setError(""); setSuccess("");

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [BigInt(fields.amount)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::pact::complete_pact`,
      arguments: [tx.object(id), coin, tx.object("0x6")],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => { setSuccess("Pact completed. Funds released."); refetch(); },
        onError: (err) => setError(err.message),
      }
    );
  }

  function handleCancel() {
    if (!account || !fields) return;
    setError(""); setSuccess("");

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [BigInt(fields.amount)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::pact::cancel_pact`,
      arguments: [tx.object(id), coin],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => { setSuccess("Pact cancelled. Funds returned."); refetch(); },
        onError: (err) => setError(err.message),
      }
    );
  }

  function handleDispute() {
    if (!account) return;
    setError(""); setSuccess("");

    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::pact::dispute_pact`,
      arguments: [tx.object(id)],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => { setSuccess("Dispute raised."); refetch(); },
        onError: (err) => setError(err.message),
      }
    );
  }

  const isSender = account?.address === fields?.sender;
  const isRecipient = account?.address === fields?.recipient;
  const isPending2 = fields?.status === "0";
  const statusInfo = STATUS_LABELS[fields?.status ?? "0"];

  const deadlineMs = fields?.deadline ? Number(fields.deadline) : 0;
  const deadlineDate = deadlineMs > 0 ? new Date(deadlineMs).toLocaleString() : "None";

  return (
    <main className="min-h-screen bg-[#08080F]">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 pt-28 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Pact</h1>
          {statusInfo && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {statusInfo.label}
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
                <span className="text-[#6B7280]">Amount</span>
                <span className="font-semibold">{mistToSui(BigInt(fields.amount))} SUI</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Deadline</span>
                <span>{deadlineDate}</span>
              </div>
            </div>

            {fields.description && (
              <div className="p-4 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A]">
                <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">Terms</p>
                <p className="text-sm">{fields.description}</p>
              </div>
            )}

            {error && (
              <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>
            )}
            {success && (
              <p className="text-sm text-[#10B981] bg-[#10B98110] px-4 py-3 rounded-lg">{success}</p>
            )}

            {isPending2 && (
              <div className="flex gap-3">
                {isSender && (
                  <>
                    <button
                      onClick={handleComplete}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 font-medium text-sm transition-colors"
                    >
                      {isPending ? "Processing..." : "Release Funds"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-lg border border-[#EF4444] text-[#EF4444] hover:bg-[#EF444410] disabled:opacity-50 font-medium text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {isRecipient && (
                  <button
                    onClick={handleDispute}
                    disabled={isPending}
                    className="flex-1 py-3 rounded-lg border border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B10] disabled:opacity-50 font-medium text-sm transition-colors"
                  >
                    Raise Dispute
                  </button>
                )}
              </div>
            )}

            <p className="text-xs text-[#6B7280] text-center break-all">ID: {id}</p>
          </div>
        )}
      </div>
    </main>
  );
}

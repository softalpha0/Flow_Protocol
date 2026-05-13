"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID } from "@/constants";
import { mistToSui, shortenAddress } from "@/lib/sui";
import { fetchTextFromWalrus, uploadToWalrus, walrusBlobUrl } from "@/lib/walrus";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  "0": { label: "Pending", color: "text-[#F59E0B] bg-[#F59E0B20]" },
  "1": { label: "Completed", color: "text-[#10B981] bg-[#10B98120]" },
  "2": { label: "Disputed", color: "text-[#EF4444] bg-[#EF444420]" },
  "3": { label: "Cancelled", color: "text-[#6B7280] bg-[#6B728020]" },
};

function extractCoinType(objectType: string): string {
  const match = objectType.match(/<(.+)>$/);
  return match ? match[1] : "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";
}

export default function PactDetail() {
  const { id } = useParams<{ id: string }>();
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [walrusContent, setWalrusContent] = useState<string | null>(null);
  const [walrusLoading, setWalrusLoading] = useState(false);
  const [receiptBlobId, setReceiptBlobId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useSuiClientQuery("getObject", {
    id,
    options: { showContent: true, showType: true },
  });

  const objectType = data?.data?.type ?? "";
  const coinType = extractCoinType(objectType);
  const content = data?.data?.content as { fields?: Record<string, string> } | undefined;
  const fields = content?.fields;
  const walrusBlobId: string = fields?.walrus_blob_id ?? "";

  useEffect(() => {
    if (!walrusBlobId) return;
    setWalrusLoading(true);
    fetchTextFromWalrus(walrusBlobId)
      .then((text) => setWalrusContent(text))
      .catch(() => setWalrusContent(null))
      .finally(() => setWalrusLoading(false));
  }, [walrusBlobId]);

  async function generateAndUploadReceipt() {
    if (!fields) return;
    try {
      const receipt = JSON.stringify({
        protocol: "Flow Protocol",
        type: "PactReceipt",
        pactId: id,
        sender: fields.sender,
        recipient: fields.recipient,
        amount: `${mistToSui(BigInt(fields.amount))} SUI`,
        description: fields.description,
        completedAt: new Date().toISOString(),
        network: "Sui Testnet",
        packageId: PACKAGE_ID,
      }, null, 2);
      const blobId = await uploadToWalrus(receipt);
      setReceiptBlobId(blobId);
    } catch {
      // receipt upload is best-effort, don't surface as error
    }
  }

  function handleComplete() {
    if (!account) return;
    setError(""); setSuccess("");
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::pact::complete_pact`,
      typeArguments: [coinType],
      arguments: [tx.object(id), tx.object("0x6")],
    });
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          setSuccess("Pact completed. Funds released.");
          refetch();
          generateAndUploadReceipt();
        },
        onError: (err) => setError(err.message),
      }
    );
  }

  function handleCancel() {
    if (!account) return;
    setError(""); setSuccess("");
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::pact::cancel_pact`,
      typeArguments: [coinType],
      arguments: [tx.object(id)],
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
      typeArguments: [coinType],
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

  const isSender = account?.address?.toLowerCase() === fields?.sender?.toLowerCase();
  const isRecipient = account?.address?.toLowerCase() === fields?.recipient?.toLowerCase();
  const isPending2 = String(fields?.status) === "0";
  const statusInfo = STATUS_LABELS[String(fields?.status ?? "0")];
  const deadlineMs = fields?.deadline ? Number(fields.deadline) : 0;
  const deadlineDate = deadlineMs > 0 ? new Date(deadlineMs).toLocaleString() : "None";

  return (
    <main className="min-h-screen bg-[#060B18]">
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
            <div className="p-6 rounded-xl border border-[#0F1E3D] bg-[#0F0F1A] space-y-3">
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
              <div className="p-4 rounded-xl border border-[#0F1E3D] bg-[#0F0F1A]">
                <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">Summary</p>
                <p className="text-sm">{fields.description}</p>
              </div>
            )}

            {walrusBlobId && (
              <div className="p-4 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <p className="text-xs font-semibold text-white">Terms Document</p>
                    <span className="text-xs text-[#6B7280]">— stored on Walrus</span>
                  </div>
                  <a
                    href={walrusBlobUrl(walrusBlobId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2563EB] hover:underline"
                  >
                    Open raw
                  </a>
                </div>
                {walrusLoading && <p className="text-xs text-[#6B7280]">Fetching from Walrus...</p>}
                {walrusContent && !walrusLoading && (
                  <pre className="text-xs text-[#A1A1AA] whitespace-pre-wrap break-words max-h-48 overflow-y-auto leading-relaxed">
                    {walrusContent}
                  </pre>
                )}
                <p className="text-xs text-[#374151] font-mono mt-2 break-all">blob: {walrusBlobId}</p>
              </div>
            )}

            {receiptBlobId && (
              <div className="p-4 rounded-xl border border-[#10B981]/30 bg-[#10B981]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p className="text-xs font-semibold text-white">Completion Receipt</p>
                    <span className="text-xs text-[#6B7280]">— saved to Walrus</span>
                  </div>
                  <a
                    href={walrusBlobUrl(receiptBlobId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#10B981] hover:underline"
                  >
                    View receipt
                  </a>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-[#EF4444] bg-[#EF444410] px-4 py-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-[#10B981] bg-[#10B98110] px-4 py-3 rounded-lg">{success}</p>}

            {isPending2 && (
              <div className="flex gap-3">
                {isSender && (
                  <>
                    <button
                      onClick={handleComplete}
                      disabled={isPending}
                      className="flex-1 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 font-medium text-sm transition-colors"
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

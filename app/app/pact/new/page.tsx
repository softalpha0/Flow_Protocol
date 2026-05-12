"use client";

import { useState, useRef } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";
import { uploadToWalrus } from "@/lib/walrus";

const COIN_OPTIONS = [
  { label: "SUI", value: COIN_TYPES.SUI },
  { label: "USDC", value: COIN_TYPES.USDC },
  { label: "USDT", value: COIN_TYPES.USDT },
];

export default function NewPact() {
  const account = useCurrentAccount();
  const router = useRouter();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const fileRef = useRef<HTMLInputElement>(null);

  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");
  const [extendedTerms, setExtendedTerms] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [coinType, setCoinType] = useState(COIN_TYPES.SUI);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
    if (file) setExtendedTerms("");
  }

  async function handleCreate() {
    if (!account) return;
    setError("");

    try {
      let walrusBlobId = "";

      const hasAttachment = attachedFile || extendedTerms.trim();

      if (hasAttachment) {
        setUploading(true);
        try {
          if (attachedFile) {
            const bytes = new Uint8Array(await attachedFile.arrayBuffer());
            walrusBlobId = await uploadToWalrus(bytes);
          } else {
            walrusBlobId = await uploadToWalrus(extendedTerms.trim());
          }
        } finally {
          setUploading(false);
        }
      }

      const amountMist = suiToMist(amount);
      const deadlineMs = deadline ? new Date(deadline).getTime() : 0;
      const descBytes = Array.from(new TextEncoder().encode(description));
      const blobBytes = Array.from(new TextEncoder().encode(walrusBlobId));

      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [amountMist]);

      tx.moveCall({
        target: `${PACKAGE_ID}::pact::create_pact`,
        typeArguments: [coinType],
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
            const created = result.objectChanges?.find(
              (c) => c.type === "created" && c.objectType?.includes("::pact::Pact")
            );
            if (created && "objectId" in created) {
              router.push(`/app/pact/${created.objectId}`);
            } else {
              router.push("/app");
            }
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
        <h1 className="text-2xl font-bold mb-2">Create Pact</h1>
        <p className="text-sm text-[#6B7280] mb-8">Lock funds in milestone escrow. Release when work is done.</p>

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
                      ? "bg-[#7C3AED] text-white"
                      : "bg-[#0F0F1A] border border-[#1A1A2E] text-[#6B7280] hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

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
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line description of the milestone..."
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] resize-none"
            />
          </div>

          <div className="p-4 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A] space-y-3">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-xs font-semibold text-white">Attach Terms to Walrus <span className="text-[#6B7280] font-normal">(optional)</span></p>
            </div>
            <p className="text-xs text-[#6B7280]">Upload a file or write extended terms. Stored permanently on Walrus decentralised storage — the blob ID is saved on-chain with this pact.</p>

            <div
              onClick={() => fileRef.current?.click()}
              className={`w-full px-4 py-3 rounded-lg border border-dashed text-sm text-center cursor-pointer transition-colors ${
                attachedFile
                  ? "border-[#7C3AED] text-[#7C3AED] bg-[#7C3AED]/5"
                  : "border-[#1A1A2E] text-[#6B7280] hover:border-[#374151] hover:text-white"
              }`}
            >
              {attachedFile ? attachedFile.name : "Click to upload a file"}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />

            {!attachedFile && (
              <>
                <p className="text-xs text-center text-[#6B7280]">or write extended terms</p>
                <textarea
                  value={extendedTerms}
                  onChange={(e) => setExtendedTerms(e.target.value)}
                  placeholder="Full deliverables, acceptance criteria, revision policy..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-[#08080F] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] resize-none"
                />
              </>
            )}

            {attachedFile && (
              <button
                onClick={() => { setAttachedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="text-xs text-[#6B7280] hover:text-[#EF4444] transition-colors"
              >
                Remove file
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5.0"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-[#0F0F1A] border border-[#1A1A2E] text-sm focus:outline-none focus:border-[#7C3AED] pr-16"
              />
              <span className="absolute right-4 top-3 text-sm text-[#6B7280]">
                {COIN_OPTIONS.find((o) => o.value === coinType)?.label}
              </span>
            </div>
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
            disabled={isPending || uploading || !recipient || !description || !amount}
            className="w-full py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {uploading ? "Uploading to Walrus..." : isPending ? "Creating..." : "Lock Funds in Pact"}
          </button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useRef } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useRouter } from "next/navigation";
import { PACKAGE_ID, COIN_TYPES } from "@/constants";
import { suiToMist } from "@/lib/sui";
import { uploadToWalrus } from "@/lib/walrus";
import { useZkLogin } from "@/contexts/ZkLoginContext";

const COIN_OPTIONS = [
  { label: "SUI", value: COIN_TYPES.SUI },
  { label: "USDC", value: COIN_TYPES.USDC },
  { label: "USDT", value: COIN_TYPES.USDT },
];

export default function NewPact() {
  const account = useCurrentAccount();
  const { session, execute } = useZkLogin();
  const activeAddress = account?.address ?? session?.address ?? null;
  const router = useRouter();
  const { mutate: signAndExecute, isPending: walletPending } = useSignAndExecuteTransaction();
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
  const [loading, setLoading] = useState(false);
  const isPending = walletPending || loading;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
    if (file) setExtendedTerms("");
  }

  async function handleCreate() {
    if (!activeAddress) return;
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
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);
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
        <h1 className="text-2xl font-bold mb-2">Create Pact</h1>
        <p className="text-sm text-[#6B7280] mb-8">Lock funds in milestone escrow. Release when work is done.</p>

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
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="One-line description of the milestone..." rows={2}
              className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] resize-none" />
          </div>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-xs font-semibold text-[#111827]">Attach Terms to Walrus <span className="text-[#6B7280] font-normal">(optional)</span></p>
            </div>
            <p className="text-xs text-[#6B7280]">Upload a file or write extended terms. Stored permanently on Walrus — the blob ID is saved on-chain with this pact.</p>
            <div onClick={() => fileRef.current?.click()}
              className={`w-full px-4 py-3 rounded-lg border border-dashed text-sm text-center cursor-pointer transition-colors ${attachedFile ? "border-[#2563EB] text-[#2563EB] bg-[#2563EB]/5" : "border-[#E2E8F0] text-[#6B7280] hover:border-[#374151] hover:text-[#111827]"}`}>
              {attachedFile ? attachedFile.name : "Click to upload a file"}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
            {!attachedFile && (
              <>
                <p className="text-xs text-center text-[#6B7280]">or write extended terms</p>
                <textarea value={extendedTerms} onChange={(e) => setExtendedTerms(e.target.value)}
                  placeholder="Full deliverables, acceptance criteria, revision policy..." rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] resize-none" />
              </>
            )}
            {attachedFile && (
              <button onClick={() => { setAttachedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="text-xs text-[#6B7280] hover:text-[#EF4444] transition-colors">
                Remove file
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <div className="relative">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5.0" step="0.01" min="0"
                className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB] pr-16" />
              <span className="absolute right-4 top-3 text-sm text-[#6B7280]">{COIN_OPTIONS.find((o) => o.value === coinType)?.label}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>

          {error && <p className="text-sm text-[#EF4444] bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

          <button onClick={handleCreate} disabled={isPending || uploading || !recipient || !description || !amount}
            className="w-full py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors">
            {uploading ? "Uploading to Walrus..." : isPending ? "Creating..." : "Lock Funds in Pact"}
          </button>
        </div>
      </div>
    </main>
  );
}

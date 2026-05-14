"use client";

import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import Link from "next/link";
import { PACKAGE_ID } from "@/constants";
import { mistToSui, shortenAddress } from "@/lib/sui";
import { useZkLogin } from "@/contexts/ZkLoginContext";

type EventFields = {
  stream_id?: string;
  pact_id?: string;
  sender: string;
  recipient: string;
  amount?: string;
  deposit?: string;
  rate_per_second?: string;
  deadline?: string;
};

const STREAM_CREATED = `${PACKAGE_ID}::stream::StreamCreated`;
const PACT_CREATED = `${PACKAGE_ID}::pact::PactCreated`;

export default function Dashboard() {
  const account = useCurrentAccount();
  const { session } = useZkLogin();
  const activeAddress = account?.address ?? session?.address ?? null;

  const { data: sentEvents } = useSuiClientQuery(
    "queryEvents",
    {
      query: { Sender: activeAddress! },
      limit: 100,
    },
    { enabled: !!activeAddress }
  );

  const { data: globalStreamEvents } = useSuiClientQuery(
    "queryEvents",
    {
      query: { MoveEventType: STREAM_CREATED },
      limit: 100,
    },
    { enabled: !!activeAddress }
  );

  const { data: globalPactEvents } = useSuiClientQuery(
    "queryEvents",
    {
      query: { MoveEventType: PACT_CREATED },
      limit: 100,
    },
    { enabled: !!activeAddress }
  );

  if (!activeAddress) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-40 text-center">
          <h2 className="text-2xl font-semibold mb-3">Connect your wallet</h2>
          <p className="text-[#6B7280] text-sm">Sign in with Google or connect a Sui wallet to access your dashboard.</p>
        </div>
      </main>
    );
  }

  const sentStreams = (sentEvents?.data ?? []).filter(e => e.type === STREAM_CREATED);
  const receivedStreams = (globalStreamEvents?.data ?? []).filter(e => {
    const f = e.parsedJson as EventFields;
    return f?.recipient === activeAddress;
  });
  const seenStreamKeys = new Set<string>();
  const myStreams = [...sentStreams, ...receivedStreams].filter(e => {
    const key = e.id.txDigest + e.id.eventSeq;
    if (seenStreamKeys.has(key)) return false;
    seenStreamKeys.add(key);
    return true;
  });

  const sentPacts = (sentEvents?.data ?? []).filter(e => e.type === PACT_CREATED);
  const receivedPacts = (globalPactEvents?.data ?? []).filter(e => {
    const f = e.parsedJson as EventFields;
    return f?.recipient === activeAddress;
  });
  const seenPactKeys = new Set<string>();
  const myPacts = [...sentPacts, ...receivedPacts].filter(e => {
    const key = e.id.txDigest + e.id.eventSeq;
    if (seenPactKeys.has(key)) return false;
    seenPactKeys.add(key);
    return true;
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Link href="/app/stream/new" className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors group">
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Stream</p>
            <p className="font-semibold group-hover:text-[#2563EB] transition-colors">Create a payment stream</p>
            <p className="text-sm text-[#6B7280] mt-1">Pay per second to any address</p>
          </Link>
          <Link href="/app/pact/new" className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors group">
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Pact</p>
            <p className="font-semibold group-hover:text-[#2563EB] transition-colors">Create a pact</p>
            <p className="text-sm text-[#6B7280] mt-1">Milestone escrow with deadline</p>
          </Link>
          <Link href="/app/send" className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors group">
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Instant</p>
            <p className="font-semibold group-hover:text-[#2563EB] transition-colors">Send or split</p>
            <p className="text-sm text-[#6B7280] mt-1">One or many recipients</p>
          </Link>
        </div>

        {myStreams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Streams</h2>
            <div className="space-y-2">
              {myStreams.map((e) => {
                const f = e.parsedJson as EventFields;
                const id = f.stream_id;
                const isSender = f.sender === activeAddress;
                return (
                  <Link key={e.id.txDigest + e.id.eventSeq} href={`/app/stream/${id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors">
                    <div>
                      <p className="text-sm font-medium">
                        {isSender ? "To " : "From "}
                        <span className="font-mono text-[#2563EB]">{shortenAddress(isSender ? f.recipient : f.sender)}</span>
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {mistToSui(BigInt(f.deposit ?? 0))} SUI deposited · {mistToSui(BigInt(f.rate_per_second ?? 0))} SUI/sec
                      </p>
                    </div>
                    <span className="text-xs text-[#6B7280]">View</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {myPacts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Pacts</h2>
            <div className="space-y-2">
              {myPacts.map((e) => {
                const f = e.parsedJson as EventFields;
                const id = f.pact_id;
                const isSender = f.sender === activeAddress;
                return (
                  <Link key={e.id.txDigest + e.id.eventSeq} href={`/app/pact/${id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors">
                    <div>
                      <p className="text-sm font-medium">
                        {isSender ? "To " : "From "}
                        <span className="font-mono text-[#2563EB]">{shortenAddress(isSender ? f.recipient : f.sender)}</span>
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{mistToSui(BigInt(f.amount ?? 0))} SUI locked</p>
                    </div>
                    <span className="text-xs text-[#6B7280]">View</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {myStreams.length === 0 && myPacts.length === 0 && (
          <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-center">
            <p className="text-sm text-[#6B7280]">No activity yet. Create a stream or pact to get started.</p>
          </div>
        )}

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mt-4">
          <p className="text-xs text-[#6B7280]">Signed in as</p>
          <p className="font-mono text-xs mt-1 text-[#2563EB] break-all">{activeAddress}</p>
        </div>
      </div>
    </main>
  );
}

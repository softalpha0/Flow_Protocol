"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrentAccount, useSuiClientQuery, useSuiClient } from "@mysten/dapp-kit";
import Link from "next/link";
import { mistToSui, shortenAddress } from "@/lib/sui";
import { useZkLogin } from "@/contexts/ZkLoginContext";

const ORIGINAL_PACKAGE_ID = "0x3170c4670ac048b33460524a1ee6bad245f86bac32345e761257ff970540c94b";

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

type StreamObj = {
  balance: string;
  last_withdrawn: string;
  is_active: boolean;
};

type PactObj = {
  description: string;
  walrus_blob_id: string;
  status: number;
};

function LiveCounter({ ratePerSecond, lastWithdrawn }: { ratePerSecond: number; lastWithdrawn: number }) {
  const [streamed, setStreamed] = useState(0);
  useEffect(() => {
    const update = () => setStreamed((Date.now() - lastWithdrawn) / 1000 * ratePerSecond);
    update();
    const id = setInterval(update, 100);
    return () => clearInterval(id);
  }, [ratePerSecond, lastWithdrawn]);

  const [int, dec] = (streamed / 1e9).toFixed(5).split(".");
  return (
    <span className="font-mono">
      <span className="text-[#2563EB] text-2xl font-bold">{int}</span>
      <span className="text-[#2563EB] text-2xl font-bold">.</span>
      <span className="text-[#2563EB] text-lg font-bold">{dec}</span>
      <span className="text-[#6B7280] text-sm ml-1">SUI</span>
    </span>
  );
}

const PACT_STATUS = ["Pending", "Completed", "Disputed", "Cancelled"];
const PACT_STATUS_STYLE = [
  "text-amber-600 bg-amber-50 border border-amber-200",
  "text-green-600 bg-green-50 border border-green-200",
  "text-red-600 bg-red-50 border border-red-200",
  "text-[#6B7280] bg-[#F8FAFC] border border-[#E2E8F0]",
];

export default function Dashboard() {
  const account = useCurrentAccount();
  const { session } = useZkLogin();
  const suiClient = useSuiClient();
  const activeAddress = account?.address ?? session?.address ?? null;

  const [streamObjs, setStreamObjs] = useState<Record<string, StreamObj>>({});
  const [pactObjs, setPactObjs] = useState<Record<string, PactObj>>({});

  // staleTime: 0 ensures fresh data is always fetched on mount — no stale cache
  const queryOpts = { staleTime: 0, refetchOnMount: true } as const;

  const { data: streamEvents, isLoading: streamsLoading } = useSuiClientQuery(
    "queryEvents",
    { query: { MoveEventType: `${ORIGINAL_PACKAGE_ID}::stream::StreamCreated` }, limit: 100 },
    { enabled: !!activeAddress, ...queryOpts }
  );

  const { data: pactEvents, isLoading: pactsLoading } = useSuiClientQuery(
    "queryEvents",
    { query: { MoveEventType: `${ORIGINAL_PACKAGE_ID}::pact::PactCreated` }, limit: 100 },
    { enabled: !!activeAddress, ...queryOpts }
  );

  const myStreams = (streamEvents?.data ?? []).filter(e => {
    const f = e.parsedJson as EventFields;
    return f?.sender === activeAddress || f?.recipient === activeAddress;
  });

  const myPacts = (pactEvents?.data ?? []).filter(e => {
    const f = e.parsedJson as EventFields;
    return f?.sender === activeAddress || f?.recipient === activeAddress;
  });

  const fetchStreamObjs = useCallback(async () => {
    const ids = myStreams.map(e => (e.parsedJson as EventFields).stream_id!).filter(Boolean);
    if (!ids.length) return;
    const results = await suiClient.multiGetObjects({ ids, options: { showContent: true } });
    const map: Record<string, StreamObj> = {};
    results.forEach((obj, i) => {
      if (obj.data?.content?.dataType === "moveObject") {
        const f = (obj.data.content as { fields: Record<string, unknown> }).fields;
        map[ids[i]] = {
          balance: String((f.balance as { fields: { value: string } })?.fields?.value ?? f.balance ?? "0"),
          last_withdrawn: String(f.last_withdrawn ?? "0"),
          is_active: f.is_active === true || f.is_active === "true",
        };
      }
    });
    setStreamObjs(map);
  }, [myStreams.length, suiClient]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPactObjs = useCallback(async () => {
    const ids = myPacts.map(e => (e.parsedJson as EventFields).pact_id!).filter(Boolean);
    if (!ids.length) return;
    const results = await suiClient.multiGetObjects({ ids, options: { showContent: true } });
    const map: Record<string, PactObj> = {};
    results.forEach((obj, i) => {
      if (obj.data?.content?.dataType === "moveObject") {
        const f = (obj.data.content as { fields: Record<string, unknown> }).fields;
        map[ids[i]] = {
          description: String(f.description ?? ""),
          walrus_blob_id: String(f.walrus_blob_id ?? ""),
          status: Number(f.status ?? 0),
        };
      }
    });
    setPactObjs(map);
  }, [myPacts.length, suiClient]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchStreamObjs(); }, [fetchStreamObjs]);
  useEffect(() => { fetchPactObjs(); }, [fetchPactObjs]);

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

  const loading = streamsLoading || pactsLoading;
  const totalDeposited = myStreams.reduce((s, e) => s + Number((e.parsedJson as EventFields).deposit ?? 0), 0);
  const totalLocked = myPacts.reduce((s, e) => s + Number((e.parsedJson as EventFields).amount ?? 0), 0);
  const activeStreamCount = myStreams.filter(e => {
    const obj = streamObjs[(e.parsedJson as EventFields).stream_id!];
    return obj ? obj.is_active : true;
  }).length;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-16">

        {/* Back to home */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] transition-colors group">
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
            <p className="text-[#6B7280] text-sm mt-1">Overview of your payment flows</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/app/stream/new"
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium transition-colors">
              + New Stream
            </Link>
            <Link href="/app/pact/new"
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] text-[#374151] text-sm font-medium transition-colors">
              + New Pact
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium mb-3">Total Streaming</p>
            {loading
              ? <div className="h-8 w-24 bg-[#E2E8F0] rounded animate-pulse" />
              : <p className="text-2xl font-bold text-[#111827]">{mistToSui(BigInt(totalDeposited))}</p>
            }
            <p className="text-xs text-[#6B7280] mt-1">SUI deposited · {activeStreamCount} active</p>
          </div>

          <div className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium mb-3">Pacts Locked</p>
            {loading
              ? <div className="h-8 w-24 bg-[#E2E8F0] rounded animate-pulse" />
              : <p className="text-2xl font-bold text-[#111827]">{mistToSui(BigInt(totalLocked))}</p>
            }
            <p className="text-xs text-[#6B7280] mt-1">SUI in escrow · {myPacts.length} pact{myPacts.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Powered By */}
        <div className="flex items-center gap-6 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mb-8">
          <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-medium">Powered by</p>
          <div>
            <span className="text-xs font-semibold text-[#111827]">DeepBook</span>
            <span className="text-xs text-[#6B7280] ml-1">Swaps</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#111827]">Walrus</span>
            <span className="text-xs text-[#6B7280] ml-1">Records</span>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3 mb-8">
            {[1, 2].map(i => (
              <div key={i} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] animate-pulse">
                <div className="h-4 w-32 bg-[#E2E8F0] rounded mb-3" />
                <div className="h-8 w-40 bg-[#E2E8F0] rounded mb-2" />
                <div className="h-3 w-48 bg-[#E2E8F0] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Streams */}
        {!loading && myStreams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Streams</h2>
            <div className="space-y-3">
              {myStreams.map((e) => {
                const f = e.parsedJson as EventFields;
                const id = f.stream_id!;
                const obj = streamObjs[id];
                const isSender = f.sender === activeAddress;
                const ratePerSec = Number(f.rate_per_second ?? 0);
                const deposit = Number(f.deposit ?? 0);
                const lastWithdrawn = obj ? Number(obj.last_withdrawn) : Number(e.timestampMs ?? Date.now());
                const isActive = obj ? obj.is_active : true;
                const remaining = obj ? Number(obj.balance) : deposit;
                const spent = Math.max(0, deposit - remaining);
                const pct = deposit > 0 ? Math.min(100, (spent / deposit) * 100) : 0;

                return (
                  <div key={id} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">
                          {isSender ? `To ${shortenAddress(f.recipient)}` : `From ${shortenAddress(f.sender)}`}
                        </p>
                        <p className="text-xs text-[#6B7280] font-mono mt-0.5">{shortenAddress(id)}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive ? "text-green-600 bg-green-50 border border-green-200" : "text-[#6B7280] bg-[#F8FAFC] border border-[#E2E8F0]"}`}>
                        {isActive ? "Active" : "Ended"}
                      </span>
                    </div>

                    <p className="text-xs text-[#6B7280] mb-1">Streamed</p>
                    {isActive
                      ? <LiveCounter ratePerSecond={ratePerSec} lastWithdrawn={lastWithdrawn} />
                      : <span className="text-xl font-bold text-[#6B7280] font-mono">{mistToSui(BigInt(spent))} SUI</span>
                    }
                    <p className="text-xs text-[#6B7280] mt-1 mb-3">
                      of {mistToSui(BigInt(deposit))} SUI total · {mistToSui(BigInt(ratePerSec))}/sec
                    </p>

                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full mb-4">
                      <div className="h-1.5 rounded-full bg-[#2563EB]" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex gap-2">
                      {!isSender && isActive && (
                        <Link href={`/app/stream/${id}`}
                          className="flex-1 py-2 rounded-lg bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] text-xs font-semibold text-center transition-colors">
                          Claim
                        </Link>
                      )}
                      {isSender && isActive && (
                        <Link href={`/app/stream/${id}`}
                          className="flex-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold text-center transition-colors border border-red-100">
                          Cancel
                        </Link>
                      )}
                      <Link href={`/app/stream/${id}`}
                        className="flex-1 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-[#6B7280] hover:text-[#2563EB] text-xs font-semibold text-center transition-colors">
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pacts */}
        {!loading && myPacts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Pacts</h2>
            <div className="space-y-3">
              {myPacts.map((e) => {
                const f = e.parsedJson as EventFields;
                const id = f.pact_id!;
                const obj = pactObjs[id];
                const isSender = f.sender === activeAddress;
                const amount = Number(f.amount ?? 0);
                const deadline = Number(f.deadline ?? 0);
                const status = obj?.status ?? 0;
                const desc = obj?.description || (isSender ? `To ${shortenAddress(f.recipient)}` : `From ${shortenAddress(f.sender)}`);
                const blob = obj?.walrus_blob_id ?? "";

                return (
                  <div key={id} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-sm font-semibold text-[#111827] truncate">{desc}</p>
                        <p className="text-xs text-[#6B7280] font-mono mt-0.5">{shortenAddress(id)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#111827]">{mistToSui(BigInt(amount))} SUI</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${PACT_STATUS_STYLE[status] ?? PACT_STATUS_STYLE[3]}`}>
                          {PACT_STATUS[status] ?? "Unknown"}
                        </span>
                      </div>
                    </div>

                    {deadline > 0 && (
                      <p className="text-xs text-[#6B7280] mb-3">
                        Deadline: {new Date(deadline).toLocaleDateString()}
                      </p>
                    )}

                    {blob && blob.length > 2 && (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] mb-3">
                        <span className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide">Walrus</span>
                        <span className="text-xs text-[#6B7280] font-mono">{blob.slice(0, 14)}…</span>
                      </div>
                    )}

                    <Link href={`/app/pact/${id}`}
                      className="block w-full py-2 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-[#6B7280] hover:text-[#2563EB] text-xs font-semibold text-center transition-colors">
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && myStreams.length === 0 && myPacts.length === 0 && (
          <div className="p-8 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-center">
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

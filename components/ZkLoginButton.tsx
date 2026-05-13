"use client";

import { useState, useRef, useEffect } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { beginZkLogin } from "@/lib/zklogin";
import { useZkLogin } from "@/contexts/ZkLoginContext";

function formatSui(mist: bigint): string {
  const sui = Number(mist) / 1_000_000_000;
  return sui.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export default function ZkLoginButton() {
  const suiClient = useSuiClient();
  const { session, logout } = useZkLogin();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: balanceData } = useSuiClientQuery(
    "getBalance",
    { owner: session?.address ?? "" },
    { enabled: !!session?.address }
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function copyAddress() {
    if (!session) return;
    navigator.clipboard.writeText(session.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (session) {
    const balance = balanceData ? formatSui(BigInt(balanceData.totalBalance)) : "—";
    const short = `${session.address.slice(0, 6)}...${session.address.slice(-4)}`;

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2563EB] to-[#38BDF8] flex-shrink-0" />
          <span className="text-xs font-mono text-[#111827]">{short}</span>
          <svg className={`w-3 h-3 text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#E2E8F0] bg-white shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0]">
              <p className="text-xs text-[#6B7280] mb-1">SUI Balance</p>
              <p className="text-2xl font-bold text-[#111827]">{balance} <span className="text-sm font-normal text-[#6B7280]">SUI</span></p>
            </div>
            <div className="p-4 border-b border-[#E2E8F0]">
              <p className="text-xs text-[#6B7280] mb-1">Address</p>
              <p className="font-mono text-xs text-[#111827] break-all">{session.address}</p>
              <button
                onClick={copyAddress}
                className="mt-2 text-xs text-[#2563EB] hover:underline"
              >
                {copied ? "Copied!" : "Copy address"}
              </button>
            </div>
            <div className="p-3">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full text-sm text-[#EF4444] hover:bg-red-50 py-2 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => beginZkLogin(suiClient as Parameters<typeof beginZkLogin>[0])}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#111827] hover:border-[#2563EB] transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in with Google
    </button>
  );
}

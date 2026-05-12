"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import ZkLoginButton from "@/components/ZkLoginButton";
import { useZkLogin } from "@/contexts/ZkLoginContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { session } = useZkLogin();

  const AuthButton = session ? <ZkLoginButton /> : (
    <div className="flex items-center gap-2">
      <ZkLoginButton />
      <span className="text-xs text-[#374151]">or</span>
      <ConnectButton />
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1A2E] bg-[#08080F]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight flex-shrink-0">
          flow<span className="text-[#7C3AED]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/app" className="text-sm text-[#6B7280] hover:text-white transition-colors">Dashboard</Link>
          <Link href="/app/stream/new" className="text-sm text-[#6B7280] hover:text-white transition-colors">Stream</Link>
          <Link href="/app/pact/new" className="text-sm text-[#6B7280] hover:text-white transition-colors">Pact</Link>
          <Link href="/app/send" className="text-sm text-[#6B7280] hover:text-white transition-colors">Send</Link>
          <Link href="/sdk" className="text-sm text-[#6B7280] hover:text-white transition-colors">SDK</Link>
          {AuthButton}
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#1A1A2E] bg-[#08080F] px-6 py-4 flex flex-col gap-4">
          <Link href="/app" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-white">Dashboard</Link>
          <Link href="/app/stream/new" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-white">Stream</Link>
          <Link href="/app/pact/new" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-white">Pact</Link>
          <Link href="/app/send" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-white">Send</Link>
          <Link href="/sdk" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-white">SDK</Link>
          <div className="pt-2 flex flex-col gap-2">{AuthButton}</div>
        </div>
      )}
    </nav>
  );
}

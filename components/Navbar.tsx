"use client";

import Link from "next/link";
import Image from "next/image";
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
      <span className="text-xs text-[#9CA3AF]">or</span>
      <ConnectButton />
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/logo.png" alt="Flow" width={32} height={32} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111827]">flow<span className="text-[#2563EB]">.</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/app" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Dashboard</Link>
          <Link href="/app/stream/new" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Stream</Link>
          <Link href="/app/pact/new" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Pact</Link>
          <Link href="/app/send" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">Send</Link>
          <Link href="/sdk" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">SDK</Link>
          {AuthButton}
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)}>
          <span className={`block w-5 h-0.5 bg-[#111827] transition-transform duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#111827] transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-[#111827] transition-transform duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-6 py-4 flex flex-col gap-4">
          <Link href="/app" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">Dashboard</Link>
          <Link href="/app/stream/new" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">Stream</Link>
          <Link href="/app/pact/new" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">Pact</Link>
          <Link href="/app/send" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">Send</Link>
          <Link href="/sdk" onClick={() => setOpen(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">SDK</Link>
          <div className="pt-2 flex flex-col gap-2">{AuthButton}</div>
        </div>
      )}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1A2E] bg-[#08080F]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          flow<span className="text-[#7C3AED]">.</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app" className="text-sm text-[#6B7280] hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/app/stream/new" className="text-sm text-[#6B7280] hover:text-white transition-colors">
            Stream
          </Link>
          <Link href="/app/pact/new" className="text-sm text-[#6B7280] hover:text-white transition-colors">
            Pact
          </Link>
          <Link href="/app/send" className="text-sm text-[#6B7280] hover:text-white transition-colors">
            Send
          </Link>
          <Link href="/sdk" className="text-sm text-[#6B7280] hover:text-white transition-colors">
            SDK
          </Link>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}

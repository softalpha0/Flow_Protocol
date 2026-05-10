"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <main className="min-h-screen bg-[#08080F]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-40 text-center">
          <h2 className="text-2xl font-semibold mb-3">Connect your wallet</h2>
          <p className="text-[#6B7280] text-sm">Connect a Sui wallet to access your dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080F]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/app/stream/new"
            className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A] hover:border-[#7C3AED] transition-colors group"
          >
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Stream</p>
            <p className="font-semibold group-hover:text-[#A78BFA] transition-colors">Create a payment stream</p>
            <p className="text-sm text-[#6B7280] mt-1">Pay per second to any address</p>
          </Link>
          <Link
            href="/app/pact/new"
            className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A] hover:border-[#7C3AED] transition-colors group"
          >
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Pact</p>
            <p className="font-semibold group-hover:text-[#A78BFA] transition-colors">Create a pact</p>
            <p className="text-sm text-[#6B7280] mt-1">Milestone escrow with deadline</p>
          </Link>
          <Link
            href="/app/send"
            className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A] hover:border-[#7C3AED] transition-colors group"
          >
            <p className="text-xs text-[#6B7280] mb-2 uppercase tracking-wide">Instant</p>
            <p className="font-semibold group-hover:text-[#A78BFA] transition-colors">Send or split</p>
            <p className="text-sm text-[#6B7280] mt-1">One or many recipients</p>
          </Link>
        </div>
        <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A]">
          <p className="text-sm text-[#6B7280]">Connected as</p>
          <p className="font-mono text-sm mt-1 text-[#A78BFA] break-all">{account.address}</p>
        </div>
      </div>
    </main>
  );
}

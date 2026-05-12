import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080F]">
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1A1A2E] bg-[#0F0F1A] text-xs text-[#A78BFA] mb-8">
          Built on Sui
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Payments that move<br />
          <span className="text-[#7C3AED]">at the speed of money</span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-10">
          Stream salaries by the second. Lock funds in milestone escrow. Split payments instantly. All onchain, no custody.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/app"
            className="px-6 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition-colors"
          >
            Open App
          </Link>
          <Link
            href="/app/stream/new"
            className="px-6 py-3 rounded-lg border border-[#1A1A2E] hover:border-[#7C3AED] text-white font-medium text-sm transition-colors"
          >
            Start Streaming
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A]">
          <div className="w-10 h-10 rounded-lg bg-[#1E1040] flex items-center justify-center mb-4">
            <span className="text-[#A78BFA] text-lg font-bold">S</span>
          </div>
          <h3 className="font-semibold mb-2">Stream</h3>
          <p className="text-sm text-[#6B7280]">
            Pay salaries, subscriptions, or any recurring amount drip by drip — per second, on Sui.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A]">
          <div className="w-10 h-10 rounded-lg bg-[#1E1040] flex items-center justify-center mb-4">
            <span className="text-[#A78BFA] text-lg font-bold">P</span>
          </div>
          <h3 className="font-semibold mb-2">Pact</h3>
          <p className="text-sm text-[#6B7280]">
            Create milestone-based escrow agreements. Funds release only when work is verified complete.
          </p>
        </div>
        <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#0F0F1A]">
          <div className="w-10 h-10 rounded-lg bg-[#1E1040] flex items-center justify-center mb-4">
            <span className="text-[#A78BFA] text-lg font-bold">I</span>
          </div>
          <h3 className="font-semibold mb-2">Instant</h3>
          <p className="text-sm text-[#6B7280]">
            Send or split payments to multiple addresses in a single transaction. Fast and final.
          </p>
        </div>
      </section>
    </main>
  );
}

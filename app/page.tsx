import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080F] overflow-x-hidden">
      <Navbar />

      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24 text-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#7C3AED] opacity-10 rounded-full blur-[120px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1A1A2E] bg-[#0F0F1A] text-xs text-[#A78BFA] mb-8">
            Live on Sui Testnet
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The payment layer<br />
            <span className="text-[#7C3AED]">for the open internet</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Flow is a programmable payments protocol on Sui. Stream any asset by the second, lock funds in milestone escrow, or split payments across a team — all onchain, non-custodial, with any token.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/app" className="px-6 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition-colors">
              Launch App
            </Link>
            <Link href="/app/stream/new" className="px-6 py-3 rounded-lg border border-[#1A1A2E] hover:border-[#7C3AED] text-white font-medium text-sm transition-colors">
              Start Streaming
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#1A1A2E] bg-[#0F0F1A]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-white mb-1">400ms</p>
            <p className="text-sm text-[#6B7280]">Settlement time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">Any asset</p>
            <p className="text-sm text-[#6B7280]">SUI, USDC, USDT and more</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">Non-custodial</p>
            <p className="text-sm text-[#6B7280]">You control your funds</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white mb-1">3 primitives</p>
            <p className="text-sm text-[#6B7280]">Stream, Pact, Instant</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs text-[#A78BFA] uppercase tracking-widest mb-3">Primitives</p>
          <h2 className="text-3xl md:text-4xl font-bold">Three ways to move money</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-[#1A1A2E] bg-[#0F0F1A] hover:border-[#7C3AED40] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#1E1040] flex items-center justify-center mb-6">
              <span className="text-[#A78BFA] text-xl font-bold">S</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Stream</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Pay per second. Salary, freelance work, subscriptions — money flows continuously to the recipient. Cancel anytime and get the unspent balance back.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Real-time per-second payments
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Cancel and reclaim unused funds
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Works with any Sui token
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#7C3AED40] bg-[#0F0F1A] relative">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#7C3AED20] text-[#A78BFA] text-xs">Popular</div>
            <div className="w-12 h-12 rounded-xl bg-[#1E1040] flex items-center justify-center mb-6">
              <span className="text-[#A78BFA] text-xl font-bold">P</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Pact</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Milestone-based escrow. Lock funds onchain, define the terms, and release payment when the work is done. Dispute mechanism built in — no middleman needed.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Funds locked until milestone complete
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Optional deadline enforcement
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Built-in dispute resolution
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#1A1A2E] bg-[#0F0F1A] hover:border-[#7C3AED40] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#1E1040] flex items-center justify-center mb-6">
              <span className="text-[#A78BFA] text-xl font-bold">I</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Send to one address or split across an entire team in a single transaction. Fast, final, and cheap — no coordination overhead.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Single or multi-recipient
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Split in one transaction
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></span>
                Instant finality on Sui
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F0F1A] border-y border-[#1A1A2E]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs text-[#A78BFA] uppercase tracking-widest mb-3">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-bold">Built for how work happens now</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#08080F]">
              <p className="text-sm font-semibold text-[#A78BFA] mb-2">Remote teams</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">Stream salaries by the second to contributors anywhere in the world. No bank accounts, no wire transfers, no delays.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#08080F]">
              <p className="text-sm font-semibold text-[#A78BFA] mb-2">Freelance work</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">Create a Pact with clear milestone terms. Clients lock funds upfront, freelancers deliver, payment releases instantly — no chasing invoices.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#08080F]">
              <p className="text-sm font-semibold text-[#A78BFA] mb-2">DAO payroll</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">Split contributor payments across a whole team in one transaction. Pay in USDC, USDT, or any token your DAO holds.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#1A1A2E] bg-[#08080F]">
              <p className="text-sm font-semibold text-[#A78BFA] mb-2">Onchain subscriptions</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">Replace recurring payment infrastructure with a Stream. Subscribers deposit once, and the service provider earns continuously.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs text-[#A78BFA] uppercase tracking-widest mb-3">Developer SDK</p>
            <h2 className="text-3xl font-bold mb-4">Add programmable payments to any app</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              The Flow SDK lets you integrate streaming, escrow, and split payments into your product in minutes. Returns a transaction for any Sui wallet to sign.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0"></span>
                Works with any Sui wallet
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0"></span>
                TypeScript-first with full type safety
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0"></span>
                Supports any Sui coin type
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[#1A1A2E] bg-[#0F0F1A] font-mono text-sm overflow-x-auto">
            <p className="text-[#6B7280] mb-1">// Stream USDC to a contributor</p>
            <p className="text-[#A78BFA]">import <span className="text-white">{"{ FlowClient }"}</span> from <span className="text-[#10B981]">"@flow-protocol/sdk"</span>;</p>
            <br />
            <p className="text-[#A78BFA]">const <span className="text-white">flow</span> = new <span className="text-[#A78BFA]">FlowClient</span>{"({ network: "}<span className="text-[#10B981]">"mainnet"</span>{" })"}</p>
            <br />
            <p className="text-[#A78BFA]">const <span className="text-white">tx</span> = flow.stream.<span className="text-[#10B981]">createStream</span>{"({"}</p>
            <p className="text-white pl-4">recipient: <span className="text-[#10B981]">"0x..."</span>,</p>
            <p className="text-white pl-4">ratePerSecond: <span className="text-[#F59E0B]">1000n</span>,</p>
            <p className="text-white pl-4">deposit: <span className="text-[#F59E0B]">2_592_000_000n</span>,</p>
            <p className="text-white pl-4">coinType: COIN_TYPES.<span className="text-[#10B981]">USDC</span>,</p>
            <p className="text-white pl-4">coinObjectId: <span className="text-[#10B981]">"0x..."</span>,</p>
            <p className="text-[#A78BFA]">{"});"}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="p-12 rounded-2xl border border-[#1A1A2E] bg-[#0F0F1A] text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#7C3AED] opacity-10 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
            <p className="text-[#6B7280] text-sm mb-8 max-w-md mx-auto">
              Flow is live on Sui testnet. Try streaming, creating a pact, or integrating the SDK into your app today.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/app" className="px-6 py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition-colors">
                Open App
              </Link>
              <a href="https://github.com/softalpha0/Flow_Protocol" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg border border-[#1A1A2E] hover:border-[#7C3AED] text-white font-medium text-sm transition-colors">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1A1A2E]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-sm font-bold">flow<span className="text-[#7C3AED]">.</span></p>
          <p className="text-xs text-[#6B7280]">Built on Sui</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span className="text-xs text-[#6B7280]">Testnet live</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

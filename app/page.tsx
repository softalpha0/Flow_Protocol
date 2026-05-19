import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24 text-center relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2563EB] opacity-[0.07] rounded-full blur-[140px]" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#6B7280] mb-8 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
            Live on Sui Testnet — Mainnet coming soon
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]">
            The payment layer<br />
            <span className="text-[#2563EB]">for the open internet</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-10 leading-relaxed">
            Flow is a programmable payments protocol on Sui. Stream any asset by the second, lock funds in milestone escrow, or split payments across a team — all onchain, non-custodial, composable with the full Sui DeFi stack.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/app" className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm transition-colors shadow-sm">
              Launch App
            </Link>
            <Link href="/app/stream/new" className="px-6 py-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-[#111827] font-medium text-sm transition-colors">
              Start Streaming
            </Link>
          </div>

          {/* Hero visual */}
          <div className="mt-20 mx-auto max-w-3xl rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden shadow-sm">
            <div className="border-b border-[#E2E8F0] px-4 py-2.5 flex items-center gap-2 bg-white">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FCA5A5]" />
                <div className="w-3 h-3 rounded-full bg-[#FCD34D]" />
                <div className="w-3 h-3 rounded-full bg-[#86EFAC]" />
              </div>
              <div className="flex-1 mx-4 h-5 rounded bg-[#F1F5F9] text-[10px] flex items-center px-2 text-[#9CA3AF]">app.flowprotocol.xyz</div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-3">
              <div className="col-span-3 md:col-span-1 p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <p className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-2">Active Stream</p>
                <p className="text-2xl font-bold font-mono text-[#2563EB]">12.4471</p>
                <p className="text-xs text-[#6B7280] mt-0.5">SUI flowing to 0x3f2a...c8b1</p>
                <div className="mt-3 h-1 rounded-full bg-[#E2E8F0] overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "42%" }} />
                </div>
                <p className="text-[10px] text-[#6B7280] mt-1">42% streamed</p>
              </div>
              <div className="col-span-3 md:col-span-1 p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <p className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-2">Open Pact</p>
                <p className="text-lg font-semibold text-[#111827]">Design Sprint</p>
                <p className="text-xs text-[#6B7280] mt-0.5">500 USDC locked</p>
                <span className="mt-3 inline-block px-2 py-0.5 rounded-full bg-[#FEF9C3] text-[#854D0E] text-[10px] font-medium">Pending release</span>
              </div>
              <div className="col-span-3 md:col-span-1 p-4 rounded-xl bg-white border border-[#E2E8F0]">
                <p className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-2">Instant Split</p>
                <p className="text-lg font-semibold text-[#111827]">Team Payroll</p>
                <p className="text-xs text-[#6B7280] mt-0.5">4 recipients</p>
                <p className="text-xs text-[#10B981] mt-3 font-medium">Settled in 400ms</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-[#111827] mb-1">400ms</p>
            <p className="text-sm text-[#6B7280]">Settlement time</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111827] mb-1">Any asset</p>
            <p className="text-sm text-[#6B7280]">SUI, USDC, USDT and more</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111827] mb-1">Non-custodial</p>
            <p className="text-sm text-[#6B7280]">You control your funds</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#111827] mb-1">3 primitives</p>
            <p className="text-sm text-[#6B7280]">Stream, Pact, Instant</p>
          </div>
        </div>
      </section>

      {/* Primitives */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs text-[#2563EB] uppercase tracking-widest mb-3 font-semibold">Primitives</p>
          <h2 className="text-3xl md:text-4xl font-bold">Three ways to move money</h2>
          <p className="text-[#6B7280] text-sm mt-3 max-w-lg mx-auto">Composable onchain building blocks for every payment use case</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Stream</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Pay per second. Salary, freelance work, subscriptions — money flows continuously to the recipient. Cancel anytime and get the unspent balance back.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Real-time per-second payments
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Cancel and reclaim unused funds
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Works with any Sui token
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#2563EB] bg-[#F8FAFC] relative shadow-sm">
            <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1D4ED8] text-[10px] font-semibold uppercase tracking-wide">Popular</div>
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Pact</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Milestone-based escrow. Lock funds onchain, define the terms, and release payment when the work is done. Dispute mechanism built in — no middleman needed.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Funds locked until milestone complete
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Optional deadline enforcement
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Built-in dispute resolution
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] hover:shadow-sm transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center mb-6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Send to one address or split across an entire team in a single transaction. Fast, final, and cheap — no coordination overhead.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Single or multi-recipient
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Split in one transaction
              </div>
              <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Instant finality on Sui
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations header */}
      <section className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-xs text-[#2563EB] uppercase tracking-widest mb-3 font-semibold">Integrations</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Plugged into the full Sui stack</h2>
          <p className="text-[#6B7280] text-sm max-w-xl mx-auto">Flow composes natively with leading Sui protocols — bringing swaps, yield, and verifiable storage directly into your payment flows.</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <span className="px-4 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-sm font-medium text-[#111827]">DeepBook</span>
            <span className="px-4 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-sm font-medium text-[#111827]">Walrus</span>
            <span className="px-4 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-sm text-[#6B7280]">Scallop — Mainnet</span>
            <span className="px-4 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-sm text-[#6B7280]">More coming</span>
          </div>
        </div>
      </section>

      {/* DeepBook integration */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Live now
            </div>
            <h2 className="text-3xl font-bold mb-4">DeepBook — Cross-currency swaps</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Flow is natively integrated with DeepBook v3, Sui&apos;s central limit order book. Swap any token at the point of payment — stream in SUI, pay in USDC — all in a single atomic transaction using Sui&apos;s Programmable Transaction Blocks.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/>
                    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Atomic swap and stream</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Convert tokens and initiate a stream in one PTB — no intermediate steps, no custody risk</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Best-price execution</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Routes through DeepBook&apos;s on-chain order book for best available price, settled in 400ms</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Gasless via zkLogin</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Sign in with Google and submit swaps without holding SUI for gas — powered by Enoki</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#111827]">Swap &amp; Stream</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-medium">DeepBook v3</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
              <p className="text-xs text-[#6B7280] mb-2">You pay in</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#111827]">50 SUI</span>
                <span className="text-xs px-2 py-1 bg-[#F1F5F9] rounded-lg text-[#374151] font-medium">SUI</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0]">
              <p className="text-xs text-[#6B7280] mb-2">Recipient receives</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#111827]">~62.40 DBUSDC</span>
                <span className="text-xs px-2 py-1 bg-[#F1F5F9] rounded-lg text-[#374151] font-medium">USDC</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#EFF6FF] text-center">
              <p className="text-xs text-[#2563EB] font-medium">Swapped and streamed in one transaction — no multi-step flow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Walrus integration */}
      <section className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-white space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[#F0F4FF] border border-[#C7D7FD] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Pact Agreement</p>
                    <p className="text-xs text-[#6B7280]">Stored on Walrus</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#166534] font-medium">Verified</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 p-2 rounded bg-[#F8FAFC]">
                    <span className="text-[#6B7280] w-20 flex-shrink-0">blob_id</span>
                    <span className="text-[#111827] truncate">0x7ab3f...e2c1d</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#F8FAFC]">
                    <span className="text-[#6B7280] w-20 flex-shrink-0">amount</span>
                    <span className="text-[#111827]">500 USDC</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#F8FAFC]">
                    <span className="text-[#6B7280] w-20 flex-shrink-0">milestone</span>
                    <span className="text-[#111827]">Design delivery</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#F8FAFC]">
                    <span className="text-[#6B7280] w-20 flex-shrink-0">deadline</span>
                    <span className="text-[#111827]">2025-06-30</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#F8FAFC]">
                    <span className="text-[#6B7280] w-20 flex-shrink-0">parties</span>
                    <span className="text-[#111827]">2 signatures</span>
                  </div>
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs text-[#6B7280]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Content hash verified on Sui
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                Live now
              </div>
              <h2 className="text-3xl font-bold mb-4">Walrus — Decentralized pact storage</h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                Every Pact agreement on Flow is stored on Walrus, Sui&apos;s decentralized storage network. Terms, milestones, and dispute evidence are written to a permanent, tamper-proof blob — with the content hash anchored on Sui for verifiability.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Immutable agreement records</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Pact terms stored on Walrus cannot be altered — both parties have cryptographic proof</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">On-chain dispute evidence</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Upload deliverables, messages, or proofs to Walrus — referenced directly in the on-chain dispute flow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Always accessible</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">No single point of failure. Pact records survive even if Flow&apos;s frontend goes down</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scallop integration */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
              Mainnet launch
            </div>
            <h2 className="text-3xl font-bold mb-4">Scallop — Yield-bearing streams</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              On mainnet, Flow will integrate with Scallop Protocol — Sui&apos;s leading lending market — so deposited funds earn yield while they wait to be streamed. Your unstreamed balance generates APY, not just sits idle.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Earn while you stream</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">The full deposit earns Scallop yield. As funds stream out, yield accrues on the remaining balance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">No lockup, no penalty</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Yield is non-custodial and cancellable — senders keep all earned APY on any remaining balance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Capital-efficient payroll</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">DAOs and teams fund monthly payroll once — the unstreamed portion works in Scallop the whole time</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#111827]">Yield Stream Preview</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] font-semibold border border-[#FDE68A]">Mainnet only</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Stream deposit</span>
                <span className="font-semibold text-[#111827]">10,000 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Stream duration</span>
                <span className="font-semibold text-[#111827]">30 days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Scallop APY</span>
                <span className="font-semibold text-[#D97706]">~8.4%</span>
              </div>
              <div className="h-px bg-[#E2E8F0]" />
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Estimated yield earned</span>
                <span className="font-semibold text-[#10B981]">+~69 USDC</span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full" style={{ width: "60%" }} />
            </div>
            <p className="text-xs text-[#6B7280] text-center">60% streamed — 40% still earning yield</p>
            <div className="p-3 rounded-lg bg-white border border-[#FDE68A] text-center">
              <p className="text-xs text-[#92400E] font-medium">Available at mainnet launch</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="text-xs text-[#2563EB] uppercase tracking-widest mb-3 font-semibold">Use Cases</p>
            <h2 className="text-3xl md:text-4xl font-bold">Built for how work happens now</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Remote teams</p>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">Stream salaries by the second to contributors anywhere in the world. No bank accounts, no wire transfers, no delays.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Freelance work</p>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">Create a Pact with clear milestone terms. Clients lock funds upfront, freelancers deliver, payment releases instantly — no chasing invoices.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#111827]">DAO payroll</p>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">Split contributor payments across a whole team in one transaction. Pay in USDC, USDT, or any token your DAO holds.</p>
            </div>
            <div className="p-6 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:border-[#2563EB] hover:shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#111827]">Onchain subscriptions</p>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">Replace recurring payment infrastructure with a Stream. Subscribers deposit once, and the service provider earns continuously.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDK */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs text-[#2563EB] uppercase tracking-widest mb-3 font-semibold">Developer SDK</p>
            <h2 className="text-3xl font-bold mb-4">Add programmable payments to any app</h2>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              The Flow SDK lets you integrate streaming, escrow, and split payments into your product in minutes. Returns a transaction for any Sui wallet to sign.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Works with any Sui wallet
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                TypeScript-first with full type safety
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Supports any Sui coin type
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
                Composable with DeepBook, Scallop, Walrus
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#0F172A] font-mono text-sm overflow-x-auto">
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] opacity-70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] opacity-70" />
            </div>
            <p className="text-[#4B5563] mb-1">{"// Stream USDC to a contributor"}</p>
            <p><span className="text-[#818CF8]">import</span> <span className="text-[#E2E8F0]">{"{ FlowClient }"}</span> <span className="text-[#818CF8]">from</span> <span className="text-[#34D399]">&quot;@flow-protocol/sdk&quot;</span><span className="text-[#E2E8F0]">;</span></p>
            <br />
            <p><span className="text-[#818CF8]">const</span> <span className="text-[#E2E8F0]">flow</span> <span className="text-[#818CF8]">=</span> <span className="text-[#818CF8]">new</span> <span className="text-[#A78BFA]">FlowClient</span><span className="text-[#E2E8F0]">{"({ network: "}</span><span className="text-[#34D399]">&quot;mainnet&quot;</span><span className="text-[#E2E8F0]">{" })"}</span></p>
            <br />
            <p><span className="text-[#818CF8]">const</span> <span className="text-[#E2E8F0]">tx</span> <span className="text-[#818CF8]">=</span> <span className="text-[#E2E8F0]">flow.stream.</span><span className="text-[#34D399]">createStream</span><span className="text-[#E2E8F0]">{"({"}</span></p>
            <p className="text-[#E2E8F0] pl-4">recipient: <span className="text-[#34D399]">&quot;0x...&quot;</span>,</p>
            <p className="text-[#E2E8F0] pl-4">ratePerSecond: <span className="text-[#FBBF24]">1000n</span>,</p>
            <p className="text-[#E2E8F0] pl-4">deposit: <span className="text-[#FBBF24]">2_592_000_000n</span>,</p>
            <p className="text-[#E2E8F0] pl-4">coinType: COIN_TYPES.<span className="text-[#34D399]">USDC</span>,</p>
            <p><span className="text-[#E2E8F0]">{"});"}</span></p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="p-12 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2563EB] opacity-[0.06] rounded-full blur-[100px]" />
          </div>
          <div className="relative">
            <p className="text-xs text-[#2563EB] uppercase tracking-widest mb-3 font-semibold">Get started</p>
            <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
            <p className="text-[#6B7280] text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Flow is live on Sui testnet. Try streaming, creating a pact, or integrating the SDK into your app today.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/app" className="px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-sm transition-colors shadow-sm">
                Open App
              </Link>
              <a href="https://github.com/softalpha0/Flow_Protocol" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] text-[#111827] font-medium text-sm transition-colors">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-base font-bold">flow<span className="text-[#2563EB]">.</span></p>
            <div className="flex items-center gap-6 text-xs text-[#6B7280]">
              <span>DeepBook</span>
              <span>Walrus</span>
              <span>Scallop</span>
              <span>Sui</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span className="text-xs text-[#6B7280]">Testnet live</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

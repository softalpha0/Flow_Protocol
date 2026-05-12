import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

const PACKAGE_ID = "0x3170c4670ac048b33460524a1ee6bad245f86bac32345e761257ff970540c94b";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "who", label: "Who Is It For" },
  { id: "install", label: "Installation" },
  { id: "init", label: "Initialization" },
  { id: "streams", label: "Streams" },
  { id: "pacts", label: "Pacts" },
  { id: "instant", label: "Instant Payments" },
  { id: "coins", label: "Supported Assets" },
  { id: "reference", label: "Contract Reference" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-[#1A1A2E]">{title}</h2>
      {children}
    </section>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 mb-8">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-sm font-bold text-[#7C3AED]">
        {n}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function SDKPage() {
  return (
    <div className="min-h-screen bg-[#08080F] text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-4">On this page</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm py-1.5 text-[#6B7280] hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 p-4 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                <p className="text-xs text-[#6B7280] mb-2">Package</p>
                <p className="text-xs font-mono text-[#7C3AED] break-all">@flow-protocol/sdk</p>
                <p className="text-xs text-[#6B7280] mt-3 mb-2">Network</p>
                <p className="text-xs font-mono text-[#10B981]">Sui Testnet</p>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 text-xs text-[#7C3AED] mb-4">
                Developer SDK
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Flow Protocol SDK
              </h1>
              <p className="text-lg text-[#6B7280] max-w-2xl">
                A TypeScript SDK for integrating programmable payment streams, conditional pacts, and instant multi-recipient transfers into any application built on Sui.
              </p>
            </div>

            <Section id="overview" title="Overview">
              <p className="mb-4">
                The Flow Protocol SDK wraps the on-chain smart contracts into a clean, type-safe TypeScript interface. It abstracts away transaction building, coin management, and clock object references so you can integrate payment primitives in minutes instead of hours.
              </p>
              <p className="mb-4">
                All three payment primitives are supported — <strong className="text-white">Streams</strong> for vesting and subscriptions, <strong className="text-white">Pacts</strong> for escrow and milestone payments, and <strong className="text-white">Instant</strong> for immediate multi-recipient transfers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[
                  { name: "FlowClient.stream", desc: "Create, withdraw from, and cancel time-based payment streams." },
                  { name: "FlowClient.pact", desc: "Create conditional escrow pacts with complete, dispute, and cancel flows." },
                  { name: "FlowClient.instant", desc: "Send or split-send tokens to multiple recipients in a single transaction." },
                ].map((item) => (
                  <div key={item.name} className="p-4 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                    <p className="text-sm font-mono text-[#7C3AED] mb-2">{item.name}</p>
                    <p className="text-sm text-[#6B7280]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="who" title="Who Is It For">
              <p className="mb-6">
                Any developer or team that wants to add programmable payments to their product without writing Move contracts or managing transaction construction manually.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "DeFi Protocols",
                    desc: "Add token vesting for your tokenomics — stream tokens to team members, investors, or community contributors with cliffs and durations.",
                  },
                  {
                    title: "Freelance & Gig Platforms",
                    desc: "Replace manual invoice flows with pacts. Lock funds on project start, release on delivery, and enable dispute resolution on-chain.",
                  },
                  {
                    title: "Subscription Businesses",
                    desc: "Use streams to charge subscribers continuously rather than monthly lump sums. Recipients can claim accrued balance at any time.",
                  },
                  {
                    title: "DAOs & Treasuries",
                    desc: "Automate contributor payroll with streams, fund working groups via pacts, and split treasury distributions with a single instant transfer.",
                  },
                  {
                    title: "Wallets & Consumer Apps",
                    desc: "Expose stream and pact creation natively inside your wallet interface without needing to know Move.",
                  },
                  {
                    title: "Payroll & HR Tools",
                    desc: "Build crypto payroll products on top of Flow. Create streams per employee, denominated in any supported coin type including stablecoins.",
                  },
                ].map((item) => (
                  <div key={item.title} className="p-5 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                    <p className="font-semibold text-white mb-2">{item.title}</p>
                    <p className="text-sm text-[#6B7280]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="install" title="Installation">
              <Step n={1} title="Install the SDK and its peer dependency">
                <CodeBlock lang="bash" code={`npm install @flow-protocol/sdk @mysten/sui`} />
                <p className="mt-3 text-sm">
                  The SDK requires <code className="text-[#7C3AED] font-mono text-xs">@mysten/sui</code> v2.x as a peer dependency. If your project already has it, no additional install is needed.
                </p>
              </Step>
              <Step n={2} title="Ensure your tsconfig is compatible">
                <p className="mb-3 text-sm">
                  The Sui SDK v2 uses modern ESM-style type declarations. Add these to your <code className="text-[#7C3AED] font-mono text-xs">tsconfig.json</code>:
                </p>
                <CodeBlock lang="json" code={`{
  "compilerOptions": {
    "module": "ES2020",
    "moduleResolution": "bundler"
  }
}`} />
              </Step>
            </Section>

            <Section id="init" title="Initialization">
              <p className="mb-4">
                Create a single <code className="text-[#7C3AED] font-mono text-xs">FlowClient</code> instance and pass it to your components via context or props. It does not hold any wallet state — transaction signing is handled by your wallet adapter.
              </p>
              <CodeBlock code={`import { FlowClient } from "@flow-protocol/sdk";

const flow = new FlowClient({
  network: "testnet",
});

const flow = new FlowClient({
  network: "testnet",
  rpcUrl: "https://rpc-testnet.suiscan.xyz",
});`} />
              <p className="mt-4 text-sm">
                The client exposes three namespaces: <code className="text-[#7C3AED] font-mono text-xs">flow.stream</code>, <code className="text-[#7C3AED] font-mono text-xs">flow.pact</code>, and <code className="text-[#7C3AED] font-mono text-xs">flow.instant</code>. Each method returns a <code className="text-[#7C3AED] font-mono text-xs">Transaction</code> object that you sign and execute using your wallet.
              </p>
            </Section>

            <Section id="streams" title="Working with Streams">
              <p className="mb-6">
                A stream locks tokens on-chain and releases them linearly over time. The recipient can withdraw accrued balance at any time. The sender can cancel early and reclaim the unstreamed portion.
              </p>
              <Step n={1} title="Create a stream">
                <CodeBlock code={`import { FlowClient } from "@flow-protocol/sdk";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

const flow = new FlowClient({ network: "testnet" });
const { mutate: signAndExecute } = useSignAndExecuteTransaction();

async function createStream(coinObjectId: string) {
  const tx = flow.stream.create({
    coinObjectId,
    recipient: "0xRecipientAddress",
    amount: 1_000_000_000n,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    coinType: "0x2::sui::SUI",
  });
  signAndExecute({ transaction: tx });
}`} />
              </Step>
              <Step n={2} title="Withdraw from a stream (recipient)">
                <CodeBlock code={`const tx = flow.stream.withdraw({
  streamId: "0xStreamObjectId",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={3} title="Cancel a stream (sender)">
                <CodeBlock code={`const tx = flow.stream.cancel({
  streamId: "0xStreamObjectId",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={4} title="Check claimable balance">
                <CodeBlock code={`const claimable = await flow.stream.getClaimable({
  streamId: "0xStreamObjectId",
  coinType: "0x2::sui::SUI",
});
console.log(\`Claimable: \${claimable} base units\`);`} />
              </Step>
            </Section>

            <Section id="pacts" title="Working with Pacts">
              <p className="mb-6">
                A pact is a conditional escrow. The sender locks funds, and the recipient receives them only when the sender marks the pact complete. Either party can raise a dispute.
              </p>
              <Step n={1} title="Create a pact">
                <CodeBlock code={`const tx = flow.pact.create({
  coinObjectId: "0xCoinObjectId",
  recipient: "0xRecipientAddress",
  amount: 500_000_000n,
  description: "Website redesign milestone 1",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={2} title="Complete a pact (release funds)">
                <CodeBlock code={`const tx = flow.pact.complete({
  pactId: "0xPactObjectId",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={3} title="Cancel a pact">
                <CodeBlock code={`const tx = flow.pact.cancel({
  pactId: "0xPactObjectId",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={4} title="Dispute a pact">
                <CodeBlock code={`const tx = flow.pact.dispute({
  pactId: "0xPactObjectId",
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <div className="mt-2 p-4 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                <p className="text-sm font-semibold text-white mb-3">Pact Status Values</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { status: "0", label: "PENDING", color: "text-yellow-400" },
                    { status: "1", label: "COMPLETED", color: "text-green-400" },
                    { status: "2", label: "DISPUTED", color: "text-red-400" },
                    { status: "3", label: "CANCELLED", color: "text-[#6B7280]" },
                  ].map((s) => (
                    <div key={s.status} className="text-center">
                      <p className={`text-xs font-mono font-bold ${s.color}`}>{s.status}</p>
                      <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            <Section id="instant" title="Instant Payments">
              <p className="mb-6">
                Instant payments transfer tokens immediately. Use <code className="text-[#7C3AED] font-mono text-xs">send</code> for a single recipient or <code className="text-[#7C3AED] font-mono text-xs">splitSend</code> to distribute across multiple addresses in one transaction.
              </p>
              <Step n={1} title="Send to a single recipient">
                <CodeBlock code={`const tx = flow.instant.send({
  coinObjectId: "0xCoinObjectId",
  recipient: "0xRecipientAddress",
  amount: 200_000_000n,
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
              <Step n={2} title="Split send to multiple recipients">
                <CodeBlock code={`const tx = flow.instant.splitSend({
  coinObjectId: "0xCoinObjectId",
  recipients: [
    "0xAddress1",
    "0xAddress2",
    "0xAddress3",
  ],
  amounts: [
    100_000_000n,
    150_000_000n,
    250_000_000n,
  ],
  coinType: "0x2::sui::SUI",
});
signAndExecute({ transaction: tx });`} />
              </Step>
            </Section>

            <Section id="coins" title="Supported Assets">
              <p className="mb-4">
                All three primitives are generic — any coin type on Sui works. Pass the full coin type string as <code className="text-[#7C3AED] font-mono text-xs">coinType</code>.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A2E]">
                      <th className="text-left py-3 pr-6 text-[#6B7280] font-medium">Asset</th>
                      <th className="text-left py-3 text-[#6B7280] font-medium">Coin Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A2E]">
                    <tr>
                      <td className="py-3 pr-6 font-semibold text-white">SUI</td>
                      <td className="py-3 font-mono text-xs text-[#7C3AED]">0x2::sui::SUI</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-semibold text-white">USDC</td>
                      <td className="py-3 font-mono text-xs text-[#7C3AED] break-all">0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-semibold text-white">USDT</td>
                      <td className="py-3 font-mono text-xs text-[#7C3AED] break-all">0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm">Any other valid Sui coin type works — just pass its full type string.</p>
            </Section>

            <Section id="reference" title="Contract Reference">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                  <p className="text-xs text-[#6B7280] mb-1">Package ID</p>
                  <p className="font-mono text-xs text-[#7C3AED] break-all">{PACKAGE_ID}</p>
                </div>
                <div className="p-5 rounded-xl border border-[#1A1A2E] bg-[#0D0D1A]">
                  <p className="text-xs text-[#6B7280] mb-1">Network</p>
                  <p className="font-mono text-sm text-[#10B981]">Sui Testnet</p>
                  <p className="text-xs text-[#6B7280] mt-2">Mainnet coming after audit</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1A2E]">
                      <th className="text-left py-3 pr-6 text-[#6B7280] font-medium">Module</th>
                      <th className="text-left py-3 pr-6 text-[#6B7280] font-medium">Object Type</th>
                      <th className="text-left py-3 text-[#6B7280] font-medium">Functions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A2E]">
                    <tr>
                      <td className="py-3 pr-6 font-mono text-xs text-white">stream</td>
                      <td className="py-3 pr-6 font-mono text-xs text-[#7C3AED]">Stream&lt;T&gt;</td>
                      <td className="py-3 text-xs text-[#6B7280]">create_stream, withdraw_stream, cancel_stream, get_claimable</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-mono text-xs text-white">pact</td>
                      <td className="py-3 pr-6 font-mono text-xs text-[#7C3AED]">Pact&lt;T&gt;</td>
                      <td className="py-3 text-xs text-[#6B7280]">create_pact, complete_pact, cancel_pact, dispute_pact</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-6 font-mono text-xs text-white">instant</td>
                      <td className="py-3 pr-6 font-mono text-xs text-[#7C3AED]">—</td>
                      <td className="py-3 text-xs text-[#6B7280]">send, split_send</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <div className="mt-4 p-6 rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold mb-1">Ready to integrate?</p>
                <p className="text-sm text-[#6B7280]">Try the live app or browse the source on GitHub.</p>
              </div>
              <div className="flex gap-3">
                <Link href="/app" className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
                  Open App
                </Link>
                <a href="https://github.com/softalpha0/Flow_Protocol" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border border-[#1A1A2E] text-sm font-medium text-[#A1A1AA] hover:text-white hover:border-[#374151] transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

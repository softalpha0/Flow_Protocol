# Flow Protocol

**The programmable payments layer for the open internet — built on Sui.**

Flow is a non-custodial, composable payments protocol that lets anyone stream any asset by the second, lock funds in milestone escrow, or split payments across a team. Everything runs onchain on Sui with zkLogin so users need no wallet to get started.

---

## Why Flow

Web3 payments are binary — you send a lump sum and hope for the best. Flow changes this with three primitives that match how work actually happens:

- **Stream** — pay by the second, continuously. The recipient can withdraw at any moment; the sender can cancel and reclaim what hasn't vested yet.
- **Pact** — milestone escrow. Lock funds, attach a deliverable (stored on Walrus), release on completion or dispute at any time.
- **Instant / Split** — send to one address or split across many in a single transaction.

All three primitives are composable. A Pact can complete *as* a Stream — releasing funds that then vest over time rather than all at once.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                Frontend (Next.js 15)                 │
│        Stream · Pact · Send · zkLogin auth          │
└────────────────────┬────────────────────────────────┘
                     │ @mysten/dapp-kit + Sui SDK
┌────────────────────▼────────────────────────────────┐
│                  Sui Testnet                         │
├──────────────┬──────────────┬────────────────────────┤
│    stream    │     pact     │       instant          │
│  Per-second  │  Milestone   │  Send / split          │
│  vesting     │  escrow      │  one transaction       │
└──────────────┴──────────────┴────────────────────────┘
```

---

## Contracts

Deployed on **Sui Testnet**

| Module | Description |
|---|---|
| `flow_protocol::stream` | Continuous per-second payment streams |
| `flow_protocol::pact` | Milestone escrow with Walrus blob attachments |
| `flow_protocol::instant` | Single-send and multi-split payments |

**Package ID:** `0xce6f22134a8e66c4d43003163e06647bc91d55b9ed8b17c1f2358c2e0705b566`

**Network:** Sui Testnet (`https://fullnode.testnet.sui.io`)

---

## Payment Primitives

### Stream

A `Stream<T>` object holds a balance that vests linearly over time at a fixed `rate_per_second`.

| Action | Who | What happens |
|---|---|---|
| `create_stream` | Sender | Deposits funds, sets rate, starts the clock |
| `withdraw_stream` | Recipient | Withdraws all vested (unclaimed) balance |
| `cancel_stream` | Sender | Stops stream; recipient gets vested share, sender gets refund |

Claimable at any moment: `elapsed_seconds × rate_per_second`, capped at remaining balance.

---

### Pact

A `Pact<T>` is an escrow object with a description, optional Walrus blob ID (for attaching deliverables or contracts), and a deadline.

| Status | Meaning |
|---|---|
| Pending | Funds locked, work in progress |
| Completed | Sender released funds to recipient |
| Disputed | Recipient flagged an issue |
| Cancelled | Sender reclaimed funds before completion |

**Completing as a stream:** The sender can call `complete_pact_as_stream` to release the escrowed funds into a new `Stream` object — so the recipient earns the payout over a vesting window instead of receiving it all at once.

---

### Instant / Split

`send<T>` — transfer a coin to one recipient in a single call.

`split_send<T>` — provide a list of recipients and amounts; the protocol splits the coin and transfers each share atomically. Any remainder is returned to the sender.

---

## Supported Assets

| Token | Type |
|---|---|
| SUI | `0x2::sui::SUI` |
| USDC | `0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN` |
| USDT | `0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN` |

All modules are generic over `<T>` — any Sui coin type works.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Move 2024, Sui Framework |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Web3 | @mysten/dapp-kit, Sui TypeScript SDK |
| Auth | zkLogin (no wallet required) |
| Storage | Walrus (deliverable blobs on Pacts) |
| Chain | Sui Testnet → Mainnet |

---

## Local Setup

### Prerequisites

- Node.js 18+
- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install)
- A Sui testnet wallet with test SUI (get from [faucet.sui.io](https://faucet.sui.io))

### 1. Clone and install

```bash
git clone https://github.com/softalpha0/flow-protocol
cd "Flow Protocol"
npm install
```

### 2. Run the frontend

```bash
npm run dev
# Open http://localhost:3000
```

### 3. Build and deploy contracts (optional — already deployed)

```bash
cd flow/move/flow_protocol
sui client publish --gas-budget 100000000
```

After publishing, update `PACKAGE_ID` in `constants/index.ts`.

---

## How to Use

### Create a Stream

1. Go to **Stream → New Stream**
2. Enter the recipient address, rate per second, and deposit amount
3. Select the asset (SUI, USDC, USDT)
4. Sign with zkLogin or your wallet

The recipient can withdraw vested funds at any time from **Stream → [stream ID]**.

### Create a Pact

1. Go to **Pact → New Pact**
2. Enter the recipient, description, optional Walrus blob ID, deadline, and deposit
3. Sign the transaction

When the work is done:
- Sender calls **Complete** to release funds instantly, or
- Sender calls **Complete as Stream** to release funds over a vesting window
- Recipient can call **Dispute** at any point if there is a problem

### Send or Split

1. Go to **Send**
2. For a single payment, enter one recipient and amount
3. For a split, add multiple recipients with individual amounts
4. Everything settles in one transaction

---

## Roadmap

- Mainnet deployment
- Recurring Pacts (subscription billing)
- Vesting schedules with cliff periods
- DAO treasury tooling — on-chain payroll for contributors
- SDK for programmatic stream and pact creation by other protocols
- Mobile app

---

## License

MIT

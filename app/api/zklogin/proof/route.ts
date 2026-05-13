import { NextRequest, NextResponse } from "next/server";

// Try production prover first (same circuit as testnet), fall back to dev prover
const PROVERS = [
  "https://prover-dev.mystenlabs.com/v1",
];

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;

  console.log("[zklogin/proof] request — maxEpoch:", body.maxEpoch, "keyClaimName:", body.keyClaimName);

  let lastError = "";
  for (const proverUrl of PROVERS) {
    try {
      const res = await fetch(proverUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as Record<string, unknown>;

      console.log(`[zklogin/proof] ${proverUrl} → status ${res.status}, keys:`, Object.keys(data));
      if (data.addressSeed) console.log("[zklogin/proof] prover returned addressSeed:", data.addressSeed);
      if (data.proofPoints) {
        return NextResponse.json(data, { status: 200 });
      }
      lastError = JSON.stringify(data);
    } catch (e) {
      lastError = String(e);
      console.error(`[zklogin/proof] ${proverUrl} threw:`, e);
    }
  }

  return NextResponse.json({ error: "All provers failed", detail: lastError }, { status: 500 });
}

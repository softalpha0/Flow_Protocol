import { NextRequest, NextResponse } from "next/server";

const PROVER_DEV = "https://prover-dev.mystenlabs.com/v1";
const ENOKI_API = "https://api.enoki.mystenlabs.com";

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>;
  const jwt = body.jwt as string;
  const apiKey = process.env.ENOKI_API_KEY ?? "";

  console.log("[zklogin/proof] request — maxEpoch:", body.maxEpoch, "hasEnokiKey:", apiKey.length > 0);

  if (apiKey) {
    try {
      const res = await fetch(`${ENOKI_API}/v1/zklogin/zkp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "zklogin-jwt": jwt,
        },
        body: JSON.stringify({
          network: "testnet",
          randomness: body.jwtRandomness,
          maxEpoch: body.maxEpoch,
          jwtRandomness: body.jwtRandomness,
          ephemeralPublicKey: body.extendedEphemeralPublicKey,
          salt: body.salt,
          keyClaimName: body.keyClaimName ?? "sub",
        }),
      });

      const data = await res.json() as Record<string, unknown>;
      console.log("[zklogin/proof] Enoki status:", res.status, "keys:", Object.keys(data));

      if (!res.ok) {
        console.error("[zklogin/proof] Enoki error body:", JSON.stringify(data));
        return NextResponse.json({ error: "Enoki prover failed", detail: JSON.stringify(data) }, { status: 500 });
      }

      const proof = (data.data ?? data) as Record<string, unknown>;
      console.log("[zklogin/proof] proof keys:", Object.keys(proof));

      if (proof.proofPoints) {
        return NextResponse.json(proof, { status: 200 });
      }

      console.error("[zklogin/proof] Enoki returned ok but no proofPoints:", JSON.stringify(data));
      return NextResponse.json({ error: "Enoki returned no proofPoints", detail: JSON.stringify(data) }, { status: 500 });
    } catch (e) {
      console.error("[zklogin/proof] Enoki threw:", String(e));
      return NextResponse.json({ error: "Enoki request failed", detail: String(e) }, { status: 500 });
    }
  }

  const proverBody = { ...body, network: "testnet" };
  const res = await fetch(PROVER_DEV, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proverBody),
  });

  const data = await res.json() as Record<string, unknown>;
  console.log("[zklogin/proof] prover-dev status:", res.status, "keys:", Object.keys(data));

  if (data.proofPoints) {
    return NextResponse.json(data, { status: 200 });
  }

  return NextResponse.json({ error: "All provers failed", detail: JSON.stringify(data) }, { status: 500 });
}

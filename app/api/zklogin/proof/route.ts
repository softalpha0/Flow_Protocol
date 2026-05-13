import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch("https://prover-dev.mystenlabs.com/v1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as Record<string, unknown>;

  // Log prover response keys so we know what fields come back
  console.log("[zklogin/proof] prover response keys:", Object.keys(data));
  if (data.addressSeed) {
    console.log("[zklogin/proof] prover returned addressSeed:", data.addressSeed);
  }

  return NextResponse.json(data, { status: res.status });
}

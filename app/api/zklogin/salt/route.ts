import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const ENOKI_API = "https://api.enoki.mystenlabs.com";

export async function POST(req: NextRequest) {
  const { token } = await req.json() as { token: string };

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const apiKey = process.env.ENOKI_API_KEY ?? "";

  if (apiKey) {
    const res = await fetch(`${ENOKI_API}/v1/zklogin`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "zklogin-jwt": token,
      },
    });

    const data = await res.json() as Record<string, unknown>;
    const salt = (data.data as Record<string, unknown> | undefined)?.salt as string | undefined;

    if (!res.ok || !salt) {
      console.error("[zklogin/salt] Enoki error:", JSON.stringify(data));
      return NextResponse.json({ error: "Enoki salt service failed", detail: JSON.stringify(data) }, { status: 500 });
    }

    return NextResponse.json({ salt });
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return NextResponse.json({ error: "Invalid JWT" }, { status: 400 });
  }

  const payload = JSON.parse(
    Buffer.from(parts[1], "base64url").toString("utf8")
  ) as { sub?: string };

  if (!payload.sub) {
    return NextResponse.json({ error: "Missing sub claim" }, { status: 400 });
  }

  const secret = process.env.SALT_SECRET ?? "flow-protocol-salt-v1";
  const hex = createHmac("sha256", secret).update(payload.sub).digest("hex");
  const salt = BigInt("0x" + hex.slice(0, 32)).toString();

  return NextResponse.json({ salt });
}

import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  const { token } = await req.json() as { token: string };

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

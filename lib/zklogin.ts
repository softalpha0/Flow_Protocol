import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
  genAddressSeed,
} from "@mysten/sui/zklogin";
import { Transaction } from "@mysten/sui/transactions";

type SuiClientLike = {
  getLatestSuiSystemState(): Promise<{ epoch: string | bigint }>;
  executeTransactionBlock(args: {
    transactionBlock: Uint8Array;
    signature: string;
    options?: Record<string, boolean>;
  }): Promise<unknown>;
};

export const GOOGLE_CLIENT_ID =
  "655215891225-fs095usti8j8sgc1tcidcpla313dbb4t.apps.googleusercontent.com";

export interface ZkLoginSession {
  address: string;
  jwt: string;
  salt: string;
  maxEpoch: number;
  randomness: string;
  ephemeralKeyStr: string;
  addressSeed: string;
  proofPoints: { a: string[]; b: string[][]; c: string[] };
  issBase64Details: { value: string; indexMod4: number };
  headerBase64: string;
}

export function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const base64url = jwt.split(".")[1];
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64)) as Record<string, unknown>;
}

export function computeAddressSeed(salt: string, jwt: string): string {
  const payload = decodeJwtPayload(jwt);
  const sub = payload.sub as string;
  const aud = Array.isArray(payload.aud)
    ? (payload.aud as string[])[0]
    : (payload.aud as string);
  return genAddressSeed(BigInt(salt), "sub", sub, aud).toString();
}

export async function beginZkLogin(suiClient: SuiClientLike) {
  const keypair = new Ed25519Keypair();
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + 2;
  const randomness = generateRandomness();
  const nonce = generateNonce(keypair.getPublicKey(), maxEpoch, randomness);

  sessionStorage.setItem("zkl_key", keypair.getSecretKey());
  sessionStorage.setItem("zkl_epoch", String(maxEpoch));
  sessionStorage.setItem("zkl_rand", randomness);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "id_token",
    scope: "openid",
    nonce,
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function completeZkLogin(jwt: string, suiClient: SuiClientLike): Promise<ZkLoginSession> {
  const maxEpoch = Number(sessionStorage.getItem("zkl_epoch") ?? "0");
  const randomness = sessionStorage.getItem("zkl_rand") ?? "";
  const ephemeralKeyStr = sessionStorage.getItem("zkl_key") ?? "";
  const keypair = Ed25519Keypair.fromSecretKey(ephemeralKeyStr);

  const saltRes = await fetch("/api/zklogin/salt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: jwt }),
  });
  const saltData = await saltRes.json() as Record<string, unknown>;
  if (!saltData.salt) {
    throw new Error(`Salt service error: ${JSON.stringify(saltData)}`);
  }
  const salt = saltData.salt as string;

  const address = jwtToAddress(jwt, salt, false);

  const proofRes = await fetch("/api/zklogin/proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jwt,
      extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(keypair.getPublicKey()),
      maxEpoch,
      jwtRandomness: randomness,
      salt,
      keyClaimName: "sub",
    }),
  });
  const proof = await proofRes.json() as Record<string, unknown>;
  if (!proof.proofPoints) {
    throw new Error(`Prover error: ${JSON.stringify(proof)}`);
  }

  // Prefer the prover's addressSeed (guaranteed to match the proof).
  // If the prover doesn't return it, compute locally using the same formula.
  const addressSeed =
    typeof proof.addressSeed === "string" && proof.addressSeed
      ? proof.addressSeed
      : computeAddressSeed(salt, jwt);

  const session: ZkLoginSession = {
    address,
    jwt,
    salt,
    maxEpoch,
    randomness,
    ephemeralKeyStr,
    addressSeed,
    proofPoints: proof.proofPoints as ZkLoginSession["proofPoints"],
    issBase64Details: proof.issBase64Details as ZkLoginSession["issBase64Details"],
    headerBase64: proof.headerBase64 as string,
  };

  localStorage.setItem("zkl_session", JSON.stringify(session));
  return session;
}

export function loadZkLoginSession(): ZkLoginSession | null {
  try {
    const raw = localStorage.getItem("zkl_session");
    if (!raw) return null;
    const session = JSON.parse(raw) as ZkLoginSession;

    // Repair sessions stored before the addressSeed fix — recompute from stored jwt + salt.
    if (!session.addressSeed && session.jwt && session.salt) {
      session.addressSeed = computeAddressSeed(session.salt, session.jwt);
      localStorage.setItem("zkl_session", JSON.stringify(session));
    }

    return session;
  } catch {
    return null;
  }
}

export function clearZkLoginSession() {
  localStorage.removeItem("zkl_session");
  sessionStorage.removeItem("zkl_key");
  sessionStorage.removeItem("zkl_epoch");
  sessionStorage.removeItem("zkl_rand");
}

export async function zkExecuteTransaction(tx: Transaction, session: ZkLoginSession, suiClient: SuiClientLike) {
  if (!session.addressSeed) {
    throw new Error("Session is missing addressSeed. Please sign out and sign back in.");
  }

  const keypair = Ed25519Keypair.fromSecretKey(session.ephemeralKeyStr);

  tx.setSender(session.address);

  const txBytes = await tx.build({ client: suiClient as never });
  const { signature: ephem } = await keypair.signTransaction(txBytes);

  const zkSig = getZkLoginSignature({
    inputs: {
      proofPoints: session.proofPoints,
      issBase64Details: session.issBase64Details,
      headerBase64: session.headerBase64,
      addressSeed: session.addressSeed,
    },
    maxEpoch: session.maxEpoch,
    userSignature: ephem,
  });

  return suiClient.executeTransactionBlock({
    transactionBlock: txBytes,
    signature: zkSig,
    options: { showEffects: true },
  });
}

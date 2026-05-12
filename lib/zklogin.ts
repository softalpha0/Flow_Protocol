import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
} from "@mysten/sui/zklogin";
import { toBase64 } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import type { SuiClient } from "@mysten/sui/client";

export const GOOGLE_CLIENT_ID =
  "655215891225-fs095usti8j8sgc1tcidcpla313dbb4t.apps.googleusercontent.com";

const SALT_SERVICE = "https://salt.api.mystenlabs.com/get_salt";
const PROVER_URL = "https://prover-dev.mystenlabs.com/v1";

export interface ZkLoginSession {
  address: string;
  jwt: string;
  salt: string;
  maxEpoch: number;
  randomness: string;
  ephemeralKey: number[];
  addressSeed: string;
  proofPoints: { a: string[]; b: string[][]; c: string[] };
  issBase64Details: { value: string; indexMod4: number };
  headerBase64: string;
}

export async function beginZkLogin(suiClient: SuiClient) {
  const keypair = new Ed25519Keypair();
  const { epoch } = await suiClient.getLatestSuiSystemState();
  const maxEpoch = Number(epoch) + 2;
  const randomness = generateRandomness();
  const nonce = generateNonce(keypair.getPublicKey(), maxEpoch, randomness);

  sessionStorage.setItem("zkl_key", JSON.stringify(Array.from(keypair.getSecretKey())));
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

export async function completeZkLogin(jwt: string, suiClient: SuiClient): Promise<ZkLoginSession> {
  const maxEpoch = Number(sessionStorage.getItem("zkl_epoch") ?? "0");
  const randomness = sessionStorage.getItem("zkl_rand") ?? "";
  const keyBytes = new Uint8Array(JSON.parse(sessionStorage.getItem("zkl_key") ?? "[]"));
  const keypair = Ed25519Keypair.fromSecretKey(keyBytes);

  const saltRes = await fetch(SALT_SERVICE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: jwt }),
  });
  const { salt } = await saltRes.json() as { salt: string };

  const address = jwtToAddress(jwt, salt);

  const proofRes = await fetch(PROVER_URL, {
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
  const proof = await proofRes.json() as {
    proofPoints: ZkLoginSession["proofPoints"];
    issBase64Details: ZkLoginSession["issBase64Details"];
    headerBase64: string;
    addressSeed: string;
  };

  const session: ZkLoginSession = {
    address,
    jwt,
    salt,
    maxEpoch,
    randomness,
    ephemeralKey: Array.from(keyBytes),
    addressSeed: proof.addressSeed,
    proofPoints: proof.proofPoints,
    issBase64Details: proof.issBase64Details,
    headerBase64: proof.headerBase64,
  };

  localStorage.setItem("zkl_session", JSON.stringify(session));
  return session;
}

export function loadZkLoginSession(): ZkLoginSession | null {
  try {
    const raw = localStorage.getItem("zkl_session");
    return raw ? (JSON.parse(raw) as ZkLoginSession) : null;
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

export async function zkExecuteTransaction(tx: Transaction, session: ZkLoginSession, suiClient: SuiClient) {
  const keypair = Ed25519Keypair.fromSecretKey(new Uint8Array(session.ephemeralKey));
  const txBytes = await tx.build({ client: suiClient });
  const { signature: ephem } = await keypair.signTransaction(txBytes);

  const zkSig = getZkLoginSignature({
    inputs: {
      proofPoints: session.proofPoints,
      issBase64Details: session.issBase64Details,
      headerBase64: session.headerBase64,
      addressSeed: session.addressSeed,
    },
    maxEpoch: session.maxEpoch,
    userSignature: toBase64(ephem),
  });

  return suiClient.executeTransactionBlock({
    transactionBlock: txBytes,
    signature: zkSig,
    options: { showEffects: true },
  });
}

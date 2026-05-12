const WALRUS_PUBLISHER = "https://publisher.walrus-testnet.walrus.space/v1/blobs";
const WALRUS_AGGREGATOR = "https://aggregator.walrus-testnet.walrus.space/v1/blobs";

export async function uploadToWalrus(content: string | Uint8Array): Promise<string> {
  const body = typeof content === "string" ? new TextEncoder().encode(content) : content;

  const res = await fetch(WALRUS_PUBLISHER, {
    method: "PUT",
    body,
  });

  if (!res.ok) throw new Error(`Walrus upload failed: ${res.statusText}`);

  const data = await res.json();
  const blobId = data.newlyCreated?.blobObject?.blobId ?? data.alreadyCertified?.blobId;
  if (!blobId) throw new Error("Could not extract blob ID from Walrus response");

  return blobId;
}

export async function fetchTextFromWalrus(blobId: string): Promise<string | null> {
  const res = await fetch(`${WALRUS_AGGREGATOR}/${blobId}`);
  if (!res.ok) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (
    contentType.includes("application/octet-stream") ||
    contentType.includes("image/") ||
    contentType.includes("application/pdf")
  ) {
    return null;
  }

  const text = await res.text();
  const isProbablyBinary = /[\x00-\x08\x0E-\x1F]/.test(text.slice(0, 512));
  if (isProbablyBinary) return null;

  return text;
}

export function walrusBlobUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/${blobId}`;
}

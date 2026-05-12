export function mistToSui(mist: bigint | number): string {
  const val = typeof mist === "number" ? BigInt(mist) : mist;
  return (Number(val) / 1_000_000_000).toFixed(4);
}

export function suiToMist(sui: string | number): bigint {
  return BigInt(Math.floor(Number(sui) * 1_000_000_000));
}

export function shortenAddress(addr: string): string {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function msToRelativeTime(ms: number): string {
  const now = Date.now();
  const diff = now - ms;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

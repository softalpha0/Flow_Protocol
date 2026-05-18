import { DeepBookClient } from "@mysten/deepbook-v3";
import type { Transaction } from "@mysten/sui/transactions";

export const DEEPBOOK_POOL = "SUI_DBUSDC";

export const DBUSDC_TYPE =
  "0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC";

export function makeDeepBookClient(client: unknown, address: string) {
  return new DeepBookClient({
    client: client as never,
    address,
    network: "testnet",
  });
}

export async function getSwapQuote(
  client: unknown,
  address: string,
  suiAmount: number
): Promise<number> {
  const db = makeDeepBookClient(client, address);
  const result = await db.getQuoteQuantityOut(DEEPBOOK_POOL, suiAmount);
  return result.quoteOut;
}

export function buildSwapAndSendTx(
  tx: Transaction,
  db: DeepBookClient,
  suiAmount: number,
  recipients: string[],
  estimatedDbusdc: number,
  senderAddress: string
): void {
  const [remainingSui, dbusdc, remainingDeep] = db.deepBook.swapExactBaseForQuote({
    poolKey: DEEPBOOK_POOL,
    amount: suiAmount,
    deepAmount: 0,
    minOut: 0,
  })(tx);

  tx.transferObjects([remainingSui, remainingDeep], senderAddress);

  if (recipients.length === 1) {
    tx.transferObjects([dbusdc], recipients[0]);
  } else {
    const perRecipient = BigInt(Math.floor((estimatedDbusdc * 1_000_000) / recipients.length));
    const splitAmounts = Array(recipients.length - 1).fill(perRecipient);
    const chunks = tx.splitCoins(dbusdc, splitAmounts.map((a) => tx.pure.u64(a)));
    for (let i = 0; i < recipients.length - 1; i++) {
      tx.transferObjects([chunks[i]], recipients[i]);
    }
    tx.transferObjects([dbusdc], recipients[recipients.length - 1]);
  }
}

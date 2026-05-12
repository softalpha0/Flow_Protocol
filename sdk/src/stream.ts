import { Transaction } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID, COIN_TYPES } from "./constants";
import { CreateStreamParams } from "./types";

export class StreamClient {
  private packageId: string;

  constructor(packageId: string) {
    this.packageId = packageId;
  }

  createStream(params: CreateStreamParams): Transaction {
    const {
      recipient,
      ratePerSecond,
      deposit,
      coinType = COIN_TYPES.SUI,
      coinObjectId,
    } = params;

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.object(coinObjectId), [deposit]);

    tx.moveCall({
      target: `${this.packageId}::stream::create_stream`,
      typeArguments: [coinType],
      arguments: [
        tx.pure.address(recipient),
        tx.pure.u64(ratePerSecond),
        coin,
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    return tx;
  }

  withdrawStream(params: { streamId: string; coinType?: string }): Transaction {
    const { streamId, coinType = COIN_TYPES.SUI } = params;
    const tx = new Transaction();

    tx.moveCall({
      target: `${this.packageId}::stream::withdraw_stream`,
      typeArguments: [coinType],
      arguments: [
        tx.object(streamId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    return tx;
  }

  cancelStream(params: { streamId: string; coinType?: string }): Transaction {
    const { streamId, coinType = COIN_TYPES.SUI } = params;
    const tx = new Transaction();

    tx.moveCall({
      target: `${this.packageId}::stream::cancel_stream`,
      typeArguments: [coinType],
      arguments: [
        tx.object(streamId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    return tx;
  }

  getClaimable(ratePerSecond: bigint, lastWithdrawn: number, balance: bigint): bigint {
    const now = Date.now();
    const elapsedMs = BigInt(now - lastWithdrawn);
    const elapsedSec = elapsedMs / 1000n;
    const earned = elapsedSec * ratePerSecond;
    return earned > balance ? balance : earned;
  }
}

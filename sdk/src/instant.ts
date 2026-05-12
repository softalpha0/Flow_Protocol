import { Transaction } from "@mysten/sui/transactions";
import { COIN_TYPES } from "./constants";
import { SendParams, SplitSendParams } from "./types";

export class InstantClient {
  private packageId: string;

  constructor(packageId: string) {
    this.packageId = packageId;
  }

  send(params: SendParams): Transaction {
    const { recipient, amount, coinType = COIN_TYPES.SUI, coinObjectId } = params;
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.object(coinObjectId), [amount]);

    tx.moveCall({
      target: `${this.packageId}::instant::send`,
      typeArguments: [coinType],
      arguments: [coin, tx.pure.address(recipient)],
    });

    return tx;
  }

  splitSend(params: SplitSendParams): Transaction {
    const { recipients, amounts, coinType = COIN_TYPES.SUI, coinObjectId } = params;
    const tx = new Transaction();
    const total = amounts.reduce((a: bigint, b: bigint) => a + b, 0n);
    const [coin] = tx.splitCoins(tx.object(coinObjectId), [total]);

    tx.moveCall({
      target: `${this.packageId}::instant::split_send`,
      typeArguments: [coinType],
      arguments: [
        coin,
        tx.pure.vector("address", recipients),
        tx.pure.vector("u64", amounts),
      ],
    });

    return tx;
  }
}

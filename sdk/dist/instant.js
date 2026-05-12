import { Transaction } from "@mysten/sui/transactions";
import { COIN_TYPES } from "./constants";
export class InstantClient {
    constructor(packageId) {
        this.packageId = packageId;
    }
    send(params) {
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
    splitSend(params) {
        const { recipients, amounts, coinType = COIN_TYPES.SUI, coinObjectId } = params;
        const tx = new Transaction();
        const total = amounts.reduce((a, b) => a + b, 0n);
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

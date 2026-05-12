import { Transaction } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID, COIN_TYPES } from "./constants";
export class PactClient {
    constructor(packageId) {
        this.packageId = packageId;
    }
    createPact(params) {
        const { recipient, amount, description, deadline = 0, walrusBlobId = "", coinType = COIN_TYPES.SUI, coinObjectId, } = params;
        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.object(coinObjectId), [amount]);
        const encoder = new TextEncoder();
        const descBytes = Array.from(encoder.encode(description));
        const blobBytes = Array.from(encoder.encode(walrusBlobId));
        tx.moveCall({
            target: `${this.packageId}::pact::create_pact`,
            typeArguments: [coinType],
            arguments: [
                tx.pure.address(recipient),
                tx.pure.vector("u8", descBytes),
                tx.pure.vector("u8", blobBytes),
                tx.pure.u64(deadline),
                coin,
                tx.object(SUI_CLOCK_OBJECT_ID),
            ],
        });
        return tx;
    }
    completePact(params) {
        const { pactId, coinType = COIN_TYPES.SUI } = params;
        const tx = new Transaction();
        tx.moveCall({
            target: `${this.packageId}::pact::complete_pact`,
            typeArguments: [coinType],
            arguments: [tx.object(pactId), tx.object(SUI_CLOCK_OBJECT_ID)],
        });
        return tx;
    }
    cancelPact(params) {
        const { pactId, coinType = COIN_TYPES.SUI } = params;
        const tx = new Transaction();
        tx.moveCall({
            target: `${this.packageId}::pact::cancel_pact`,
            typeArguments: [coinType],
            arguments: [tx.object(pactId)],
        });
        return tx;
    }
    disputePact(params) {
        const { pactId, coinType = COIN_TYPES.SUI } = params;
        const tx = new Transaction();
        tx.moveCall({
            target: `${this.packageId}::pact::dispute_pact`,
            typeArguments: [coinType],
            arguments: [tx.object(pactId)],
        });
        return tx;
    }
}

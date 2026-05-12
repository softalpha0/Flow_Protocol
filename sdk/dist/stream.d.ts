import { Transaction } from "@mysten/sui/transactions";
import { CreateStreamParams } from "./types";
export declare class StreamClient {
    private packageId;
    constructor(packageId: string);
    createStream(params: CreateStreamParams): Transaction;
    withdrawStream(params: {
        streamId: string;
        coinType?: string;
    }): Transaction;
    cancelStream(params: {
        streamId: string;
        coinType?: string;
    }): Transaction;
    getClaimable(ratePerSecond: bigint, lastWithdrawn: number, balance: bigint): bigint;
}

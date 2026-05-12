import { Transaction } from "@mysten/sui/transactions";
import { SendParams, SplitSendParams } from "./types";
export declare class InstantClient {
    private packageId;
    constructor(packageId: string);
    send(params: SendParams): Transaction;
    splitSend(params: SplitSendParams): Transaction;
}

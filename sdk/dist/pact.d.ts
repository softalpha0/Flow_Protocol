import { Transaction } from "@mysten/sui/transactions";
import { CreatePactParams } from "./types";
export declare class PactClient {
    private packageId;
    constructor(packageId: string);
    createPact(params: CreatePactParams): Transaction;
    completePact(params: {
        pactId: string;
        coinType?: string;
    }): Transaction;
    cancelPact(params: {
        pactId: string;
        coinType?: string;
    }): Transaction;
    disputePact(params: {
        pactId: string;
        coinType?: string;
    }): Transaction;
}

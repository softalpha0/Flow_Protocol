export type Network = "testnet" | "mainnet" | "devnet";
export interface FlowConfig {
    network: Network;
    packageId?: string;
}
export interface CreateStreamParams {
    recipient: string;
    ratePerSecond: bigint;
    deposit: bigint;
    coinType?: string;
    coinObjectId: string;
}
export interface CreatePactParams {
    recipient: string;
    amount: bigint;
    description: string;
    deadline?: number;
    walrusBlobId?: string;
    coinType?: string;
    coinObjectId: string;
}
export interface SendParams {
    recipient: string;
    amount: bigint;
    coinType?: string;
    coinObjectId: string;
}
export interface SplitSendParams {
    recipients: string[];
    amounts: bigint[];
    coinType?: string;
    coinObjectId: string;
}
export interface StreamData {
    id: string;
    sender: string;
    recipient: string;
    ratePerSecond: bigint;
    balance: bigint;
    startTime: number;
    lastWithdrawn: number;
    isActive: boolean;
}
export interface PactData {
    id: string;
    sender: string;
    recipient: string;
    amount: bigint;
    description: string;
    status: number;
    createdAt: number;
    deadline: number;
}
export declare const PactStatus: {
    readonly PENDING: 0;
    readonly COMPLETED: 1;
    readonly DISPUTED: 2;
    readonly CANCELLED: 3;
};

import { StreamClient } from "./stream";
import { PactClient } from "./pact";
import { InstantClient } from "./instant";
import { FlowConfig, Network } from "./types";
export declare class FlowClient {
    stream: StreamClient;
    pact: PactClient;
    instant: InstantClient;
    private packageId;
    private network;
    constructor(config?: FlowConfig);
    getPackageId(): string;
    getNetwork(): Network;
}
export { StreamClient } from "./stream";
export { PactClient } from "./pact";
export { InstantClient } from "./instant";
export * from "./types";
export * from "./constants";

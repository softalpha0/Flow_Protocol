import { StreamClient } from "./stream";
import { PactClient } from "./pact";
import { InstantClient } from "./instant";
import { PACKAGE_IDS } from "./constants";
export class FlowClient {
    constructor(config = { network: "testnet" }) {
        this.network = config.network;
        this.packageId = config.packageId ?? PACKAGE_IDS[config.network];
        if (!this.packageId) {
            throw new Error(`No package ID configured for network: ${config.network}`);
        }
        this.stream = new StreamClient(this.packageId);
        this.pact = new PactClient(this.packageId);
        this.instant = new InstantClient(this.packageId);
    }
    getPackageId() { return this.packageId; }
    getNetwork() { return this.network; }
}
export { StreamClient } from "./stream";
export { PactClient } from "./pact";
export { InstantClient } from "./instant";
export * from "./types";
export * from "./constants";

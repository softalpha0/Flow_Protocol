import { StreamClient } from "./stream";
import { PactClient } from "./pact";
import { InstantClient } from "./instant";
import { PACKAGE_IDS } from "./constants";
import { FlowConfig, Network } from "./types";

export class FlowClient {
  public stream: StreamClient;
  public pact: PactClient;
  public instant: InstantClient;
  private packageId: string;
  private network: Network;

  constructor(config: FlowConfig = { network: "testnet" }) {
    this.network = config.network;
    this.packageId = config.packageId ?? PACKAGE_IDS[config.network];

    if (!this.packageId) {
      throw new Error(`No package ID configured for network: ${config.network}`);
    }

    this.stream = new StreamClient(this.packageId);
    this.pact = new PactClient(this.packageId);
    this.instant = new InstantClient(this.packageId);
  }

  getPackageId(): string { return this.packageId; }
  getNetwork(): Network { return this.network; }
}

export { StreamClient } from "./stream";
export { PactClient } from "./pact";
export { InstantClient } from "./instant";
export * from "./types";
export * from "./constants";

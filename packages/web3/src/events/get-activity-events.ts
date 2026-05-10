import { contractAbis, contractAddresses } from "../contracts";
import { createPublicViemClient } from "../client";

export type ActivityEvent = {
  eventName: "DocumentRegistered" | "DocumentRevoked" | "DocumentSuperseded";
  txHash: `0x${string}`;
  blockNumber: bigint;
  args: Record<string, unknown>;
};

export async function getActivityEvents(fromBlock: bigint = 0n): Promise<ActivityEvent[]> {
  const client = createPublicViemClient();
  const logs = await client.getLogs({
    address: contractAddresses.registry,
    events: [
      contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentRegistered")!,
      contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentRevoked")!,
      contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentSuperseded")!,
    ],
    fromBlock,
    toBlock: "latest",
  });

  return logs.map((log) => ({
    eventName: log.eventName as ActivityEvent["eventName"],
    txHash: log.transactionHash,
    blockNumber: log.blockNumber ?? 0n,
    args: (log.args ?? {}) as Record<string, unknown>,
  }));
}

import { contractAbis, contractAddresses } from "../contracts";
import { createPublicViemClient } from "../client";
import { DEPLOYMENT_BLOCK_AMOY } from "../constants";

export type ActivityEvent = {
  eventName: "DocumentRegistered" | "DocumentRevoked" | "DocumentSuperseded" | "IssuerApproved" | "IssuerRevoked";
  txHash: `0x${string}`;
  blockNumber: bigint;
  args: Record<string, unknown>;
};

const BATCH_SIZE = 2500n;

export async function getActivityEvents(): Promise<ActivityEvent[]> {
  const client = createPublicViemClient();
  const currentBlock = await client.getBlockNumber();
  const fromBlock = DEPLOYMENT_BLOCK_AMOY;

  let registryLogs: any[] = [];
  let accessLogs: any[] = [];
  
  // 1. Fetch Registry Events (Documents)
  for (let start = fromBlock; start <= currentBlock; start += BATCH_SIZE) {
    const end = start + BATCH_SIZE > currentBlock ? currentBlock : start + BATCH_SIZE;
    try {
      const logs = await client.getLogs({
        address: contractAddresses.registry,
        events: [
          contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentRegistered")!,
          contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentRevoked")!,
          contractAbis.TrustifyRegistryAbi.find((item) => item.type === "event" && item.name === "DocumentSuperseded")!,
        ],
        fromBlock: start,
        toBlock: end,
      });
      registryLogs = [...registryLogs, ...logs];
    } catch (e) { console.warn(`Registry Batch ${start} failed`, e); }
  }

  // 2. Fetch Access Control Events (Issuers)
  for (let start = fromBlock; start <= currentBlock; start += BATCH_SIZE) {
    const end = start + BATCH_SIZE > currentBlock ? currentBlock : start + BATCH_SIZE;
    try {
      const logs = await client.getLogs({
        address: contractAddresses.accessControl,
        events: [
          contractAbis.TrustifyAccessControlAbi.find((item) => item.type === "event" && item.name === "IssuerApproved")!,
          contractAbis.TrustifyAccessControlAbi.find((item) => item.type === "event" && item.name === "IssuerRevoked")!,
        ],
        fromBlock: start,
        toBlock: end,
      });
      accessLogs = [...accessLogs, ...logs];
    } catch (e) { console.warn(`Access Batch ${start} failed`, e); }
  }

  // 3. Merge and Normalize
  const allEvents: ActivityEvent[] = [
    ...registryLogs.map(l => ({
      eventName: l.eventName as ActivityEvent["eventName"],
      txHash: l.transactionHash,
      blockNumber: l.blockNumber ?? 0n,
      args: (l.args ?? {}) as Record<string, unknown>,
    })),
    ...accessLogs.map(l => ({
      eventName: l.eventName as ActivityEvent["eventName"],
      txHash: l.transactionHash,
      blockNumber: l.blockNumber ?? 0n,
      args: (l.args ?? {}) as Record<string, unknown>,
    }))
  ];

  // 4. Sort by block (newest first)
  return allEvents.sort((a, b) => Number(b.blockNumber - a.blockNumber));
}

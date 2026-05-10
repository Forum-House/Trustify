export type ActivityEvent = {
  eventName: "DocumentRegistered" | "DocumentRevoked" | "DocumentSuperseded";
  txHash: `0x${string}`;
  blockNumber: bigint;
  args: Record<string, unknown>;
};

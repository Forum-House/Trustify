export interface ActivityEvent {
  type:
    | "document_registered"
    | "document_revoked"
    | "document_superseded"
    | "issuer_approved"
    | "issuer_revoked";
  actorAddress: `0x${string}`;
  targetHash?: `0x${string}`;
  targetIssuer?: `0x${string}`;
  blockNumber: bigint;
  txHash: `0x${string}`;
  timestamp: number;
}

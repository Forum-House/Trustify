export type DocumentStatus = "active" | "revoked" | "expired" | "superseded";

export type DocumentSector =
  | "education"
  | "healthcare"
  | "legal"
  | "government"
  | "corporate";

export interface DocumentRecord {
  hash: `0x${string}`;
  cid: string;
  issuer: `0x${string}`;
  holderName: string;
  holderId: string;
  documentType: string;
  sector: DocumentSector;
  issuedAt: bigint | number;
  expiresAt: bigint | number;
  registeredAt: bigint | number;
  status: DocumentStatus;
  revokedAt?: bigint | number;
  revocationReason?: string;
  supersededByHash?: `0x${string}`;
  txHash?: `0x${string}`;
}

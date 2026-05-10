import type { DocumentSector } from "./document";

export interface IssuerProfile {
  walletAddress: `0x${string}`;
  name: string;
  sector: DocumentSector;
  approvedAt: number;
  revokedAt: number | null;
  status: "approved" | "revoked";
  documentCount: number;
}

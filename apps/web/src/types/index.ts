// Document-related types
export type DocumentStatus = "active" | "revoked" | "expired" | "superseded";
export type DocumentSector = "education" | "healthcare" | "legal" | "government" | "corporate";

export interface DocumentRecord {
  hash: `0x${string}`;
  cid: string;
  holderName: string;
  holderId: string;
  documentType: string;
  sector: DocumentSector;
  issuedAt: number;
  expiresAt?: number;
  issuer: `0x${string}`;
  status: DocumentStatus;
  registeredAt: number;
  revokedAt?: number;
  revocationReason?: string;
  supersededByHash?: `0x${string}`;
  txHash: `0x${string}`;
}

export interface DocumentInput {
  holderName: string;
  holderId: string;
  documentType: string;
  sector: DocumentSector;
  issuedAt: number;
  expiresAt?: number;
  cid?: string;
}

// Verification types
export type VerificationStatus = "valid" | "revoked" | "expired" | "superseded" | "not_found";

export interface VerificationResult {
  found: boolean;
  status: VerificationStatus;
  document?: DocumentRecord;
  inputHash: string;
  message: string;
}

// Issuer types
export interface IssuerProfile {
  walletAddress: `0x${string}`;
  name?: string;
  sector?: DocumentSector;
  approvedAt: number;
  documentCount: number;
  isActive: boolean;
}

// Activity/Event types
export type ActivityEventType =
  | "document_registered"
  | "document_revoked"
  | "document_superseded"
  | "issuer_approved"
  | "issuer_revoked";

export interface ActivityEvent {
  type: ActivityEventType;
  timestamp: number;
  actor: `0x${string}`;
  data: Record<string, unknown>;
  txHash: `0x${string}`;
}

import type { DocumentRecord, DocumentStatus } from "./document";

export interface VerificationResult {
  found: boolean;
  status: DocumentStatus | "not_found" | "tampered";
  document: DocumentRecord | null;
  checkedAt: number;
  inputHash: `0x${string}`;
}

import { useCallback, useMemo, useState } from "react";
import { contractAbis, contractAddresses } from "../../contracts";
import { createPublicViemClient } from "../../client";
import type { VerificationResult, DocumentRecord, DocumentSector } from "@trustify/config";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

const SECTOR_LABELS: DocumentSector[] = ["education", "healthcare", "legal", "government", "corporate"];

export function useVerifyDocument() {
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const verifyDocument = useCallback(async (hash: `0x${string}`): Promise<VerificationResult> => {
    setStatus("pending");
    setError(null);
    try {
      const client = createPublicViemClient();
      const result = await client.readContract({
        address: contractAddresses.registry,
        abi: contractAbis.TrustifyRegistryAbi,
        functionName: "verifyDocument",
        args: [hash],
      });

      setStatus("confirming");
      const record = result.record;
      const mappedRecord: DocumentRecord | null = result.exists
        ? {
            hash: record.hash,
            cid: record.cid,
            issuer: record.issuer,
            holderName: record.holderName,
            holderId: record.holderId,
            documentType: record.documentType,
            sector: SECTOR_LABELS[Number(record.sector)] ?? "education",
            issuedAt: BigInt(record.issuedAt),
            expiresAt: BigInt(record.expiresAt),
            registeredAt: BigInt(record.registeredAt),
            status: result.revoked ? "revoked" : result.superseded ? "superseded" : result.expired ? "expired" : "active",
            revocationReason: record.revokeReason,
            supersededByHash: record.supersededByHash,
          }
        : null;

      const normalized: VerificationResult = {
        found: Boolean(result.exists),
        status: !result.exists
          ? "not_found"
          : result.revoked
            ? "revoked"
            : result.superseded
              ? "superseded"
              : result.expired
                ? "expired"
                : "active",
        document: mappedRecord,
        checkedAt: Date.now(),
        inputHash: hash,
      };

      setStatus("success");
      return normalized;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Verification failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, []);

  return { verifyDocument, ...useMemo(() => toLifecycle(status, error), [status, error]) };
}

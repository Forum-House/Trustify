import { useReadContract } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { contractAbis, contractAddresses } from "../../contracts";
import { createPublicViemClient } from "../../client";
import type { DocumentRecord } from "@trustify/config";

export function useIssuerDocuments(issuer?: `0x${string}`) {
  return useReadContract({
    address: contractAddresses.registry,
    abi: contractAbis.TrustifyRegistryAbi,
    functionName: "getIssuerDocuments",
    args: [issuer ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: Boolean(issuer) },
  });
}

export function useIssuerFullDocuments(issuer?: `0x${string}`) {
  const { data: hashes, isLoading: hashesLoading } = useIssuerDocuments(issuer);

  const query = useQuery({
    queryKey: ["issuerFullDocuments", issuer, hashes],
    queryFn: async (): Promise<DocumentRecord[]> => {
      if (!hashes || hashes.length === 0) return [];
      const client = createPublicViemClient();
      
      const results = await Promise.all(
        hashes.map((hash) =>
          client.readContract({
            address: contractAddresses.registry,
            abi: contractAbis.TrustifyRegistryAbi,
            functionName: "getDocument",
            args: [hash],
          })
        )
      );

      return results.map((r: any) => {
        let status = "unknown";
        if (r.status === 1) status = "active";
        else if (r.status === 2) status = "revoked";
        else if (r.status === 3) status = "superseded";

        return {
          hash: r.hash,
          cid: r.cid,
          holderName: r.holderName,
          holderId: r.holderId,
          documentType: r.documentType,
          sector: r.sector?.toString() ?? "0",
          issuedAt: Number(r.issuedAt),
          expiresAt: Number(r.expiresAt),
          registeredAt: Number(r.registeredAt),
          revokedAt: Number(r.revokedAt),
          issuer: r.issuer,
          status,
          supersededByHash: r.supersededByHash,
          revocationReason: r.revokeReason,
        } as unknown as DocumentRecord;
      });
    },
    enabled: Boolean(issuer && hashes && hashes.length > 0),
  });

  return {
    ...query,
    isLoading: hashesLoading || query.isLoading
  };
}

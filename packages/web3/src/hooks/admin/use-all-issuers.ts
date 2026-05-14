import { useMemo } from "react";
import { usePublicClient } from "wagmi";
import { IssuerProfile, DocumentSector } from "@trustify/config";
import { contractAbis, contractAddresses } from "../../contracts";
import { DEPLOYMENT_BLOCK_AMOY } from "../../constants";

export function useAllIssuers() {
  const client = usePublicClient();

  const loadIssuers = async (): Promise<IssuerProfile[]> => {
    if (!client) return [];

    try {
      // 1. Get the list of all issuer addresses directly from the contract
      const issuerAddresses = await client.readContract({
        address: contractAddresses.accessControl,
        abi: contractAbis.TrustifyAccessControlAbi,
        functionName: "getAllIssuers",
      }) as `0x${string}`[];

      if (!issuerAddresses || issuerAddresses.length === 0) return [];

      // 2. Fetch metadata for all issuers in parallel (On-chain source of truth)
      const profiles = await Promise.all(
        issuerAddresses.map(async (addr) => {
          const [name, sector, approvedAt, isIssuer] = await Promise.all([
            client.readContract({
              address: contractAddresses.accessControl,
              abi: contractAbis.TrustifyAccessControlAbi,
              functionName: "issuerName",
              args: [addr],
            }),
            client.readContract({
              address: contractAddresses.accessControl,
              abi: contractAbis.TrustifyAccessControlAbi,
              functionName: "issuerSector",
              args: [addr],
            }),
            client.readContract({
              address: contractAddresses.accessControl,
              abi: contractAbis.TrustifyAccessControlAbi,
              functionName: "issuerApprovedAt",
              args: [addr],
            }),
            client.readContract({
              address: contractAddresses.accessControl,
              abi: contractAbis.TrustifyAccessControlAbi,
              functionName: "isIssuer",
              args: [addr],
            }),
          ]);

          return {
            walletAddress: addr,
            name: name as string,
            // Sync with UI lowercase enum
            sector: (sector as string).toLowerCase() as DocumentSector,
            approvedAt: Number(approvedAt),
            revokedAt: !isIssuer ? Number(Date.now() / 1000) : null, // Status check
            status: isIssuer ? "approved" : "revoked",
            documentCount: 0,
          } as IssuerProfile;
        })
      );

      return profiles;
    } catch (e) {
      console.error("Failed to load issuers from contract:", e);
      return [];
    }
  };

  return useMemo(() => ({ loadIssuers }), [client]);
}

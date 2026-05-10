import { useMemo } from "react";
import { usePublicClient } from "wagmi";
import { IssuerProfile } from "@trustify/config";
import { contractAbis, contractAddresses } from "../../contracts";

export function useAllIssuers() {
  const client = usePublicClient();

  const loadIssuers = async (): Promise<IssuerProfile[]> => {
    if (!client) return [];
    const logs = await client.getLogs({
      address: contractAddresses.accessControl,
      event: {
        type: "event",
        name: "IssuerApproved",
        inputs: [
          { type: "address", name: "issuer", indexed: true },
          { type: "address", name: "admin", indexed: true },
          { type: "uint256", name: "timestamp", indexed: false },
        ],
      },
      fromBlock: 0n,
      toBlock: "latest",
    });

    const unique = new Set<string>();
    for (const log of logs) {
      const issuer = log.args.issuer as string | undefined;
      if (issuer) unique.add(issuer);
    }

    return Array.from(unique).map((wallet) => ({
      walletAddress: wallet as `0x${string}`,
      name: "",
      sector: "education",
      approvedAt: 0,
      revokedAt: null,
      status: "approved",
      documentCount: 0,
    }));
  };

  return useMemo(() => ({ loadIssuers }), [client]);
}

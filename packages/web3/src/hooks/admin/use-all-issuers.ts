import { useMemo } from "react";
import { usePublicClient } from "wagmi";
import { IssuerProfile, DocumentSector } from "@trustify/config";
import { contractAbis, contractAddresses } from "../../contracts";

const STORAGE_KEY = "trustify:issuer_metadata";

type IssuerMetadata = Record<string, { name: string; sector: string }>;

function getStoredMetadata(): IssuerMetadata {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** Call this when approving an issuer to persist their name/sector locally */
export function saveIssuerMetadata(wallet: string, name: string, sector: string) {
  const existing = getStoredMetadata();
  existing[wallet.toLowerCase()] = { name, sector };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function useAllIssuers() {
  const client = usePublicClient();

  const loadIssuers = async (): Promise<IssuerProfile[]> => {
    if (!client) return [];
    const currentBlock = await client.getBlockNumber();
    const actualFromBlock = currentBlock - 5000n > 0n ? currentBlock - 5000n : 0n;

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
      fromBlock: actualFromBlock,
      toBlock: "latest",
    });

    // Collect all approve/revoke events per issuer to determine current status
    const revokedLogs = await client.getLogs({
      address: contractAddresses.accessControl,
      event: {
        type: "event",
        name: "IssuerRevoked",
        inputs: [
          { type: "address", name: "issuer", indexed: true },
          { type: "address", name: "admin", indexed: true },
          { type: "uint256", name: "timestamp", indexed: false },
        ],
      },
      fromBlock: actualFromBlock,
      toBlock: "latest",
    });

    // Enrich with localStorage metadata (off-chain workaround — Phase 4.5 will add on-chain)
    const metadata = getStoredMetadata();

    const approvedLogs = logs.map(l => ({
      issuer: (l.args.issuer as string).toLowerCase(),
      timestamp: l.args.timestamp as bigint ?? 0n,
      blockNumber: l.blockNumber
    }));

    const revokedLogsParsed = revokedLogs.map(l => ({
      issuer: (l.args.issuer as string).toLowerCase(),
      timestamp: l.args.timestamp as bigint ?? 0n,
      blockNumber: l.blockNumber
    }));

    // For each unique issuer, find the latest event to determine status
    const issuerMap = new Map<string, { timestamp: bigint, blockNumber: bigint, status: "approved" | "revoked" }>();

    approvedLogs.forEach(log => {
      const existing = issuerMap.get(log.issuer);
      if (!existing || log.blockNumber > existing.blockNumber) {
        issuerMap.set(log.issuer, { timestamp: log.timestamp, blockNumber: log.blockNumber, status: "approved" });
      }
    });

    revokedLogsParsed.forEach(log => {
      const existing = issuerMap.get(log.issuer);
      if (existing && log.blockNumber > existing.blockNumber) {
        issuerMap.set(log.issuer, { ...existing, timestamp: log.timestamp, blockNumber: log.blockNumber, status: "revoked" });
      }
    });

    return Array.from(issuerMap.entries()).map(([wallet, data]) => {
      const stored = metadata[wallet];
      return {
        walletAddress: wallet as `0x${string}`,
        name: stored?.name ?? "",
        sector: (stored?.sector ?? "education") as DocumentSector,
        approvedAt: Number(data.timestamp),
        revokedAt: data.status === "revoked" ? Number(data.timestamp) : null,
        status: data.status,
        documentCount: 0,
      };
    });
  };

  return useMemo(() => ({ loadIssuers, saveIssuerMetadata }), [client]);
}

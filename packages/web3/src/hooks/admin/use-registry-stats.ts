import { useReadContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";

export function useRegistryStats() {
  const totalDocumentsQuery = useReadContract({
    address: contractAddresses.registry,
    abi: contractAbis.TrustifyRegistryAbi,
    functionName: "totalDocuments",
  });

  return {
    totalDocuments: totalDocumentsQuery.data ?? 0n,
    ...totalDocumentsQuery,
  };
}

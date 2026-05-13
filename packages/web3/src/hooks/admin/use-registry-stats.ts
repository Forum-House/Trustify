import { useReadContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";

export function useRegistryStats() {
  const { data: totalDocuments, isLoading, isError } = useReadContract({
    address: contractAddresses.registry,
    abi: contractAbis.TrustifyRegistryAbi,
    functionName: "totalDocuments",
  });

  return {
    totalDocuments: totalDocuments as bigint | undefined,
    isLoading,
    isError,
  };
}

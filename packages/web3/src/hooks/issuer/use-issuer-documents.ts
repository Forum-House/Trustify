import { useReadContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";

export function useIssuerDocuments(issuer?: `0x${string}`) {
  return useReadContract({
    address: contractAddresses.registry,
    abi: contractAbis.TrustifyRegistryAbi,
    functionName: "getIssuerDocuments",
    args: [issuer ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: Boolean(issuer) },
  });
}

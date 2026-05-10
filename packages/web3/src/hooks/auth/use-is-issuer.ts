import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";

export function useIsIssuer(address?: `0x${string}`) {
  const query = useReadContract({
    address: contractAddresses.accessControl,
    abi: contractAbis.TrustifyAccessControlAbi,
    functionName: "isIssuer",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: Boolean(address) },
  });

  const isIssuer = useMemo(() => Boolean(query.data), [query.data]);

  return { ...query, isIssuer };
}

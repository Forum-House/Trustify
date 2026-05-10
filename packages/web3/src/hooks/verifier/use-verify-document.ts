import { useCallback, useState } from "react";
import { contractAbis, contractAddresses } from "../../contracts";
import { createPublicViemClient } from "../../client";

export function useVerifyDocument() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyDocument = useCallback(async (hash: `0x${string}`) => {
    setIsLoading(true);
    setError(null);
    try {
      const client = createPublicViemClient();
      const result = await client.readContract({
        address: contractAddresses.registry,
        abi: contractAbis.TrustifyRegistryAbi,
        functionName: "verifyDocument",
        args: [hash],
      });
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Verification failed";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { verifyDocument, isLoading, error };
}

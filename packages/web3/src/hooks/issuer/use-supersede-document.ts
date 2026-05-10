import { useCallback, useMemo, useState } from "react";
import { useWriteContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

export function useSupersedeDocument() {
  const mutation = useWriteContract();
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const supersedeDocument = useCallback(async (oldHash: `0x${string}`, newHash: `0x${string}`) => {
    setStatus("pending");
    setError(null);
    try {
      const tx = await mutation.writeContractAsync({
        address: contractAddresses.registry,
        abi: contractAbis.TrustifyRegistryAbi,
        functionName: "supersedeDocument",
        args: [oldHash, newHash],
      });
      setStatus("confirming");
      setStatus("success");
      return tx;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Supersede document failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, [mutation]);

  return { supersedeDocument, ...useMemo(() => toLifecycle(status, error), [status, error]), ...mutation };
}

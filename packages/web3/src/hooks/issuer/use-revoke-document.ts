import { useCallback, useMemo, useState } from "react";
import { useWriteContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

export function useRevokeDocument() {
  const mutation = useWriteContract();
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const revokeDocument = useCallback(async (hash: `0x${string}`, reason: string) => {
    setStatus("pending");
    setError(null);
    try {
      const tx = await mutation.writeContractAsync({
        address: contractAddresses.registry,
        abi: contractAbis.TrustifyRegistryAbi,
        functionName: "revokeDocument",
        args: [hash, reason],
      });
      setStatus("confirming");
      setStatus("success");
      return tx;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Revoke document failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, [mutation]);

  return { revokeDocument, ...useMemo(() => toLifecycle(status, error), [status, error]), ...mutation };
}

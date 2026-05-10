import { useCallback, useMemo, useState } from "react";
import { useWriteContract } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

export function useApproveIssuer() {
  const mutation = useWriteContract();
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const approveIssuer = useCallback(async (issuer: `0x${string}`) => {
    setStatus("pending");
    setError(null);
    try {
      const tx = await mutation.writeContractAsync({
        address: contractAddresses.accessControl,
        abi: contractAbis.TrustifyAccessControlAbi,
        functionName: "approveIssuer",
        args: [issuer],
      });
      setStatus("confirming");
      setStatus("success");
      return tx;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Approve issuer failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, [mutation]);

  return { approveIssuer, ...useMemo(() => toLifecycle(status, error), [status, error]), ...mutation };
}

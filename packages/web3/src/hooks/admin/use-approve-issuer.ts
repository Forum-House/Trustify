import { useCallback, useMemo, useState } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

export function useApproveIssuer() {
  const mutation = useWriteContract();
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const approveIssuer = useCallback(async (issuer: `0x${string}`, name: string, sector: string) => {
    setStatus("pending");
    setError(null);
    setTxHash(null);
    try {
      const tx = await mutation.writeContractAsync({
        address: contractAddresses.accessControl,
        abi: contractAbis.TrustifyAccessControlAbi,
        functionName: "approveIssuer",
        args: [issuer, name, sector],
      });
      setTxHash(tx);
      setStatus("confirming");
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash: tx });
      }
      setStatus("success");
      return tx;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Approve issuer failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, [mutation, publicClient]);

  return { approveIssuer, txHash, ...useMemo(() => toLifecycle(status, error), [status, error]) };
}

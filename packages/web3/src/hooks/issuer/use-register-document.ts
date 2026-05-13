import { useCallback, useMemo, useState } from "react";
import { useWriteContract, usePublicClient } from "wagmi";
import { contractAbis, contractAddresses } from "../../contracts";
import { toLifecycle, type HookLifecycleStatus } from "../shared/lifecycle";

export type RegisterDocumentInput = {
  hash: `0x${string}`;
  cid: string;
  holderName: string;
  holderId: string;
  documentType: string;
  sector: number;
  issuedAt: bigint;
  expiresAt: bigint;
};

export function useRegisterDocument() {
  const mutation = useWriteContract();
  const publicClient = usePublicClient();
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const registerDocument = useCallback(async (input: RegisterDocumentInput) => {
    setStatus("pending");
    setError(null);
    setTxHash(null);
    try {
      const hash = await mutation.writeContractAsync({
        address: contractAddresses.registry,
        abi: contractAbis.TrustifyRegistryAbi,
        functionName: "registerDocument",
        args: [
          input.hash,
          input.cid,
          input.holderName,
          input.holderId,
          input.documentType,
          input.sector,
          input.issuedAt,
          input.expiresAt,
        ],
      });

      setTxHash(hash);
      setStatus("confirming");
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }
      setStatus("success");
      return { txHash: hash };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Register document failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, [mutation, publicClient]);

  return { registerDocument, txHash, ...useMemo(() => toLifecycle(status, error), [status, error]) };
}

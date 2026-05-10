import { useCallback, useMemo, useState } from "react";
import { contractAbis, contractAddresses } from "../../contracts";
import { createLocalWalletClient, createPublicViemClient } from "../../client";
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
  const [status, setStatus] = useState<HookLifecycleStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const registerDocument = useCallback(async (input: RegisterDocumentInput) => {
    setStatus("pending");
    setError(null);
    try {
      const wallet = createLocalWalletClient();
      const publicClient = createPublicViemClient();
      const [account] = await wallet.getAddresses();

      const txHash = await wallet.writeContract({
        chain: wallet.chain,
        account,
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

      setStatus("confirming");
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      setStatus("success");
      return { txHash, receipt };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Register document failed";
      setError(message);
      setStatus("error");
      throw e;
    }
  }, []);

  return { registerDocument, ...useMemo(() => toLifecycle(status, error), [status, error]) };
}

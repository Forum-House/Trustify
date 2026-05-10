import { useCallback, useState } from "react";
import { contractAbis, contractAddresses } from "../../contracts";
import { createLocalWalletClient, createPublicViemClient } from "../../client";

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerDocument = useCallback(async (input: RegisterDocumentInput) => {
    setIsLoading(true);
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

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      return { txHash, receipt };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Register document failed";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { registerDocument, isLoading, error };
}

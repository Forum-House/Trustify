import { useAccount } from "wagmi";
import { useIsAdmin } from "./use-is-admin";
import { useIsIssuer } from "./use-is-issuer";

export type ConnectedRole = "admin" | "issuer" | "none";

export function useConnectedRole() {
  const { address, isConnected } = useAccount();
  const adminQuery = useIsAdmin(address);
  const issuerQuery = useIsIssuer(address);

  const role: ConnectedRole = !isConnected
    ? "none"
    : adminQuery.isAdmin
      ? "admin"
      : issuerQuery.isIssuer
        ? "issuer"
        : "none";

  return {
    role,
    isConnected,
    isLoading: adminQuery.isLoading || issuerQuery.isLoading,
    isError: adminQuery.isError || issuerQuery.isError,
    refetch: async () => Promise.all([adminQuery.refetch(), issuerQuery.refetch()]),
  };
}

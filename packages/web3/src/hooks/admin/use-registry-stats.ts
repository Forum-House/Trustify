import { createPublicViemClient } from "../../client";

export function useRegistryStats() {
  // Note: The deployed TrustifyRegistry contract does not expose a totalDocuments()
  // function. Stats are derived from on-chain events via getActivityEvents().
  // This hook returns a stub until Phase 4 adds the counter to the contract.
  return {
    totalDocuments: undefined as bigint | undefined,
    isLoading: false,
    isError: false,
  };
}

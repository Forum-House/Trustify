import { TrustifyAccessControlAbi, TrustifyRegistryAbi } from "@trustify/config";
import localhostDeployment from "../../../infra/deployments/localhost.json";
import amoyDeployment from "../../../infra/deployments/amoy.json";

const chainKey = (process.env.NEXT_PUBLIC_CHAIN_KEY ?? "localhost") as "localhost" | "amoy";
const deployment = chainKey === "amoy" ? amoyDeployment : localhostDeployment;

export const contractAbis = {
  TrustifyAccessControlAbi,
  TrustifyRegistryAbi,
} as const;

// Helper to handle both old simple format ("address") and new nested format ({ address: "...", txHash: "..." })
const getAddress = (
  legacyProp: string,
  newProp: string
) => {
  const contracts = deployment.contracts as any;
  if (contracts[newProp] && typeof contracts[newProp] === "object") {
    return contracts[newProp].address as `0x${string}`;
  }
  return contracts[legacyProp] as `0x${string}`;
};

export const contractAddresses = {
  accessControl: getAddress("accessControl", "TrustifyAccessControl"),
  registry: getAddress("registry", "TrustifyRegistry"),
} as const;

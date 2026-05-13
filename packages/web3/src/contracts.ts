import { TrustifyAccessControlAbi, TrustifyRegistryAbi } from "@trustify/config";
import localhostDeployment from "../../../infra/deployments/localhost.json";
import amoyDeployment from "../../../infra/deployments/amoy.json";

const chainKey = (process.env.NEXT_PUBLIC_CHAIN_KEY ?? "localhost") as "localhost" | "amoy";
const deployment = chainKey === "amoy" ? amoyDeployment : localhostDeployment;

export const contractAbis = {
  TrustifyAccessControlAbi,
  TrustifyRegistryAbi,
} as const;

export const contractAddresses = {
  accessControl: deployment.contracts.accessControl as `0x${string}`,
  registry: deployment.contracts.registry as `0x${string}`,
} as const;

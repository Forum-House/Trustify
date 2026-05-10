import { TrustifyAccessControlAbi, TrustifyRegistryAbi } from "@trustify/config";
import localhostDeployment from "../../../infra/deployments/localhost.json";

export const contractAbis = {
  TrustifyAccessControlAbi,
  TrustifyRegistryAbi,
} as const;

export const contractAddresses = {
  accessControl: localhostDeployment.contracts.TrustifyAccessControl.address as `0x${string}`,
  registry: localhostDeployment.contracts.TrustifyRegistry.address as `0x${string}`,
} as const;

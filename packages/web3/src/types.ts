export type ContractAddressMap = {
  TrustifyAccessControl: `0x${string}`;
  TrustifyRegistry: `0x${string}`;
};

export type DeploymentMetadata = {
  network: string;
  chainId: number;
  deployedAt: string;
  contracts: {
    TrustifyAccessControl: { address: `0x${string}`; txHash?: string };
    TrustifyRegistry: { address: `0x${string}`; txHash?: string };
  };
};

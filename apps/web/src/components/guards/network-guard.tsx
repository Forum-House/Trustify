"use client";

import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { resolveChainConfig } from "../../lib/wagmi";
import { WrongNetworkModal } from "../modals/wrong-network-modal";

export function NetworkGuard({ children }: { children: ReactNode }) {
  const { chainId, isConnected } = useAccount();
  const target = resolveChainConfig();

  const isWrongNetwork = isConnected && chainId && chainId !== target.chainId;

  if (isWrongNetwork) {
    return <WrongNetworkModal open={true} />;
  }

  return <>{children}</>;
}

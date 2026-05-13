import { createConfig, http } from "wagmi";
import { walletConnect, injected } from "wagmi/connectors";
import { defineChain } from "viem";
import { CHAIN_CONFIG } from "@trustify/config";

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6b4468bd9306c2396152a6d4bc84"; // Placeholder for demo

export function resolveChainConfig() {
  const key = (process.env.NEXT_PUBLIC_CHAIN_KEY || "localhost") as keyof typeof CHAIN_CONFIG;
  return CHAIN_CONFIG[key] ?? CHAIN_CONFIG.localhost;
}

export function createWagmiConfig() {
  const chain = resolveChainConfig();
  const viemChain = defineChain({
    id: chain.chainId,
    name: chain.key,
    nativeCurrency: { name: chain.nativeCurrency, symbol: chain.nativeCurrency, decimals: 18 },
    rpcUrls: { default: { http: [chain.rpcUrl] } },
    blockExplorers: chain.explorerUrl
      ? { default: { name: `${chain.key} explorer`, url: chain.explorerUrl } }
      : undefined,
  });

  const transports: Record<number, ReturnType<typeof http>> = {};
  transports[viemChain.id] = http(chain.rpcUrl);

  return createConfig({
    chains: [viemChain],
    transports: transports as any,
    connectors: [
      injected(),
      walletConnect({ projectId: WC_PROJECT_ID })
    ],
    ssr: true,
  });
}

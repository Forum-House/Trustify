import { CHAIN_CONFIG } from "@trustify/config";
import { createPublicClient, createWalletClient, defineChain, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

function resolveChain() {
  const key = (process.env.NEXT_PUBLIC_CHAIN_KEY || "localhost") as keyof typeof CHAIN_CONFIG;
  return CHAIN_CONFIG[key] ?? CHAIN_CONFIG.localhost;
}

export function createPublicViemClient() {
  const chain = resolveChain();
  return createPublicClient({
    chain: defineChain({ id: chain.chainId, name: chain.key, nativeCurrency: { name: chain.nativeCurrency, symbol: chain.nativeCurrency, decimals: 18 }, rpcUrls: { default: { http: [chain.rpcUrl] } } }),
    transport: http(chain.rpcUrl),
  });
}

export function createLocalWalletClient() {
  const chain = resolveChain();
  const privateKey = process.env.NEXT_PUBLIC_LOCAL_PRIVATE_KEY as `0x${string}` | undefined;
  if (!privateKey) throw new Error("NEXT_PUBLIC_LOCAL_PRIVATE_KEY is required for local write transactions.");
  const account = privateKeyToAccount(privateKey);
  return createWalletClient({
    chain: defineChain({ id: chain.chainId, name: chain.key, nativeCurrency: { name: chain.nativeCurrency, symbol: chain.nativeCurrency, decimals: 18 }, rpcUrls: { default: { http: [chain.rpcUrl] } } }),
    account,
    transport: http(chain.rpcUrl),
  });
}

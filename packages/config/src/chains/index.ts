import { amoy } from "./amoy";
import { localhost } from "./localhost";
import { polygon } from "./polygon";

export const CHAIN_CONFIG = { localhost, amoy, polygon } as const;
export type ChainKey = keyof typeof CHAIN_CONFIG;
export const DEFAULT_CHAIN: ChainKey = "amoy";

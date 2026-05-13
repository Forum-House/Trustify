import type { DocumentSector } from "../types";

export const SECTORS: Record<DocumentSector, string> = {
  education: "Education",
  healthcare: "Healthcare",
  legal: "Legal",
  government: "Government",
  corporate: "Corporate",
};

export const SECTOR_COLORS: Record<DocumentSector, string> = {
  education: "from-blue-600 to-blue-700",
  healthcare: "from-red-600 to-red-700",
  legal: "from-purple-600 to-purple-700",
  government: "from-amber-600 to-amber-700",
  corporate: "from-green-600 to-green-700",
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  active: "Authentic",
  revoked: "Revoked",
  expired: "Expired",
  superseded: "Superseded",
  not_found: "Not Found",
};

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  revoked: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  expired: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  superseded: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  not_found: "bg-red-500/10 text-red-400 border-red-500/20",
};

// Polygonscan explorer base URL (resolves based on network)
export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_CHAIN_KEY === "polygon"
    ? "https://polygonscan.com"
    : "https://amoy.polygonscan.com";

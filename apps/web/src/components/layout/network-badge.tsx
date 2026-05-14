"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { Network } from "lucide-react";

export function NetworkBadge() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { chain } = useAccount();

  if (!mounted) return null;

  const networkColor = chain?.id === 80002 ? "bg-amber-500/10 text-amber-300 border-amber-500/20" : "bg-slate-700/50 text-slate-300 border-slate-600/50";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${networkColor}`}>
      <div className="h-2 w-2 rounded-full bg-current" />
      {chain?.name ?? "No chain"}
    </div>
  );
}

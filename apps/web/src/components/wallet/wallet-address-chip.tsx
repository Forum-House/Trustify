"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Copy, LogOut, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function WalletAddressChip() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !address) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center overflow-hidden rounded-full border border-slate-800 bg-slate-900/80 pr-1 shadow-sm">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 transition-colors hover:bg-slate-800/50"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3 text-slate-500 opacity-50" />
          )}
        </button>
        
        <div className="h-4 w-[1px] bg-slate-800" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger 
              onClick={() => disconnect()}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
              aria-label="Disconnect wallet"
            >
              <LogOut className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 border-slate-800 text-xs text-slate-200">
              Disconnect Wallet
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

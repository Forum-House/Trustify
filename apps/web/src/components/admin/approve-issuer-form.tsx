"use client";

import { useState } from "react";
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useApproveIssuer, saveIssuerMetadata } from "@trustify/web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPLORER_URL } from "../../lib/constants";

const SECTORS = [
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "government", label: "Government" },
  { value: "corporate", label: "Corporate" },
];

export function ApproveIssuerForm() {
  const { approveIssuer, isPending, isSuccess, isError, txHash } = useApproveIssuer();
  const [wallet, setWallet] = useState("");
  const [name, setName] = useState("");
  const [sector, setSector] = useState("education");

  const isValid = 
    wallet.startsWith("0x") && 
    wallet.length === 42 && 
    name.trim().length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    
    // Call the on-chain approval
    await approveIssuer(wallet as `0x${string}`);
    
    // Persist the metadata locally (as requested in P2.11/P2.13)
    saveIssuerMetadata(wallet, name, sector);
    
    // Clear name/wallet (sector reset to default)
    setWallet("");
    setName("");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="wallet" className="text-slate-300">Wallet Address</Label>
        <Input
          id="wallet"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x..."
          disabled={isPending}
          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">Organization Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Stanford University"
          disabled={isPending}
          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Primary Sector</Label>
        <Select 
          value={sector} 
          onValueChange={(val) => { if (val) setSector(val); }}
          disabled={isPending}
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-emerald-500/50">
            <SelectValue placeholder="Select a sector" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
            {SECTORS.map((s) => (
              <SelectItem key={s.value} value={s.value} className="focus:bg-slate-700 focus:text-white">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all active:scale-[0.98]"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Confirming…" : "Approve Issuer"}
        </Button>
      </div>

      {isSuccess && txHash && (
        <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Issuer successfully approved!</p>
            <a 
              href={`${EXPLORER_URL}/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 mt-0.5 opacity-80 hover:opacity-100 underline decoration-emerald-500/30 underline-offset-2"
            >
              View transaction <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>Transaction failed. Please check your wallet and try again.</p>
        </div>
      )}
    </div>
  );
}

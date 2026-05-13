"use client";

import { useState } from "react";
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRevokeIssuer } from "@trustify/web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EXPLORER_URL } from "../../lib/constants";

export function RevokeIssuerModal() {
  const { revokeIssuer, isPending, isSuccess, isError, txHash } = useRevokeIssuer();
  const [wallet, setWallet] = useState("");
  const isValid = wallet.startsWith("0x") && wallet.length === 42;

  const handleSubmit = async () => {
    if (!isValid) return;
    await revokeIssuer(wallet as `0x${string}`);
    setWallet("");
  };

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Revoke issuer</label>
        <Input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x issuer wallet"
          disabled={isPending}
          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !isValid}
            variant="destructive"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Confirming…" : "Revoke"}
          </Button>
        </div>

        {isSuccess && txHash && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Issuer revoked!</span>
            <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 underline hover:text-emerald-300">
              View tx <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
        {isError && (
          <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Transaction failed. Check wallet and try again.
          </div>
        )}
      </div>
    </section>
  );
}

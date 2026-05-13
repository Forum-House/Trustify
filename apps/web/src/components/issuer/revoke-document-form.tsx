"use client";

import { useState } from "react";
import { ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRevokeDocument } from "@trustify/web3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EXPLORER_URL } from "../../lib/constants";

export function RevokeDocumentForm() {
  const { revokeDocument, isPending, isSuccess, isError, txHash } = useRevokeDocument();
  const [hash, setHash] = useState("");
  const [reason, setReason] = useState("Issued in error");

  const handleSubmit = async () => {
    if (!hash.startsWith("0x")) return;
    await revokeDocument(hash as `0x${string}`, reason);
    setHash("");
  };

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">Revoke document</label>
        <Input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="0x document hash"
          disabled={isPending}
          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          disabled={isPending}
          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isPending || !hash}
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Confirming…" : "Submit revocation"}
          </Button>
        </div>

        {isSuccess && txHash && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Document revoked!</span>
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

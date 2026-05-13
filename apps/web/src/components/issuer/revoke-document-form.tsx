"use client";

import { useState } from "react";
import { ExternalLink, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useRevokeDocument, useIssuerFullDocuments } from "@trustify/web3";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPLORER_URL } from "../../lib/constants";

export function RevokeDocumentForm() {
  const { revokeDocument, isPending, isSuccess, isError, txHash } = useRevokeDocument();
  const { address } = useAccount();
  const { data: documents, isLoading } = useIssuerFullDocuments(address);

  const [hash, setHash] = useState("");
  const [reason, setReason] = useState("Issued in error");

  const activeDocuments = documents?.filter((d) => d.status === "active") || [];

  const handleSubmit = async () => {
    if (!hash.startsWith("0x")) return;
    await revokeDocument(hash as `0x${string}`, reason);
    setHash("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-slate-300">Select Document</Label>
        <Select 
          value={hash} 
          onValueChange={(val) => { if (val) setHash(val); }}
          disabled={isPending || isLoading || activeDocuments.length === 0}
        >
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 focus:ring-amber-500/50 h-11">
            <SelectValue placeholder={isLoading ? "Loading documents..." : "Choose an active document"} />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100 max-h-[300px]">
            {activeDocuments.map((doc) => (
              <SelectItem key={doc.hash} value={doc.hash} className="focus:bg-slate-700 focus:text-white">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{doc.holderName}</span>
                  <span className="text-[10px] text-slate-400">{doc.documentType} • {doc.hash.slice(0, 14)}...</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeDocuments.length === 0 && !isLoading && (
          <p className="text-[10px] text-amber-500/70">No active documents found to revoke.</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-slate-300">Reason for Revocation</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why is this document being revoked?"
          rows={3}
          disabled={isPending}
          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-amber-500/50"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isPending || !hash}
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-all active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          {isPending ? "Confirming…" : "Revoke Permanently"}
        </Button>
      </div>

      {isSuccess && txHash && (
        <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Document successfully revoked!</p>
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
          <p>Revocation failed. Please check your wallet and try again.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import type { DocumentRecord } from "@trustify/config";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, Hash, ExternalLink, ShieldCheck, ShieldAlert, History } from "lucide-react";
import { EXPLORER_URL } from "../../lib/constants";

interface DocumentDetailDrawerProps {
  document: DocumentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentDetailDrawer({ document, open, onOpenChange }: DocumentDetailDrawerProps) {
  if (!document) return null;

  const formatDate = (ts: any) => {
    if (!ts || ts === 0n || ts === 0) return "N/A";
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case "revoked":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Revoked</Badge>;
      case "superseded":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Superseded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-slate-950 border-slate-800 text-slate-100 sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-xl font-bold">Document Details</SheetTitle>
            {getStatusBadge(document.status)}
          </div>
          <SheetDescription className="text-slate-400">
            Full record of the on-chain credential
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Main Info */}
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Holder Information</p>
                <p className="text-base font-semibold text-slate-100">{document.holderName}</p>
                <p className="text-sm text-slate-400">ID: {document.holderId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Document Metadata</p>
                <p className="text-base font-semibold text-slate-100">{document.documentType}</p>
                <p className="text-sm text-slate-400 capitalize">{document.sector} Sector</p>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" /> Lifecycle Timeline
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Issued On</span>
                <span className="text-slate-200 font-medium">{formatDate(document.issuedAt)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Registered On</span>
                <span className="text-slate-200 font-medium">{formatDate(document.registeredAt)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Expires On</span>
                <span className={`${document.expiresAt ? "text-slate-200" : "text-slate-500 italic"}`}>
                  {formatDate(document.expiresAt)}
                </span>
              </div>
              
              {document.status === "revoked" && (
                <div className="pt-2 mt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-red-400 flex items-center gap-1.5 font-medium">
                      <ShieldAlert className="h-3.5 w-3.5" /> Revoked On
                    </span>
                    <span className="text-red-300">{formatDate(document.revokedAt)}</span>
                  </div>
                  <div className="text-xs bg-red-500/5 border border-red-500/10 rounded p-2 text-red-200/70 italic">
                    Reason: {document.revocationReason || "No reason provided"}
                  </div>
                </div>
              )}

              {document.status === "superseded" && (
                <div className="pt-2 mt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                      <History className="h-3.5 w-3.5" /> Superseded By
                    </span>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 rounded p-2 overflow-hidden">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">New Hash</p>
                    <p className="text-[10px] font-mono text-amber-200/70 break-all">{document.supersededByHash}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Technical Data */}
          <section className="space-y-3">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" /> Content Hash (SHA-256)
              </p>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg font-mono text-[11px] text-sky-300 break-all leading-relaxed">
                {document.hash}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">IPFS Reference</p>
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${document.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 hover:text-white transition-colors group"
              >
                <span className="truncate mr-4 font-mono">{document.cid}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
              </a>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-4 flex flex-col gap-3">
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border-slate-700 p-0">
              <a 
                href={`${EXPLORER_URL}/address/${document.issuer}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-full w-full items-center justify-center gap-2 px-2.5"
              >
                <ShieldCheck className="h-4 w-4" /> View Issuer on PolyScan
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

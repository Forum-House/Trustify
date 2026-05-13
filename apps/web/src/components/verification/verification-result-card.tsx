"use client";

import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRightCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  History,
  Info,
  Calendar,
  Hash as HashIcon
} from "lucide-react";
import type { VerificationResult } from "@trustify/config";
import { formatAddress, formatHash, formatTimestamp } from "../../lib/formatters";
import { EXPLORER_URL } from "../../lib/constants";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  result: VerificationResult | null;
  hash?: string | null;
};

export function VerificationResultCard({ result, hash }: Props) {
  if (!result) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center backdrop-blur-sm shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
            <Info className="h-8 w-8 text-slate-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">Ready to Verify</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Upload a file or provide a document hash to check its authenticity against the Trustify Registry.
        </p>
      </section>
    );
  }

  const { status, document } = result;

  // Get configuration based on status
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-500/5",
          border: "border-emerald-500/20",
          accent: "text-emerald-400",
          glow: "shadow-emerald-500/10",
          label: "Authentic & Valid",
          description: "This document is verified and officially recognized on-chain.",
        };
      case "revoked":
        return {
          icon: XCircle,
          bg: "bg-red-500/5",
          border: "border-red-500/20",
          accent: "text-red-400",
          glow: "shadow-red-500/10",
          label: "Revoked",
          description: "This document has been invalidated by the authorized issuer.",
        };
      case "expired":
        return {
          icon: Clock,
          bg: "bg-amber-500/5",
          border: "border-amber-500/20",
          accent: "text-amber-400",
          glow: "shadow-amber-500/10",
          label: "Expired",
          description: "This document's validity period has passed.",
        };
      case "superseded":
        return {
          icon: ArrowRightCircle,
          bg: "bg-sky-500/5",
          border: "border-sky-500/20",
          accent: "text-sky-400",
          glow: "shadow-sky-500/10",
          label: "Superseded",
          description: "A newer version of this document has been issued.",
        };
      case "tampered":
        return {
          icon: ShieldAlert,
          bg: "bg-orange-500/5",
          border: "border-orange-500/20",
          accent: "text-orange-400",
          glow: "shadow-orange-500/10",
          label: "Verification Failed",
          description: "The document content does not match the registered hash.",
        };
      default:
        return {
          icon: AlertCircle,
          bg: "bg-slate-800/30",
          border: "border-slate-700",
          accent: "text-slate-400",
          glow: "shadow-transparent",
          label: "Not Found",
          description: "No record of this document exists in the Trustify Registry.",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const copyHash = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      toast.success("Hash copied to clipboard");
    }
  };

  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-500 overflow-hidden shadow-2xl",
      config.border,
      config.bg,
      config.glow
    )}>
      {/* Premium Status Header */}
      <div className="relative p-8 md:p-10 border-b border-slate-800/50 overflow-hidden">
        {/* Subtle background glow */}
        <div className={cn("absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[100px] opacity-20", config.accent.replace('text', 'bg'))} />
        
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className={cn(
            "h-20 w-20 rounded-2xl flex items-center justify-center border-2 shadow-inner",
            config.border,
            "bg-slate-950/80"
          )}>
            <Icon className={cn("h-10 w-10", config.accent)} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={cn("text-3xl font-black tracking-tight", config.accent)}>{config.label}</h3>
              <Badge variant="outline" className={cn("text-[10px] uppercase font-bold tracking-widest", config.border, config.accent)}>
                On-Chain Verified
              </Badge>
            </div>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10 space-y-10">
        {/* Document Details - Shown for all states except Not Found */}
        {document ? (
          <div className="grid gap-10 md:grid-cols-2">
            {/* Left Column: Holder & Type */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Credential Information</p>
                    <p className="text-xl font-bold text-slate-100">{document.documentType}</p>
                    <p className="text-sm text-slate-400 capitalize">{document.sector} Sector</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Holder Identity</p>
                    <p className="text-xl font-bold text-slate-100">{document.holderName}</p>
                    <p className="text-sm font-mono text-slate-400">ID: {document.holderId}</p>
                  </div>
                </div>
              </div>

              {/* Hash Display */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2">
                  <HashIcon className="h-3 w-3" /> Content Integrity Hash
                </p>
                <div className="group relative rounded-xl bg-slate-950 border border-slate-800 p-4 transition-all hover:border-slate-700">
                  <code className="text-[11px] font-mono text-sky-300 break-all leading-relaxed block pr-8">
                    {hash || document.hash}
                  </code>
                  <button 
                    onClick={copyHash}
                    className="absolute top-4 right-4 text-slate-600 hover:text-sky-400 transition-colors"
                    title="Copy full hash"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline & Proof */}
            <div className="space-y-8">
              {/* Lifecycle Info */}
              <div className="rounded-2xl bg-slate-900/30 border border-slate-800/50 p-6 space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 flex items-center gap-2 mb-2">
                  <Calendar className="h-3 w-3" /> Issuance Timeline
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                    <span className="text-xs text-slate-400">Issued Date</span>
                    <span className="text-xs font-semibold text-slate-200">{formatTimestamp(Number(document.issuedAt))}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                    <span className="text-xs text-slate-400">On-Chain Registration</span>
                    <span className="text-xs font-semibold text-slate-200">{formatTimestamp(Number(document.registeredAt))}</span>
                  </div>
                  {document.expiresAt ? (
                    <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                      <span className="text-xs text-slate-400">Expiry Date</span>
                      <span className="text-xs font-semibold text-slate-200">{formatTimestamp(Number(document.expiresAt))}</span>
                    </div>
                  ) : null}
                </div>

                {/* Status Specific Details */}
                {status === "revoked" && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-red-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <ShieldAlert className="h-3 w-3" /> Revocation Event
                      </span>
                      <span className="text-xs text-red-300 font-medium">
                        {formatTimestamp(Number(document.revokedAt || document.registeredAt))}
                      </span>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 text-xs text-red-200/70 italic leading-relaxed">
                      Reason: {document.revocationReason || "Administrative invalidation."}
                    </div>
                  </div>
                )}

                {status === "superseded" && document.supersededByHash && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-sky-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <History className="h-3 w-3" /> Replaced By
                      </span>
                    </div>
                    <div className="bg-sky-500/5 border border-sky-500/10 rounded-lg p-3">
                      <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">New Version Hash</p>
                      <p className="text-[10px] font-mono text-sky-300/80 break-all">{document.supersededByHash}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* External Links */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 h-10 p-0"
                  asChild
                >
                  <a href={`${EXPLORER_URL}/address/${document.issuer}`} target="_blank" rel="noopener noreferrer">
                    <ShieldCheck className="h-4 w-4 mr-2 text-emerald-400" />
                    Issuer Info
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 h-10 p-0"
                  asChild
                >
                  <a href={`https://gateway.pinata.cloud/ipfs/${document.cid}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2 text-sky-400" />
                    Raw IPFS
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Not Found / Error State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-6 border border-slate-700">
              <HashIcon className="h-10 w-10 text-slate-600" />
            </div>
            <h4 className="text-xl font-bold text-slate-300 mb-2">No Matching Record Found</h4>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              This hash does not exist in the Trustify Registry. This could mean the document was never registered, or you are verifying an older version that hasn't been linked.
            </p>
            
            {hash && (
              <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-xl p-4 mb-8">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-600 mb-2">Input Hash</p>
                <code className="text-[11px] font-mono text-slate-500 break-all">{hash}</code>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">T{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Secured by <span className="text-slate-300">Trustify Protocol</span> v1.0.0
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-slate-100"
              onClick={() => window.location.reload()}
            >
              Verify Another
            </Button>
            {document?.txHash && (
              <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6" asChild>
                <a href={`${EXPLORER_URL}/tx/${document.txHash}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Blockchain Receipt
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

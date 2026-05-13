"use client";

import { CheckCircle, AlertCircle, Clock, ArrowRight, X } from "lucide-react";
import type { VerificationResult } from "@trustify/config";
import { formatAddress, formatHash, formatTimestamp } from "../../lib/formatters";

type Props = {
  result: VerificationResult | null;
  hash?: string | null;
};

export function VerificationResultCard({ result, hash }: Props) {
  if (!result) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-900/50 p-8 text-center">
        <p className="text-slate-400">Upload a file to begin verification.</p>
      </section>
    );
  }

  const { status, document } = result;

  // Get icon and color based on status
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle,
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-300",
          label: "Authentic",
        };
      case "revoked":
        return {
          icon: X,
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-300",
          label: "Revoked",
        };
      case "expired":
        return {
          icon: Clock,
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-300",
          label: "Expired",
        };
      case "superseded":
        return {
          icon: ArrowRight,
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-300",
          label: "Superseded",
        };
      default:
        return {
          icon: AlertCircle,
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-300",
          label: "Not Found",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  // Get appropriate message based on status
  const getStatusMessage = () => {
    switch (status) {
      case "active":
        return "Document is authentic and has not been revoked";
      case "revoked":
        return "Document has been revoked by the issuer";
      case "expired":
        return "Document has expired";
      case "superseded":
        return "Document has been superseded by a newer version";
      case "not_found":
        return "Document not found in registry";
      case "tampered":
        return "Document appears to have been tampered with";
      default:
        return "Unable to verify document";
    }
  };

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-8`}>
      {/* Status header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-800">
          <Icon className={`h-7 w-7 ${config.text}`} />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${config.text}`}>{config.label}</h3>
          <p className="text-sm text-slate-400">{getStatusMessage()}</p>
        </div>
      </div>

      {/* Document details */}
      {document && status === "active" && (
        <div className="space-y-6 border-t border-slate-700 pt-6">
          {/* Hash section */}
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-300">Document Hash (SHA-256)</p>
            <div className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 font-mono text-sm text-slate-300">
              <span>{formatHash(hash || "", 20)}</span>
              <button
                onClick={() => navigator.clipboard.writeText(hash || "")}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Issuer info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-300">Issued By</p>
              <p className="font-mono text-sm text-slate-400">{formatAddress(document.issuer)}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-300">Sector</p>
              <p className="text-sm capitalize text-slate-300">{document.sector}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-300">Issued Date</p>
              <p className="text-sm text-slate-400">{formatTimestamp(Number(document.registeredAt))}</p>
            </div>
            {document.expiresAt && (
              <div>
                <p className="mb-1 text-sm font-semibold text-slate-300">Expires</p>
                <p className="text-sm text-slate-400">{formatTimestamp(Number(document.expiresAt))}</p>
              </div>
            )}
          </div>

          {/* Holder info */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Document Information</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">Type:</p>
                <p className="font-medium text-slate-200">{document.documentType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Holder Name:</p>
                <p className="font-medium text-slate-200">{document.holderName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Holder ID:</p>
                <p className="font-mono text-sm text-slate-400">{document.holderId}</p>
              </div>
            </div>
          </div>

          {/* IPFS Link */}
          {document.cid && (
            <div>
              <a
                href={`https://gateway.pinata.cloud/ipfs/${document.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all hover:border-blue-500/50 hover:bg-blue-500/20"
              >
                <span>📦</span>View on IPFS
              </a>
            </div>
          )}

          {/* Blockchain proof */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Blockchain Proof</p>
            <p className="mb-3 text-xs text-slate-400">
              This document is permanently recorded on Polygon Amoy testnet. Verify independently on Polygonscan.
            </p>
            <a
              href={`https://amoy.polygonscan.com/tx/${document.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-all hover:text-blue-300"
            >
              View on Polygonscan →
            </a>
          </div>
        </div>
      )}

      {/* Revocation details */}
      {document && status === "revoked" && (
        <div className="space-y-4 border-t border-slate-700 pt-6">
          <div>
            <p className="mb-1 text-sm font-semibold text-slate-300">Revoked At</p>
            <p className="text-sm text-slate-400">{formatTimestamp(Number(document.registeredAt))}</p>
          </div>
          {document.revocationReason && (
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-300">Reason</p>
              <p className="text-sm text-slate-400">{document.revocationReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Try again */}
      <div className="mt-6 border-t border-slate-700 pt-6">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-slate-800 px-6 py-2 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700"
        >
          Verify another document
        </button>
      </div>
    </div>
  );
}

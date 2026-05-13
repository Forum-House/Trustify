"use client";

import { useState } from "react";
import { computeDocumentHash } from "../../../hooks/use-document-hash";
import { VerifyDropzone } from "../../../components/verification/verify-dropzone";
import { VerificationResultCard } from "../../../components/verification/verification-result-card";
import { useVerifyDocument } from "@trustify/web3";
import type { VerificationResult } from "@trustify/config";
import { AlertCircle, ShieldCheck, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert";

export default function VerifyPage() {
  const { verifyDocument, isPending, error } = useVerifyDocument();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const handleFile = async (file: File) => {
    try {
      const computed = await computeDocumentHash(file);
      setHash(computed);
      const verified = await verifyDocument(computed);
      setResult(verified);
    } catch (err) {
      console.error("Verification sequence failed:", err);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <main className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-sky-400" />
            </div>
            <span className="text-sky-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Trustify Identity Verification
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Verify Any Document <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Instantly</span>.
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Upload your credential to compute its cryptographic fingerpint. We cross-reference it against our <span className="text-slate-200">on-chain registry</span> to ensure authenticity without exposing private data.
          </p>
        </div>

        {/* Verification Area */}
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
          <div className="space-y-8">
            <VerifyDropzone onFileSelected={handleFile} disabled={isPending} />
            
            {error && (
              <Alert variant="destructive" className="bg-red-500/5 border-red-500/20 text-red-400 rounded-2xl">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-bold">System Error</AlertTitle>
                <AlertDescription className="text-sm opacity-80">
                  {error}. Please check your connection and try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Verification Stats / Info */}
            {!result && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Search, label: "Local Hashing", desc: "SHA-256 computed in browser" },
                  { icon: ShieldCheck, label: "On-Chain Check", desc: "Registry lookup via Polygon" },
                  { icon: AlertCircle, label: "State Validation", desc: "Status & Expiry verification" },
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-800/50 bg-slate-900/20">
                    <item.icon className="h-5 w-5 text-slate-500 mb-3" />
                    <p className="text-xs font-bold text-slate-200 mb-1">{item.label}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="sticky top-24">
            <VerificationResultCard result={result} hash={hash} />
          </aside>
        </div>
      </main>
    </div>
  );
}

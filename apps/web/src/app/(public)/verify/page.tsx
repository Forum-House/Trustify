"use client";

import { useState } from "react";
import { computeDocumentHash } from "../../../hooks/use-document-hash";
import { VerifyDropzone } from "../../../components/verification/verify-dropzone";
import { VerificationResultCard } from "../../../components/verification/verification-result-card";
import { useVerifyDocument } from "@trustify/web3";
import type { VerificationResult } from "@trustify/config";

export default function VerifyPage() {
  const { verifyDocument, isPending, error } = useVerifyDocument();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const handleFile = async (file: File) => {
    const computed = await computeDocumentHash(file);
    setHash(computed);
    const verified = await verifyDocument(computed);
    setResult(verified);
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 pb-16">
      <section className="mb-7">
        <p className="text-blue-300 font-bold uppercase tracking-wide text-sm">Public Verification</p>
        <h1 className="mt-2 mb-3 text-5xl font-bold leading-tight">Verify any document without a wallet.</h1>
        <p className="max-w-2xl text-slate-300 text-lg">
          Trustify computes the SHA-256 hash locally, checks the on-chain registry, and returns the current document status.
        </p>
      </section>

      <div className="grid gap-5">
        <VerifyDropzone onFileSelected={handleFile} disabled={isPending} />
        <VerificationResultCard result={result} hash={hash} />
        {error && <p className="text-red-300 text-sm">{error}</p>}
      </div>
    </main>
  );
}

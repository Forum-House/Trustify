"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { RegisterDocumentWizard } from "../../../components/issuer/register-document-wizard";
import { IssuerDocumentsTable } from "../../../components/issuer/issuer-documents-table";
import { RevokeDocumentForm } from "../../../components/issuer/revoke-document-form";
import { SupersedeDocumentForm } from "../../../components/issuer/supersede-document-form";
import { useIssuerDocuments } from "@trustify/web3";
import { contractAbis, contractAddresses } from "@trustify/web3/src/contracts";
import { createPublicViemClient } from "@trustify/web3/src/client";
import type { DocumentRecord } from "@trustify/config";

function IssuerDocumentsSection() {
  const { address } = useAccount();
  const { data: hashes } = useIssuerDocuments(address);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hashes || hashes.length === 0) return;
    setLoading(true);
    const client = createPublicViemClient();
    Promise.all(
      hashes.map((hash) =>
        client.readContract({
          address: contractAddresses.registry,
          abi: contractAbis.TrustifyRegistryAbi,
          functionName: "getDocument",
          args: [hash],
        })
      )
    )
      .then((results) =>
        setDocuments(
          results.map((r: any) => ({
            hash: r.hash,
            cid: r.cid,
            holderName: r.holderName,
            holderId: r.holderId,
            documentType: r.documentType,
            sector: r.sector?.toString() ?? "0",
            issuedAt: Number(r.issuedAt),
            expiresAt: Number(r.expiresAt),
            registeredAt: Number(r.registeredAt),
            issuer: r.issuer,
            status: r.revoked ? "revoked" : r.supersededBy !== "0x0000000000000000000000000000000000000000000000000000000000000000" ? "superseded" : "active",
          }))
        )
      )
      .finally(() => setLoading(false));
  }, [hashes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2" />
        Loading documents...
      </div>
    );
  }

  return <IssuerDocumentsTable documents={documents} />;
}

export default function IssuerDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Issuer Dashboard</h1>
          <p className="text-slate-400">Register new documents, manage existing records, or revoke and supersede documents you&apos;ve issued.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
              <h2 className="mb-6 text-xl font-bold text-white">Register Document</h2>
              <RegisterDocumentWizard />
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
              <h2 className="mb-6 text-xl font-bold text-white">Revoke Document</h2>
              <RevokeDocumentForm />
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
              <h2 className="mb-6 text-xl font-bold text-white">Supersede Document</h2>
              <SupersedeDocumentForm />
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-6 lg:col-span-2">
            <h2 className="mb-6 text-xl font-bold text-white">Your Documents</h2>
            <div className="overflow-x-auto">
              <IssuerDocumentsSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

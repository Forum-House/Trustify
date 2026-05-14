"use client";

import { useAccount } from "wagmi";
import { IssuerDocumentsTable } from "../../../../components/issuer/issuer-documents-table";
import { useIssuerFullDocuments } from "@trustify/web3";
import { Loader2, AlertCircle } from "lucide-react";

export default function IssuerDocumentsPage() {
  const { address } = useAccount();
  const { data: documents, isLoading, error } = useIssuerFullDocuments(address);

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">My Documents</h1>
        <p className="text-slate-400">View and manage all documents you have registered on Trustify.</p>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            <p className="text-sm font-medium animate-pulse">Fetching document registry...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400 gap-4">
            <AlertCircle className="h-10 w-10" />
            <p className="font-bold text-center">Failed to fetch documents.<br/><span className="text-sm font-normal opacity-70">Please check your network connection.</span></p>
          </div>
        ) : (
          <IssuerDocumentsTable documents={documents || []} />
        )}
      </div>
    </main>
  );
}

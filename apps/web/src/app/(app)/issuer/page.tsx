"use client";

import { useAccount } from "wagmi";
import { RegisterDocumentWizard } from "../../../components/issuer/register-document-wizard";
import { IssuerDocumentsTable } from "../../../components/issuer/issuer-documents-table";
import { RevokeDocumentForm } from "../../../components/issuer/revoke-document-form";
import { SupersedeDocumentForm } from "../../../components/issuer/supersede-document-form";
import { useIssuerFullDocuments } from "@trustify/web3";
import { ShieldCheck, FilePlus, History, Settings2, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

function IssuerDocumentsSection() {
  const { address } = useAccount();
  const { data: documents, isLoading, error } = useIssuerFullDocuments(address);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
        <p className="text-sm font-medium animate-pulse">Synchronizing document registry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-400 gap-4 border border-red-500/10 rounded-3xl bg-red-500/5">
        <AlertCircle className="h-10 w-10" />
        <div className="text-center">
          <p className="font-bold">Registry Sync Failed</p>
          <p className="text-xs opacity-70 max-w-xs mx-auto mt-1">We couldn't fetch your document records. Please check your network connection.</p>
        </div>
      </div>
    );
  }

  return <IssuerDocumentsTable documents={documents || []} />;
}

export default function IssuerDashboardPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-sky-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-sky-400" />
              </div>
              <span className="text-sky-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Authorized Issuer Portal
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Issuer Control <span className="text-slate-500">Center</span>
            </h1>
            <p className="text-slate-400 max-w-2xl leading-relaxed">
              Manage your cryptographic document registry. Issue new credentials, revoke compromised records, or supersede outdated versions with full blockchain finality.
            </p>
          </div>
        </div>

        <Tabs defaultValue="inventory" className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-1">
            <TabsList className="bg-transparent border-none p-0 h-auto gap-8">
              <TabsTrigger 
                value="inventory" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 font-bold tracking-tight transition-all"
              >
                <History className="h-4 w-4 mr-2" />
                Document Inventory
              </TabsTrigger>
              <TabsTrigger 
                value="issue" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 font-bold tracking-tight transition-all"
              >
                <FilePlus className="h-4 w-4 mr-2" />
                Issue New
              </TabsTrigger>
              <TabsTrigger 
                value="lifecycle" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-sky-500 rounded-none px-0 pb-3 text-slate-500 font-bold tracking-tight transition-all"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Lifecycle Management
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="inventory" className="mt-0 focus-visible:outline-none">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white">Registry Records</h2>
                  <p className="text-xs text-slate-500 mt-1">Complete list of all documents issued by this wallet.</p>
                </div>
              </div>
              <IssuerDocumentsSection />
            </div>
          </TabsContent>

          <TabsContent value="issue" className="mt-0 focus-visible:outline-none">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl p-8">
                <RegisterDocumentWizard />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifecycle" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-rose-500" />
                    Revocation Authority
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Permanently invalidate a document due to error or theft.</p>
                </div>
                <RevokeDocumentForm />
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-xl p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-sky-500" />
                    Supersede Records
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Link an old document to a new, updated version.</p>
                </div>
                <SupersedeDocumentForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

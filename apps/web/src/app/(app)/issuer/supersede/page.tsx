import { SupersedeDocumentForm } from "../../../../components/issuer/supersede-document-form";

export default function IssuerSupersedePage() {
  return (
    <main className="p-6 md:p-10 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Supersede Document</h1>
        <p className="text-slate-400">Replace an old document with a new, updated version.</p>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <SupersedeDocumentForm />
      </div>
    </main>
  );
}

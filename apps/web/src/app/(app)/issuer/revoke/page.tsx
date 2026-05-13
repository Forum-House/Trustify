import { RevokeDocumentForm } from "../../../../components/issuer/revoke-document-form";

export default function IssuerRevokePage() {
  return (
    <main className="p-6 md:p-10 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Revoke Document</h1>
        <p className="text-slate-400">Permanently invalidate a document if it was issued in error or compromised.</p>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <RevokeDocumentForm />
      </div>
    </main>
  );
}

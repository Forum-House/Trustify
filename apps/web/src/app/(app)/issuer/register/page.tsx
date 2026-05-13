import { RegisterDocumentWizard } from "../../../../components/issuer/register-document-wizard";

export default function IssuerRegisterPage() {
  return (
    <main className="p-6 md:p-10 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Register Document</h1>
        <p className="text-slate-400">Issue a new credential and permanently record its hash on-chain.</p>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <RegisterDocumentWizard />
      </div>
    </main>
  );
}

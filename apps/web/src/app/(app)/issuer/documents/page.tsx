import { IssuerDocumentsTable } from "../../../../components/issuer/issuer-documents-table";

export default function IssuerDocumentsPage() {
  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">My Documents</h1>
        <p className="text-slate-400">View and manage all documents you have registered on Trustify.</p>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <IssuerDocumentsTable />
      </div>
    </main>
  );
}

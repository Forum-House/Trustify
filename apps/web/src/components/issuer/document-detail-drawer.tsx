"use client";

import type { DocumentRecord } from "@trustify/config";

export function DocumentDetailDrawer({ document }: { document?: DocumentRecord | null }) {
  if (!document) return null;
  return (
    <aside className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4">
      <h3 className="text-lg font-semibold">Document Detail</h3>
      <div className="mt-2 grid gap-2 text-slate-300">
        <div>
          <span className="text-sm text-slate-400">Holder: </span>
          <span className="font-medium">{document.holderName}</span>
        </div>
        <div>
          <span className="text-sm text-slate-400">ID: </span>
          <span className="font-medium">{document.holderId}</span>
        </div>
        <div>
          <span className="text-sm text-slate-400">Type: </span>
          <span className="font-medium">{document.documentType}</span>
        </div>
        <div>
          <span className="text-sm text-slate-400">Sector: </span>
          <span className="font-medium">{document.sector}</span>
        </div>
        <div>
          <span className="text-sm text-slate-400">Status: </span>
          <span className="font-medium">{document.status}</span>
        </div>
        <div className="wrap-break-word">
          <span className="text-sm text-slate-400">Hash: </span>
          <span className="font-mono text-xs text-slate-300">{document.hash}</span>
        </div>
      </div>
    </aside>
  );
}

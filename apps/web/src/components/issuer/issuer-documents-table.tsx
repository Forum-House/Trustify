"use client";

import { useState } from "react";
import type { DocumentRecord } from "@trustify/config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocumentDetailDrawer } from "./document-detail-drawer";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  revoked: "bg-red-500/15 text-red-400 border-red-500/30",
  superseded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  expired: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const SECTOR_LABELS: Record<string, string> = {
  "0": "Education",
  "1": "Healthcare",
  "2": "Legal",
  "3": "Government",
  "4": "Corporate",
};

export function IssuerDocumentsTable({ documents = [] }: { documents?: DocumentRecord[] }) {
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (doc: DocumentRecord) => {
    setSelected(doc);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <section className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden shadow-2xl shadow-black/20">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Holder Name</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Credential Type</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Sector</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Issued Date</TableHead>
                <TableHead className="text-slate-500 font-bold uppercase text-[10px] tracking-widest px-6 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-medium">No documents found</p>
                      <p className="text-xs text-slate-600">Register your first document to see it here.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow
                    key={doc.hash}
                    className="group border-slate-800/60 hover:bg-slate-900/40 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(doc)}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-semibold">{doc.holderName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {doc.holderId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-300 font-medium">{doc.documentType}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
                        {SECTOR_LABELS[doc.sector] ?? doc.sector}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-slate-400 text-sm font-medium">
                      {doc.issuedAt ? new Date(Number(doc.issuedAt) * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge className={cn("capitalize border", STATUS_CLASS[doc.status] ?? "")}>{doc.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-800/60">
          {documents.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-sm font-medium">No documents found</p>
            </div>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.hash}
                className="w-full p-5 text-left hover:bg-slate-900/40 transition-colors active:bg-slate-900"
                onClick={() => handleRowClick(doc)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-200 truncate">{doc.holderName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{doc.documentType}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                        {SECTOR_LABELS[doc.sector] ?? doc.sector}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {doc.issuedAt ? new Date(Number(doc.issuedAt) * 1000).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                  <Badge className={cn("capitalize text-[10px] border", STATUS_CLASS[doc.status] ?? "")}>{doc.status}</Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      <DocumentDetailDrawer 
        document={selected} 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
    </>
  );
}


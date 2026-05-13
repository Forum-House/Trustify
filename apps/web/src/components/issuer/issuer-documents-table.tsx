"use client";

import { useState } from "react";
import type { DocumentRecord } from "@trustify/config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  active: "default",
  revoked: "destructive",
  superseded: "secondary",
  expired: "outline",
};

const STATUS_CLASS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  revoked: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  superseded: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  expired: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
};

const SECTOR_LABELS: Record<string, string> = {
  "0": "Education",
  "1": "Healthcare",
  "2": "Legal",
  "3": "Government",
  "4": "Corporate",
};

const EXPLORER =
  process.env.NEXT_PUBLIC_CHAIN_KEY === "polygon"
    ? "https://polygonscan.com"
    : "https://amoy.polygonscan.com";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <span className="text-sm text-slate-400 col-span-1">{label}</span>
      <span className="text-sm text-slate-100 col-span-2 break-all font-mono">{value}</span>
    </div>
  );
}

function DocumentSheet({ doc, open, onClose }: { doc: DocumentRecord | null; open: boolean; onClose: () => void }) {
  if (!doc) return null;
  const sectorLabel = SECTOR_LABELS[doc.sector] ?? doc.sector;
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="bg-slate-900 border-slate-700 text-slate-100 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-slate-100">Document Detail</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-1 divide-y divide-slate-700/50">
          <DetailRow label="Holder" value={doc.holderName} />
          <DetailRow label="Holder ID" value={doc.holderId} />
          <DetailRow label="Type" value={doc.documentType} />
          <DetailRow label="Sector" value={sectorLabel} />
          <DetailRow label="Issued" value={doc.issuedAt ? new Date(Number(doc.issuedAt) * 1000).toLocaleDateString() : "—"} />
          <DetailRow label="Expires" value={doc.expiresAt ? new Date(Number(doc.expiresAt) * 1000).toLocaleDateString() : "Never"} />
          <DetailRow
            label="Status"
            value={
              <Badge className={STATUS_CLASS[doc.status] ?? ""}>
                {doc.status}
              </Badge>
            }
          />
          <div className="py-2">
            <p className="text-sm text-slate-400 mb-1">Hash</p>
            <p className="font-mono text-xs text-sky-300 break-all">{doc.hash}</p>
          </div>
          {doc.cid && (
            <div className="py-2">
              <p className="text-sm text-slate-400 mb-1">IPFS</p>
              <a
                href={`https://ipfs.io/ipfs/${doc.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 underline"
              >
                {doc.cid.slice(0, 24)}… <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function IssuerDocumentsTable({ documents = [] }: { documents?: DocumentRecord[] }) {
  const [selected, setSelected] = useState<DocumentRecord | null>(null);

  return (
    <>
      <section className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700/60 hover:bg-transparent">
                <TableHead className="text-slate-400">Holder</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Sector</TableHead>
                <TableHead className="text-slate-400">Issued</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                    No documents registered yet.
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((doc) => (
                  <TableRow
                    key={doc.hash}
                    className="border-slate-700/40 hover:bg-slate-800/40 cursor-pointer"
                    onClick={() => setSelected(doc)}
                  >
                    <TableCell className="text-slate-200 font-medium">{doc.holderName}</TableCell>
                    <TableCell className="text-slate-300">{doc.documentType}</TableCell>
                    <TableCell className="text-slate-300">{SECTOR_LABELS[doc.sector] ?? doc.sector}</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {doc.issuedAt ? new Date(Number(doc.issuedAt) * 1000).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_CLASS[doc.status] ?? ""}>{doc.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-700/40">
          {documents.length === 0 ? (
            <p className="p-6 text-center text-slate-500 text-sm">No documents registered yet.</p>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.hash}
                className="w-full p-4 text-left hover:bg-slate-800/40 transition-colors"
                onClick={() => setSelected(doc)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{doc.holderName}</p>
                    <p className="text-xs text-slate-400">{doc.documentType} · {SECTOR_LABELS[doc.sector] ?? doc.sector}</p>
                  </div>
                  <Badge className={`${STATUS_CLASS[doc.status] ?? ""} flex-shrink-0`}>{doc.status}</Badge>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Detail Sheet (3.5) */}
      <DocumentSheet doc={selected} open={!!selected} onClose={() => setSelected(null)} />
    </>
  );
}

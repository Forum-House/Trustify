"use client";

import { useState, useEffect } from "react";
import type { IssuerProfile } from "@trustify/config";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAllIssuers } from "@trustify/web3";

const STATUS_VARIANT: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
  approved: "default",
  revoked: "destructive",
};

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function IssuersTable({ issuers: initialIssuers }: { issuers?: IssuerProfile[] }) {
  const { loadIssuers } = useAllIssuers();
  const [issuers, setIssuers] = useState<IssuerProfile[]>(initialIssuers ?? []);
  const [loading, setLoading] = useState(!initialIssuers);

  useEffect(() => {
    if (initialIssuers) return;
    loadIssuers()
      .then(setIssuers)
      .finally(() => setLoading(false));
  }, [initialIssuers, loadIssuers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-slate-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2" />
        Loading issuers...
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/60 hover:bg-transparent">
              <TableHead className="text-slate-400">Wallet</TableHead>
              <TableHead className="text-slate-400">Name</TableHead>
              <TableHead className="text-slate-400">Sector</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issuers.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                  No issuers on-chain yet.
                </TableCell>
              </TableRow>
            ) : (
              issuers.map((issuer) => (
                <TableRow key={issuer.walletAddress} className="border-slate-700/40 hover:bg-slate-800/40">
                  <TableCell className="font-mono text-xs text-slate-300" title={issuer.walletAddress}>
                    {truncateAddress(issuer.walletAddress)}
                  </TableCell>
                  <TableCell className="text-slate-200">{issuer.name || <span className="text-slate-500 italic">Unknown</span>}</TableCell>
                  <TableCell className="capitalize text-slate-300">{issuer.sector}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[issuer.status] ?? "secondary"} className="capitalize">
                      {issuer.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-700/40">
        {issuers.length === 0 ? (
          <p className="p-6 text-center text-slate-500 text-sm">No issuers on-chain yet.</p>
        ) : (
          issuers.map((issuer) => (
            <div key={issuer.walletAddress} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{issuer.name || <span className="italic text-slate-500">Unknown</span>}</p>
                  <p className="text-xs text-slate-400 capitalize">{issuer.sector}</p>
                  <p className="mt-1 font-mono text-xs text-slate-500">{truncateAddress(issuer.walletAddress)}</p>
                </div>
                <Badge variant={STATUS_VARIANT[issuer.status] ?? "secondary"} className="capitalize flex-shrink-0">
                  {issuer.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

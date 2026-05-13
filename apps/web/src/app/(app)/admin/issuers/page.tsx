"use client";

import { useEffect, useState } from "react";
import { ApproveIssuerForm } from "../../../../components/admin/approve-issuer-form";
import { RevokeIssuerModal } from "../../../../components/admin/revoke-issuer-modal";
import { IssuersTable } from "../../../../components/admin/issuers-table";
import { useAllIssuers } from "@trustify/web3";
import type { IssuerProfile } from "@trustify/config";

export default function AdminIssuersPage() {
  const { loadIssuers } = useAllIssuers();
  const [issuers, setIssuers] = useState<IssuerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssuers()
      .then(setIssuers)
      .finally(() => setLoading(false));
  }, [loadIssuers]);

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Issuer Management</h1>
        <p className="text-slate-400">Approve new issuers or revoke access for existing ones.</p>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <ApproveIssuerForm />
        <RevokeIssuerModal />
      </div>
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-slate-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2" />
            Loading issuers...
          </div>
        ) : (
          <IssuersTable issuers={issuers} />
        )}
      </div>
    </main>
  );
}

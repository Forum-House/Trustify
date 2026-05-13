"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, Trash2, Activity } from "lucide-react";
import { getActivityEvents } from "@trustify/web3";

type Stats = {
  docs: number;
  issuers: number;
  revoked: number;
  recent: number;
};

export function AdminKpiRow() {
  const [stats, setStats] = useState<Stats>({ docs: 0, issuers: 0, revoked: 0, recent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityEvents(0n)
      .then((events) => {
        const now = Date.now();
        const oneDayMs = 86_400_000;
        // Amoy ~2s/block → blocks in 24h ≈ 43200
        const recentBlockThreshold = BigInt(Math.floor(oneDayMs / 2000));
        const latestBlock = events.reduce((max, e) => (e.blockNumber > max ? e.blockNumber : max), 0n);
        const recentFromBlock = latestBlock > recentBlockThreshold ? latestBlock - recentBlockThreshold : 0n;

        setStats({
          docs: events.filter((e) => e.eventName === "DocumentRegistered").length,
          revoked: events.filter((e) => e.eventName === "DocumentRevoked").length,
          issuers: 0, // Requires AccessControl IssuerApproved events — wired in Phase 2.3
          recent: events.filter((e) => e.blockNumber >= recentFromBlock).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { label: "Total Documents", value: loading ? "…" : stats.docs.toString(), icon: BarChart3, color: "text-blue-400" },
    { label: "Active Issuers", value: loading ? "…" : stats.issuers.toString(), icon: Users, color: "text-green-400" },
    { label: "Revoked", value: loading ? "…" : stats.revoked.toString(), icon: Trash2, color: "text-orange-400" },
    { label: "24h Activity", value: loading ? "…" : stats.recent.toString(), icon: Activity, color: "text-purple-400" },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-slate-700"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
              <Icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className={`text-3xl font-bold ${loading ? "text-slate-500" : "text-slate-100"}`}>{item.value}</p>
          </div>
        );
      })}
    </section>
  );
}

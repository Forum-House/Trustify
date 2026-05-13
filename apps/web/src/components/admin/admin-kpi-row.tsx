"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, Trash2, Activity, Loader2 } from "lucide-react";
import { getActivityEvents, useRegistryStats, useAllIssuers } from "@trustify/web3";
import { cn } from "@/lib/utils";

type Stats = {
  revoked: number;
  recent: number;
};

export function AdminKpiRow() {
  const [extraStats, setExtraStats] = useState<Stats>({ revoked: 0, recent: 0 });
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  
  const { totalDocuments, isLoading: isStatsLoading } = useRegistryStats();
  const { loadIssuers } = useAllIssuers();
  const [issuerCount, setIssuerCount] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // Fetch issuers from DB/Events via hook
        const issuers = await loadIssuers();
        setIssuerCount(issuers.filter(i => i.status === "approved").length);

        // Fetch activity events for revoked count + 24h activity
        const events = await getActivityEvents();
        
        // Use a block-based 24h threshold (approx 5000 blocks on Polygon)
        const currentBlock = events.length > 0 ? events[0].blockNumber : 0n;
        const threshold = 5000n; 
        
        setExtraStats({
          revoked: events.filter((e) => e.eventName === "DocumentRevoked").length,
          recent: events.filter((e) => e.blockNumber >= (currentBlock - threshold)).length,
        });
      } catch (err) {
        console.error("AdminKpiRow load error:", err);
      } finally {
        setIsActivityLoading(false);
      }
    }

    load();
  }, [loadIssuers]);

  const items = [
    { 
      label: "Total Documents", 
      value: isStatsLoading ? null : (totalDocuments ? Number(totalDocuments).toLocaleString() : "0"), 
      icon: BarChart3, 
      color: "text-sky-400",
      bg: "from-sky-500/10 to-transparent" 
    },
    { 
      label: "Approved Issuers", 
      value: issuerCount === null ? null : issuerCount.toLocaleString(), 
      icon: Users, 
      color: "text-emerald-400",
      bg: "from-emerald-500/10 to-transparent" 
    },
    { 
      label: "Revoked Records", 
      value: isActivityLoading ? null : extraStats.revoked.toLocaleString(), 
      icon: Trash2, 
      color: "text-rose-400",
      bg: "from-rose-500/10 to-transparent" 
    },
    { 
      label: "24h Activity", 
      value: isActivityLoading ? null : extraStats.recent.toLocaleString(), 
      icon: Activity, 
      color: "text-amber-400",
      bg: "from-amber-500/10 to-transparent" 
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const isLoading = item.value === null;

        return (
          <div
            key={item.label}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-6 transition-all duration-300",
              "hover:border-slate-700 hover:shadow-xl hover:shadow-black/40 group"
            )}
          >
            {/* Subtle Gradient Background */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", item.bg)} />
            
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
                  {item.label}
                </p>
                <div className={cn("p-2 rounded-lg bg-slate-900 border border-slate-800", item.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 text-slate-700 animate-spin" />
                ) : (
                  <p className="text-3xl font-black text-white tracking-tight">
                    {item.value}
                  </p>
                )}
              </div>
              
              <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                <div className={cn("h-full w-1/3 rounded-full opacity-50", item.color.replace('text-', 'bg-'))} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}



"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, Trash2, RefreshCw, Loader2, ArrowUpRight, ShieldCheck, UserX } from "lucide-react";
import { getActivityEvents, type ActivityEvent } from "@trustify/web3";
import { EXPLORER_URL } from "../../lib/constants";
import { cn } from "@/lib/utils";

const EVENT_CONFIG: Record<ActivityEvent["eventName"], { label: string; icon: typeof FileText; color: string; bg: string; entity: string }> = {
  DocumentRegistered: { label: "Registered", icon: FileText, color: "text-sky-400", bg: "bg-sky-500/10", entity: "Document" },
  DocumentRevoked: { label: "Revoked", icon: Trash2, color: "text-rose-400", bg: "bg-rose-500/10", entity: "Document" },
  DocumentSuperseded: { label: "Superseded", icon: RefreshCw, color: "text-amber-400", bg: "bg-amber-500/10", entity: "Document" },
  IssuerApproved: { label: "Approved", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", entity: "Issuer" },
  IssuerRevoked: { label: "Revoked", icon: UserX, color: "text-rose-500", bg: "bg-rose-500/10", entity: "Issuer" },
};

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityEvents()
      .then(setEvents) // getActivityEvents already sorts newest first
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 flex flex-col h-full shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">On-Chain Activity</h2>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-12">
          <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
          <p className="text-xs font-medium">Syncing with blockchain...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-600 py-12 italic border border-dashed border-slate-800 rounded-xl">
          <p className="text-sm">No recent activity found</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event, idx) => {
            const config = EVENT_CONFIG[event.eventName];
            const Icon = config.icon;
            
            return (
              <div
                key={`${event.txHash}-${idx}`}
                className="group relative flex items-start gap-4 pb-1 transition-all"
              >
                {/* Timeline Line */}
                {idx !== events.length - 1 && (
                  <div className="absolute left-[17px] top-9 w-[2px] h-full bg-slate-800 group-hover:bg-slate-700 transition-colors" />
                )}

                {/* Icon Circle */}
                <div className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 transition-transform group-hover:scale-110 group-hover:border-slate-700",
                  config.bg,
                  config.color
                )}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100 truncate group-hover:text-white transition-colors">
                      {config.label} <span className="text-slate-500 font-normal">{config.entity}</span>
                    </p>
                    <a
                      href={`${EXPLORER_URL}/tx/${event.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 text-sky-400 hover:text-sky-300 transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                    >
                      View <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[10px] font-mono text-slate-500">
                      Block #{event.blockNumber.toString()}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-slate-700" />
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">
                      {event.txHash.slice(0, 10)}...
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {!loading && events.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
          <p className="text-[10px] text-slate-600 italic tracking-wider">Protocol Activity synchronized with blockchain</p>
        </div>
      )}
    </section>
  );
}


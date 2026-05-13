"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText, UserCheck, Trash2, RefreshCw } from "lucide-react";
import { getActivityEvents, type ActivityEvent } from "@trustify/web3";

const EVENT_CONFIG: Record<ActivityEvent["eventName"], { label: string; icon: typeof FileText; color: string }> = {
  DocumentRegistered: { label: "Document Registered", icon: FileText, color: "text-sky-400" },
  DocumentRevoked: { label: "Document Revoked", icon: Trash2, color: "text-orange-400" },
  DocumentSuperseded: { label: "Document Superseded", icon: RefreshCw, color: "text-purple-400" },
};

const EXPLORER =
  process.env.NEXT_PUBLIC_CHAIN_KEY === "polygon"
    ? "https://polygonscan.com"
    : "https://amoy.polygonscan.com";

function timeAgo(blockNumber: bigint): string {
  // Amoy averages ~2s per block — rough estimate
  return `Block #${blockNumber.toString()}`;
}

export function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityEvents(0n)
      .then((e) => setEvents(e.slice().reverse())) // newest first
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
      <h2 className="text-lg font-semibold mb-3 text-slate-100">Activity Feed</h2>
      {loading ? (
        <div className="flex items-center gap-2 py-6 text-slate-400 text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          Fetching on-chain events...
        </div>
      ) : events.length === 0 ? (
        <p className="py-4 text-sm text-slate-500">No on-chain activity yet.</p>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {events.map((event, idx) => {
            const config = EVENT_CONFIG[event.eventName];
            const Icon = config.icon;
            return (
              <div
                key={`${event.txHash}-${idx}`}
                className="flex items-center justify-between rounded-md bg-slate-800/60 px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className={`h-4 w-4 flex-shrink-0 ${config.color}`} />
                  <span className="text-sm text-slate-200 truncate">{config.label}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo(event.blockNumber)}</span>
                </div>
                <a
                  href={`${EXPLORER}/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 flex-shrink-0 text-sky-400 hover:text-sky-300 transition-colors"
                  title="View on Polygonscan"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-800 border-t-sky-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold tracking-tight text-white">Trustify</h2>
          <p className="text-sm font-medium text-slate-500">Loading experience...</p>
        </div>
      </div>
    </div>
  );
}

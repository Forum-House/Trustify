"use client";

/** Full-page loading skeleton shown while guards resolve on-chain roles */
export function GuardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/60 flex-col gap-3 p-4 animate-pulse">
        <div className="h-8 w-32 rounded-md bg-slate-800 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-full rounded-md bg-slate-800" />
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="h-16 border-b border-slate-800 bg-slate-950/80 flex items-center px-6 gap-4 animate-pulse">
          <div className="h-6 w-24 rounded bg-slate-800" />
          <div className="ml-auto flex gap-3">
            <div className="h-6 w-20 rounded-full bg-slate-800" />
            <div className="h-6 w-32 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="p-6 md:p-10 space-y-6 animate-pulse">
          <div className="h-8 w-64 rounded bg-slate-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-slate-900/50 border border-slate-800" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-slate-900/50 border border-slate-800" />
        </div>
      </div>
    </div>
  );
}

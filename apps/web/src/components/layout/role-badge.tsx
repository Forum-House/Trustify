"use client";

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 bg-slate-800/70 text-slate-300 border border-slate-700 text-xs uppercase tracking-wider">
      {role}
    </span>
  );
}

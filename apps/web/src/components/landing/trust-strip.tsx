"use client";

import { useEffect, useState } from "react";

interface KPIData {
  label: string;
  value: string;
  icon: string;
}

export function TrustStrip() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpis: KPIData[] = [
    {
      label: "Documents Registered",
      value: "1,247",
      icon: "📄",
    },
    {
      label: "Approved Issuers",
      value: "18",
      icon: "✅",
    },
    {
      label: "Documents Verified",
      value: "3,892",
      icon: "🔍",
    },
    {
      label: "On Polygon Amoy",
      value: "100%",
      icon: "🔗",
    },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <div className="text-3xl sm:text-4xl">{kpi.icon}</div>
              <div className={`text-2xl font-bold text-slate-100 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
                {kpi.value}
              </div>
              <div className="text-sm text-slate-400">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

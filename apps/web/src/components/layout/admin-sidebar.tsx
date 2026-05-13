"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ClipboardList, Settings, X } from "lucide-react";

type Props = {
  mobile?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ mobile, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-400" },
    { href: "/admin/issuers", label: "Manage Issuers", icon: Users, color: "text-emerald-400" },
    { href: "/admin/activity", label: "Activity Log", icon: ClipboardList, color: "text-purple-400" },
    { href: "/admin/settings", label: "Settings", icon: Settings, color: "text-orange-400" },
  ];

  // Desktop sidebar
  if (!mobile) {
    return (
      <aside className="w-56 border-r border-slate-800 bg-slate-900/40 p-4 hidden sm:block">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}>
                <Icon className={`w-5 h-5 ${link.color}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }

  // Mobile sidebar (slide-over)
  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="relative z-10 w-64 h-full border-r border-slate-800 bg-slate-900/95 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold text-slate-100">Admin</div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded hover:bg-slate-800/50"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-slate-800 text-slate-100"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}>
                <Icon className={`w-5 h-5 ${link.color}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

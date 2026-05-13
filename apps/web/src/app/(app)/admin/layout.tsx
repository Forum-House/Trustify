"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AdminGuard } from "../../../components/guards/admin-guard";
import { WalletGuard } from "../../../components/guards/wallet-guard";
import { NetworkGuard } from "../../../components/guards/network-guard";
import { NetworkBadge } from "../../../components/layout/network-badge";
import { WalletAddressChip } from "../../../components/wallet/wallet-address-chip";
import { ConnectWalletButton } from "../../../components/wallet/connect-wallet-button";
import { AdminSidebar } from "../../../components/layout/admin-sidebar";
import { Menu } from "lucide-react";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AdminGuard>
      <WalletGuard>
        <NetworkGuard>
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
            {/* Admin Header */}
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
              <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:bg-slate-800/50 sm:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                  {/* Logo and Admin Badge */}
                  <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 font-bold text-white">
                        T
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100">Trustify</div>
                        <div className="text-xs text-red-400 font-semibold">Admin Panel</div>
                      </div>
                    </Link>
                  </div>

                  {/* Right side controls */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <NetworkBadge />
                    <WalletAddressChip />
                    <ConnectWalletButton />
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      title="Exit admin panel"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Exit</span>
                    </Link>
                  </div>
                </div>
              </div>
            </header>

              {/* Mobile sidebar drawer (renders when mobileOpen=true) */}
              {mobileOpen && <AdminSidebar mobile onClose={() => setMobileOpen(false)} />}

              <div className="flex min-h-[calc(100vh-73px)]">
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">{children}</main>
              </div>
          </div>
        </NetworkGuard>
      </WalletGuard>
    </AdminGuard>
  );
}

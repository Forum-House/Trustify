"use client";

import Link from "next/link";
import { ConnectWalletButton } from "../wallet/connect-wallet-button";
import { WalletAddressChip } from "../wallet/wallet-address-chip";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white">
              T
            </div>
            <span className="text-lg font-bold text-slate-100">Trustify</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden gap-8 md:flex">
            <Link href="/how-it-works" className="text-sm font-medium text-slate-400 transition hover:text-slate-200">
              How it works
            </Link>
            <Link href="/sectors" className="text-sm font-medium text-slate-400 transition hover:text-slate-200">
              Use Cases
            </Link>
            <a href="#" className="text-sm font-medium text-slate-400 transition hover:text-slate-200">
              Docs
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/verify"
              className="hidden text-sm font-medium text-slate-300 transition hover:text-slate-100 sm:inline"
            >
              Verify
            </Link>
            <WalletAddressChip />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}

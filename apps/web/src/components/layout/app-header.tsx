"use client";

import Link from "next/link";
import { ConnectWalletButton } from "../wallet/connect-wallet-button";
import { WalletAddressChip } from "../wallet/wallet-address-chip";
import { NetworkBadge } from "./network-badge";

export function AppHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-white">
              T
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">Trustify</div>
              <div className="text-xs text-slate-500">Document trust</div>
            </div>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            <NetworkBadge />
            <WalletAddressChip />
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}

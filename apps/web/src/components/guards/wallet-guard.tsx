"use client";

import type { ReactNode } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ConnectWalletButton } from "../wallet/connect-wallet-button";

export function WalletGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl pt-10">
        <Card>
          <CardHeader>
            <CardTitle>Wallet connection required</CardTitle>
            <CardDescription>
              Connect your wallet to access protected admin and issuer routes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

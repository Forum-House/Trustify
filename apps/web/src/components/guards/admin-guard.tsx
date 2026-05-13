"use client";

import type { ReactNode } from "react";
import { UnauthorizedModal } from "../modals/unauthorized-modal";
import { useConnectedRole } from "@trustify/web3";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { role, isConnected, isLoading } = useConnectedRole();

  if (isLoading) {
    return null;
  }

  const isUnauthorized = isConnected && role !== "admin";

  if (isUnauthorized) {
    return <UnauthorizedModal open={true} />;
  }

  return <>{children}</>;
}

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { UnauthorizedModal } from "../modals/unauthorized-modal";
import { GuardLoadingSkeleton } from "../ui/loading-skeleton";
import { useConnectedRole } from "@trustify/web3";

export function AdminGuard({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <GuardLoadingSkeleton />;
  }

  return <AdminGuardContent>{children}</AdminGuardContent>;
}

function AdminGuardContent({ children }: { children: ReactNode }) {
  const { role, isConnected, isLoading } = useConnectedRole();

  if (isLoading) {
    return <GuardLoadingSkeleton />;
  }

  const isUnauthorized = isConnected && role !== "admin";

  if (isUnauthorized) {
    return <UnauthorizedModal open={true} />;
  }

  return <>{children}</>;
}

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { NotApprovedModal } from "../modals/not-approved-modal";
import { GuardLoadingSkeleton } from "../ui/loading-skeleton";
import { useConnectedRole } from "@trustify/web3";

export function IssuerGuard({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <GuardLoadingSkeleton />;
  }

  return <IssuerGuardContent>{children}</IssuerGuardContent>;
}

function IssuerGuardContent({ children }: { children: ReactNode }) {
  const { role, isConnected, isLoading } = useConnectedRole();

  if (isLoading) {
    return <GuardLoadingSkeleton />;
  }

  const isNotApproved = isConnected && role !== "issuer" && role !== "admin";

  if (isNotApproved) {
    return <NotApprovedModal open={true} />;
  }

  return <>{children}</>;
}

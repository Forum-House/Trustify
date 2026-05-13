"use client";

import type { ReactNode } from "react";
import { NotApprovedModal } from "../modals/not-approved-modal";
import { useConnectedRole } from "@trustify/web3";

export function IssuerGuard({ children }: { children: ReactNode }) {
  const { role, isConnected, isLoading } = useConnectedRole();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  const isNotApproved = isConnected && role !== "issuer" && role !== "admin";

  if (isNotApproved) {
    return <NotApprovedModal open={true} />;
  }

  return <>{children}</>;
}

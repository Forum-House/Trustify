import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

/**
 * App Layout - Base layout for authenticated routes
 * Role-specific layouts (admin, issuer, verifier) are handled separately
 * in their respective folders: /admin/layout.tsx, /issuer/layout.tsx, etc.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

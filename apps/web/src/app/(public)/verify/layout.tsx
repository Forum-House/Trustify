import type { ReactNode } from "react";
import { PublicHeader } from "../../../components/layout/public-header";
import { Footer } from "../../../components/landing/footer";

export default function VerifyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <PublicHeader />
      {children}
      <Footer />
    </div>
  );
}

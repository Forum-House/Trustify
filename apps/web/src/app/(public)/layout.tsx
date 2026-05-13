import type { ReactNode } from "react";
import { Footer } from "../../components/landing/footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {children}
      <Footer />
    </div>
  );
}

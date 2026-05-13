import { PublicHeader } from "@/components/layout/public-header";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustStrip } from "@/components/landing/trust-strip";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SectorsGrid } from "@/components/landing/sectors-grid";
import { RoleEntry } from "@/components/landing/role-entry";
import { FeaturesSection } from "@/components/landing/features";
import { CTASection } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="bg-slate-950">
      <PublicHeader />
      <HeroSection />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorks />
      <SectorsGrid />
      <RoleEntry />
      <CTASection />
      <Footer />
    </div>
  );
}

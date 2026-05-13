import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-2xl" />

          <div className="relative bg-slate-900/50 backdrop-blur border border-blue-500/20 rounded-2xl p-8 sm:p-12 text-center">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-200">Limited Time Hackathon Release</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Ready to Transform Document Verification?
            </h2>

            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the Trustify revolution. Whether you're an issuer registering documents or a verifier checking authenticity, the future of document trust starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/verify">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 rounded-lg px-8 py-6 text-lg font-bold">
                  Start Verifying Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/issuer">
                <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-white rounded-lg px-8 py-6 text-lg font-bold">
                  Become an Issuer
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-400 mt-8">
              No setup required. Start verifying documents in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

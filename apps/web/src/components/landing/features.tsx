import { CheckCircle, Lock, Zap, Users, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Tamper-Proof Records",
    description: "SHA-256 hashes anchored immutably on blockchain. Even a single pixel change invalidates the document.",
  },
  {
    icon: Zap,
    title: "Instant Verification",
    description: "Zero-friction verification in under 3 seconds. No forms, no accounts, no blockchain knowledge needed.",
  },
  {
    icon: Users,
    title: "Role-Based Control",
    description: "Admins approve issuers, issuers register documents, verifiers confirm authenticity instantly.",
  },
  {
    icon: Shield,
    title: "Zero Server Dependency",
    description: "All verification runs on-chain. Even if Trustify goes offline, proof remains immutable and publicly auditable.",
  },
  {
    icon: Globe,
    title: "Decentralized Storage",
    description: "IPFS via Pinata ensures documents persist across a global network. No single point of failure.",
  },
  {
    icon: CheckCircle,
    title: "Privacy Preserved",
    description: "Only cryptographic hashes and metadata go on-chain. Document content stays with the issuer unless shared.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Why Choose Trustify?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Six core capabilities that solve the document verification problem once and for all.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="relative">
                  <Icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

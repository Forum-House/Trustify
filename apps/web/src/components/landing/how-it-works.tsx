import { CheckCircle, FileUp, Search, Shield } from "lucide-react";

const journeys = [
  {
    icon: FileUp,
    title: "Issuers Register Documents",
    steps: [
      "Upload the original document (PDF, image, etc.)",
      "Enter structured metadata (holder name, issue date, expiry)",
      "Compute SHA-256 hash client-side (no server involvement)",
      "Upload file to IPFS via Pinata",
      "Sign transaction and anchor hash + CID on blockchain",
      "Document is now publicly verifiable forever",
    ],
  },
  {
    icon: Search,
    title: "Verifiers Check Authenticity",
    steps: [
      "No account or wallet needed",
      "Drag & drop the document to verify",
      "Hash is computed in the browser",
      "Contract is queried (read-only, no gas)",
      "Result appears in 1–3 seconds",
      "See issuer details, timestamps, and blockchain proof",
    ],
  },
  {
    icon: Shield,
    title: "Admins Govern the Registry",
    steps: [
      "Connect wallet (must hold DEFAULT_ADMIN_ROLE)",
      "View global KPIs and recent activity",
      "Approve new issuers by wallet address",
      "Revoke issuers if needed (transaction required)",
      "Monitor all contract events on-chain",
      "Every action is immutably logged on blockchain",
    ],
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
            How It Works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three core journeys powering the Trustify ecosystem.
          </p>
        </div>

        {/* Journeys */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {journeys.map((journey) => {
            const Icon = journey.icon;
            return (
              <div key={journey.title} className="space-y-4">
                {/* Journey header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{journey.title}</h3>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {journey.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500/50">
                          <span className="text-xs font-bold text-blue-300">{idx + 1}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-300">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture insight */}
        <div className="mt-16 pt-16 border-t border-slate-700">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-700/50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              Zero Single Points of Failure
            </h3>
            <p className="text-slate-400 mb-4">
              The verification path is entirely decentralized. No Trustify server is required to verify a document. As long as a public Polygon Amoy RPC endpoint is available, verification works. IPFS content is replicated across Pinata's infrastructure. Every action is immutably logged on the blockchain.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-300">Decentralized Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-300">On-Chain Records</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-300">Public Audit Trail</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-slate-300">No Backend Dependency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

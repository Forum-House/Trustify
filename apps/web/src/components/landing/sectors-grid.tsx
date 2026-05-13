export function SectorsGrid() {
  const sectors = [
    {
      icon: "🎓",
      name: "Education",
      description: "Universities register degree certificates and transcripts to prevent credential fraud.",
      benefits: ["Instant degree verification", "Prevent resume fraud", "Streamlined hiring"],
    },
    {
      icon: "🏥",
      name: "Healthcare",
      description: "Medical providers issue verifiable health records, vaccination proofs, and certifications.",
      benefits: ["Licensed provider verification", "Secure medical history", "Portable health data"],
    },
    {
      icon: "⚖️",
      name: "Legal",
      description: "Law firms and courts certify legal documents, contracts, and agreements.",
      benefits: ["Contract authenticity", "Legal document proof", "Dispute resolution"],
    },
    {
      icon: "🏛️",
      name: "Government",
      description: "Government agencies issue licenses, IDs, permits, and official documents.",
      benefits: ["ID verification", "License authentication", "Permit tracking"],
    },
    {
      icon: "💼",
      name: "Corporate",
      description: "Companies issue employment letters, certifications, and performance records.",
      benefits: ["Employment verification", "Skill certification", "Background checks"],
    },
  ];

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">Use Cases</p>
          <h2 className="text-4xl font-bold text-slate-50 sm:text-5xl">Trusted across sectors</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Trustify works across any industry that issues documents. Here are the primary sectors.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-blue-600/50 hover:bg-slate-900/80"
            >
              {/* Icon */}
              <div className="mb-4 text-4xl">{sector.icon}</div>

              {/* Title */}
              <h3 className="mb-3 text-lg font-bold text-slate-50">{sector.name}</h3>

              {/* Description */}
              <p className="mb-4 text-sm text-slate-400">{sector.description}</p>

              {/* Benefits */}
              <ul className="space-y-2 border-t border-slate-800 pt-4">
                {sector.benefits.map((benefit, bidx) => (
                  <li key={bidx} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-8 text-center">
          <h3 className="mb-2 text-xl font-bold text-slate-50">Your sector not listed?</h3>
          <p className="mb-4 text-slate-400">
            Trustify's flexible design works for any document type. Reach out to explore custom integrations.
          </p>
        </div>
      </div>
    </section>
  );
}

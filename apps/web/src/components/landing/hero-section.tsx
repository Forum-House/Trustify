import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 -z-10 h-96 w-96 rounded-full bg-purple-600/5 blur-3xl" />

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-blue-300">Web3 Document Trust Platform</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
          Document trust,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            anchored on chain
          </span>{" "}
          and verified in seconds.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-2xl text-center text-lg text-slate-400 sm:text-xl">
          Trustify lets approved issuers register tamper-evident documents on Polygon Amoy while anyone can verify them
          without a wallet. Immutable, transparent, instant verification.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/verify"
            className="rounded-lg bg-blue-600 px-8 py-4 text-center font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
          >
            Verify a document
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-4 text-center font-semibold text-slate-200 transition-all hover:border-slate-600 hover:bg-slate-800/50"
          >
            View demo flow
          </Link>
        </div>

        {/* Trust indicator */}
        <div className="flex justify-center gap-4 pt-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔐</span> Cryptographically secure
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span> Instant verification
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🌐</span> Fully decentralized
          </div>
        </div>
      </div>
    </section>
  );
}

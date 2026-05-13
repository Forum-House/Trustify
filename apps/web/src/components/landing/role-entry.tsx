import Link from "next/link";

export function RoleEntry() {
  const roles = [
    {
      icon: "✅",
      title: "I'm an Issuer",
      description: "Register documents on-chain and manage your authenticated registry.",
      cta: "Register as Issuer",
      href: "/issuer",
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: "🛡️",
      title: "I'm an Admin",
      description: "Manage approved issuers, monitor activity, and oversee the registry.",
      cta: "Admin Panel",
      href: "/admin",
      color: "from-purple-600 to-purple-700",
    },
    {
      icon: "🔍",
      title: "I'm a Verifier",
      description: "Verify any document instantly without a wallet or account.",
      cta: "Start Verifying",
      href: "/verify",
      color: "from-green-600 to-green-700",
    },
  ];

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Header */}
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">Get Started</p>
          <h2 className="text-4xl font-bold text-slate-50 sm:text-5xl">Choose your role</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Trustify adapts to your needs. Whether you issue, oversee, or verify documents, we have a place for you.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((role, idx) => (
            <div key={idx} className="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-slate-700 hover:bg-slate-900/80">
              {/* Icon */}
              <div className="mb-4 text-4xl">{role.icon}</div>

              {/* Title */}
              <h3 className="mb-2 text-xl font-bold text-slate-50">{role.title}</h3>

              {/* Description */}
              <p className="mb-6 flex-1 text-slate-400">{role.description}</p>

              {/* CTA Button */}
              <Link
                href={role.href}
                className={`rounded-lg bg-gradient-to-r ${role.color} px-6 py-3 text-center font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95`}
              >
                {role.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

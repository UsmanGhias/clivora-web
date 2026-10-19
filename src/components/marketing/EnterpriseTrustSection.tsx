import Link from "next/link";
import { Shield, Lock, FileCheck2, Clock, CheckCircle } from "lucide-react";

export function EnterpriseTrustSection() {
  const pillars = [
    {
      icon: Lock,
      title: "Ring-Fenced Milestone Escrow",
      description:
        "Client funds are held in isolated, licensed merchant vaults powered by Stripe and Safepay. Clivora never co-mingles operational capital with client milestone funds.",
    },
    {
      icon: FileCheck2,
      title: "Automated IP Assignment",
      description:
        "Every completed contract includes clear, legally binding intellectual property assignment clauses transferring full code and asset ownership upon milestone approval.",
    },
    {
      icon: Clock,
      title: "48-Hour Dispute Resolution SLA",
      description:
        "Dedicated dispute arbitration with neutral review of contract specifications, delivered pull requests, and communication logs. No unilateral fund seizures.",
    },
    {
      icon: Shield,
      title: "Zero Marketplace Fee Guarantee",
      description:
        "Platform fees on negotiated deals remain 0%. Freelancers and agencies invoice clients directly without arbitrary clawbacks or hidden transaction surcharges.",
    },
  ];

  return (
    <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Shield className="h-3.5 w-3.5 text-teal-700" />
            <span>Compliance & Legal Safeguards</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Enterprise escrow and IP protection built in
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Hiring and delivering high-value engineering contracts requires verifiable legal and financial safeguards. Here is how Clivora protects both parties on every project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-6 sm:p-7 hover:border-teal-200 hover:bg-teal-50/20 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-teal-100/70 p-3 text-teal-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/60 via-white to-teal-50/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-teal-900 font-bold text-sm">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              <span>Direct Founder Architectural Oversight</span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              Enterprise engineering contracts through Clivora benefit from distributed systems architecture oversight led by Usman Ghias (
              <a
                href="https://usmanghias.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-800 underline hover:text-teal-950"
              >
                usmanghias.co.uk
              </a>
              ) and CODCrafters.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/trust"
              className="w-full md:w-auto text-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-navy hover:bg-slate-50 transition"
            >
              Trust Architecture
            </Link>
            <Link
              href="/start-a-project"
              className="w-full md:w-auto text-center rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition"
            >
              Start Project SOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

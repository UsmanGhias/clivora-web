import Link from "next/link";

/** Why CLIVORA exists - global story for freelancers and clients. */
export function FounderNoteSection() {
  return (
    <section
      aria-labelledby="founder-note-heading"
      className="relative overflow-hidden border-y border-slate-200 bg-gradient-to-br from-[#0B1F2A] via-[#0F2A36] to-[#12353F] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-stretch">
          {/* Left Column: Heading, Proof Points & Action Buttons */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-300">
                Why CLIVORA exists
              </p>
              <h2
                id="founder-note-heading"
                className="mt-3 font-display text-3xl font-extrabold leading-[1.18] tracking-tight sm:text-4xl text-white"
              >
                Marketplaces tax both sides. I built an OS where you hire, deliver, and invoice without
                losing a cut of the deal.
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                Legacy freelance platforms extract 10-20% from every completed deliverable and penalize off-platform communications. Clivora runs as your independent business infrastructure.
              </p>

              {/* Architectural Guarantee Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-2xs">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs uppercase tracking-wider">
                    <span>✓ $0 Deal Fees</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Zero platform deductions on all negotiated contracts. Keep 100% of your earnings.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-2xs">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs uppercase tracking-wider">
                    <span>✓ Direct Ownership</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Private Connect protects early outreach; full contact activates on mutual accept.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-2xs">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs uppercase tracking-wider">
                    <span>✓ Milestone Escrow</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    Structured milestone invoices paid directly to you with zero arbitrary clawbacks.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-2xs">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs uppercase tracking-wider">
                    <span>✓ Web + Android Sync</span>
                  </div>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed">
                    One unified business account across browser and native mobile app without data loss.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
              <Link
                href="/signup?role=freelancer"
                className="inline-flex rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-navy shadow-lg shadow-teal-900/20 transition hover:bg-teal-300"
              >
                Start free as freelancer
              </Link>
              <Link
                href="/signup?role=client"
                className="inline-flex rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Start free as client
              </Link>
            </div>
          </div>

          {/* Right Column: Founder Narrative Card */}
          <div className="flex flex-col justify-between space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <div className="space-y-4">
              <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">
                I&apos;m{" "}
                <a
                  href="https://usmanghias.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white underline decoration-teal-400 decoration-2 underline-offset-4 hover:text-teal-300 transition-colors"
                >
                  Usman Ghias
                </a>
                , Founder and Lead Architect building CLIVORA at{" "}
                <a
                  href="https://codcrafters.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-teal-300 hover:underline"
                >
                  CODCrafters
                </a>
                . Between client work and shipping the Android app, I watched freelancers lose fees on every invoice and clients pay extra for the same marketplace middleman, while CRM, proposals, and files lived in five different tabs.
              </p>
              <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">
                CLIVORA is the opposite bet: a{" "}
                <strong className="font-semibold text-white">complete Freelancer OS</strong> with private Connect (emails reveal only after mutual accept), CRM, projects, timesheets, messages, and invoices.{" "}
                <strong className="font-semibold text-white">$0 platform fee</strong> on the rate you negotiate. Clients pay freelancers directly against your invoice. One account for web and the Android app so your business doesn&apos;t reset when you leave the desk.
              </p>
              <p className="text-sm leading-relaxed text-white/60">
                Built for freelancers and clients worldwide. If something feels broken, email{" "}
                <a
                  className="font-semibold text-teal-300 underline decoration-teal-400/50 underline-offset-2 hover:text-teal-200"
                  href="mailto:contact@clivora.io"
                >
                  contact@clivora.io
                </a>
                . I read every message.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-wide text-teal-200/90">
              <span>For freelancers: keep your rate</span>
              <span className="text-white/25">·</span>
              <span>For clients: hire without fee stacking</span>
              <span className="text-white/25">·</span>
              <Link href="/compare" className="text-white hover:text-teal-200">
                See vs marketplaces →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

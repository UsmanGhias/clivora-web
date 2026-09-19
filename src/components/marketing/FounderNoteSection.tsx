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
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal-300">
              Why CLIVORA exists
            </p>
            <h2
              id="founder-note-heading"
              className="mt-4 font-display text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl"
            >
              Marketplaces tax both sides. I built an OS where you hire, deliver, and invoice - without
              losing a cut of the deal.
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
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

          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
            <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">
              I&apos;m Usman, building CLIVORA at CODCrafters. Between client work and shipping the
              Android app, I watched freelancers lose fees on every invoice and clients pay extra for
              the same marketplace middleman - while CRM, proposals, and files lived in five different
              tabs.
            </p>
            <p className="text-[15px] leading-relaxed text-white/80 sm:text-base">
              CLIVORA is the opposite bet: a{" "}
              <strong className="font-semibold text-white">complete Freelancer OS</strong> - private
              Connect (emails unlock only after mutual accept), CRM, projects, timesheets, messages,
              and invoices.{" "}
              <strong className="font-semibold text-white">$0 platform fee</strong> on the rate you
              negotiate. Clients pay freelancers directly against your invoice. One account for web and
              the Android app so your business doesn&apos;t reset when you leave the desk.
            </p>
            <p className="text-sm leading-relaxed text-white/55">
              Built for freelancers and clients worldwide. If something feels broken, email{" "}
              <a
                className="font-semibold text-teal-300 underline decoration-teal-400/50 underline-offset-2 hover:text-teal-200"
                href="mailto:contact@clivora.io"
              >
                contact@clivora.io
              </a>
              {" "}
             - I read those.
            </p>
            <div className="flex flex-wrap gap-4 border-t border-white/10 pt-5 text-xs font-semibold uppercase tracking-wide text-teal-200/90">
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

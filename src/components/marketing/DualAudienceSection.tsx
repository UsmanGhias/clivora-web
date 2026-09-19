import Link from "next/link";

const pillars = [
  {
    audience: "Freelancers",
    title: "Keep the rate you negotiate",
    body: "Big marketplaces take a cut from every invoice. On CLIVORA Connect, platform fee on your deal stays $0 - then you invoice the client directly from your workspace.",
  },
  {
    audience: "Clients",
    title: "Hire without fee stacking",
    body: "You already pay for the work. You should not also fund a marketplace tax on both sides. Post needs, review talent, accept privately, and manage delivery in one portal.",
  },
  {
    audience: "Both sides",
    title: "Private until you both say yes",
    body: "Emails unlock only after mutual accept. No cold contact spam. After the match, CRM, projects, messages, and invoices live in the same account on web and Android.",
  },
];

export function DualAudienceSection() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] py-16 text-white sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 60% at 10% 20%, rgba(13,148,136,0.35), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-teal-300">
            Built for both desks
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Current platforms charge freelancers and clients. CLIVORA was built to stop that.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Whether you sell services or hire talent, you get a complete business OS - Connect,
            CRM, delivery, and invoicing - without the marketplace middleman taking a slice of every
            deal.
          </p>
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
          {pillars.map((p) => (
            <article key={p.title} className="md:px-6 md:first:pl-0 md:last:pr-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-300/90">
                {p.audience}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-flex rounded-lg bg-teal-400 px-5 py-3 text-sm font-bold text-navy transition hover:bg-teal-300"
          >
            Compare vs Upwork, Fiverr & more
          </Link>
          <Link
            href="/signup"
            className="inline-flex rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Open a free workspace
          </Link>
        </div>
      </div>
    </section>
  );
}

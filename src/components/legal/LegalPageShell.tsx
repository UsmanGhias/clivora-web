import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

interface LegalPageShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  lastUpdated?: string;
}

/** Light legal chrome aligned with the marketing site. */
export function LegalPageShell({
  children,
  title,
  description,
  lastUpdated = "July 13, 2026",
}: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-navy">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="CLIVORA Home" className="flex items-center gap-2">
            <Logo size="sm" showText={false} variant="onLight" />
            <span className="font-display text-sm font-extrabold text-navy">CLIVORA</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/docs" className="hidden text-slate-500 hover:text-primary sm:inline">
              Docs
            </Link>
            <Link href="/" className="font-semibold text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14 lg:py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {site.company.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">{description}</p>
          ) : null}
          <p className="mt-3 text-sm text-slate-400">Last updated: {lastUpdated}</p>
        </div>

        <article className="legal-prose rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {children}
        </article>
      </main>

      <MarketingFooter />
    </div>
  );
}

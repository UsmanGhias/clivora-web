import Link from "next/link";
import { Smartphone, Star } from "lucide-react";
import { site } from "@/lib/site";

/** Full-bleed Play Store promotion for the marketing homepage. */
export function PlayStorePromoSection() {
  return (
    <section className="pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-teal-50 via-white to-slate-50 px-6 py-10 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
                <Smartphone className="h-3.5 w-3.5" />
                Android app
              </p>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl">
                Run CLIVORA on Google Play
              </h2>
              <p className="mt-3 max-w-xl text-base text-text-secondary">
                Same Freelancer OS on your phone — CRM, invoices, Connect, and offline sync. Subscribe
                to Pro / Pro Plus securely via Google Play.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={site.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white transition hover:bg-navy/90"
                >
                  Get it on Google Play
                </a>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-navy hover:border-primary/40"
                >
                  Read the docs
                </Link>
              </div>
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-text-muted">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                Package {site.appPackage} · current Play build
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white/80 p-5 shadow-sm">
              <p className="text-sm font-bold text-navy">Why install the app?</p>
              <ul className="mt-3 space-y-2 text-sm text-text-secondary">
                <li>• Offline CRM cache with safe sync when you reconnect</li>
                <li>• Push notifications for invoices, messages, and Connect</li>
                <li>• Google Play billing for Pro and Pro Plus</li>
                <li>• One account with the web portal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

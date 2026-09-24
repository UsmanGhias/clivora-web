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
          <div className="relative grid items-stretch gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
                  <Smartphone className="h-3.5 w-3.5" />
                  Android app
                </p>
                <h2 className="mt-4 font-display text-3xl font-extrabold text-navy sm:text-4xl">
                  Run CLIVORA on Google Play
                </h2>
                <p className="mt-3 max-w-xl text-base text-text-secondary leading-relaxed">
                  Full Freelancer OS on your phone: private Connect, CRM, invoices, timesheets, and offline sync. 100% free access and $0 deal fees during Founder Launch.
                </p>
              </div>

              <div className="pt-6">
                <div className="flex flex-wrap items-center gap-3">
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
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border bg-white/80 p-6 shadow-sm">
              <div>
                <p className="text-sm font-bold text-navy">Why install the mobile app?</p>
                <ul className="mt-4 space-y-2.5 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Offline CRM cache with safe cloud sync when you reconnect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Real-time push notifications for milestone invoices, messages, and Connect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>$0 platform fees and 100% free access on all deals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Single unified account shared seamlessly with the web portal</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-3 text-xs text-slate-400">
                Verified Android APK · Direct Google Play install
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

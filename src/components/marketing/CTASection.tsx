import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  Layers,
  CheckCircle2,
  DollarSign,
  Smartphone,
} from "lucide-react";
import { marketing } from "@/lib/marketing";

export function CTASection() {
  const c = marketing.cta;

  return (
    <section className="relative overflow-hidden border-y border-navy/10 bg-[#081018] py-16 text-white sm:py-20 lg:py-24">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 0%, rgba(13,148,136,0.22) 42%, transparent 70%), radial-gradient(ellipse 60% 80% at 90% 20%, rgba(45,212,191,0.18), transparent 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-18deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 14px)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Main 2-Column Balanced Grid */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)] lg:gap-14">
          {/* Left Column: Heading & CTAs */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Start on CLIVORA</span>
            </div>

            <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl text-white">
              {c.headline}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {c.body}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                href={c.primary.href}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-3.5 text-sm font-bold text-navy shadow-lg shadow-teal-400/20 transition-all hover:bg-teal-300 hover:scale-[1.02] active:scale-98"
              >
                <span>{c.primary.label}</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={c.secondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-teal-300/60 hover:bg-white/10"
              >
                {c.secondary.label}
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/45">
              Founder Launch Tier · 100% Free Access · No hidden monthly credit deductions
            </p>
          </div>

          {/* Right Column: Platform Guarantee Proof Card */}
          <div className="rounded-3xl border border-teal-400/20 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-teal-950/40 p-6 sm:p-7 backdrop-blur-md shadow-2xl shadow-navy/50">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-teal-300">
                <Sparkles className="h-5 w-5 text-teal-400" />
                <h3 className="text-sm font-bold tracking-wide uppercase">Direct Operating OS</h3>
              </div>
              <span className="rounded-full border border-teal-400/40 bg-teal-400/10 px-2.5 py-0.5 text-[11px] font-extrabold text-teal-300">
                $0 Deal Fee
              </span>
            </div>

            <div className="mt-5 space-y-3.5">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-white/80 font-medium">Platform Commission</span>
                </div>
                <span className="font-bold text-emerald-400">0% (Keep 100%)</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-teal-400" />
                  <span className="text-white/80 font-medium">Connect Terms & NDA</span>
                </div>
                <span className="font-bold text-teal-300">Mutual Accept</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Layers className="h-4 w-4 text-sky-400" />
                  <span className="text-white/80 font-medium">Milestone Invoicing</span>
                </div>
                <span className="font-bold text-white">Direct Client Settlement</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-4 w-4 text-teal-400" />
                  <span className="text-white/80 font-medium">Unified Parity</span>
                </div>
                <span className="font-bold text-teal-300">Web + Android Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Symmetrical 3-Pillar Feature Cards Grid */}
        <div className="mt-14 grid gap-5 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xs transition hover:border-teal-400/30 hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 mb-3.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">One Unified Account</h4>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Same credentials whether you are bidding as a senior engineer or hiring talent as a venture founder.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xs transition hover:border-teal-400/30 hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 mb-3.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Private Connect Network</h4>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Contact emails release only after mutual contract accept. Protects your communication and client ownership.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xs transition hover:border-teal-400/30 hover:bg-white/[0.05]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 mb-3.5">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white">$0 Deal Fee Settlement</h4>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Clients pay your milestone invoices directly without middleman tax, hidden gateway deductions, or platform clawbacks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

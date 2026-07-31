"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clapperboard,
  Code2,
  DollarSign,
  FileText,
  Globe2,
  Megaphone,
  Palette,
  PenLine,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";
import { ConnectJobsMock } from "./mockups/ConnectJobsMock";

const ribbonIcons = [Briefcase, UsersIcon, Star, Globe2, FileText];
const toneCard: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-sky-50 text-sky-600",
};

const categoryIcons: Record<string, LucideIcon> = {
  "Web Development": Code2,
  "Mobile Apps": Smartphone,
  "Design & Creative": Palette,
  "AI & Automation": Sparkles,
  "Writing & Content": PenLine,
  Marketing: Megaphone,
  Video: Clapperboard,
  "Business ops": Settings2,
};

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function ConnectSection() {
  const c = marketing.connect;

  return (
    <section id="connect" className="border-b border-slate-200/80 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Connect marketplace</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
            {c.headline[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {c.headline[1]}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{c.body}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 shadow-lg shadow-slate-200/50 sm:p-6">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {c.ribbon.map((item, i) => {
              const Icon = ribbonIcons[i] ?? Briefcase;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm"
                >
                  <Icon className="mx-auto h-4 w-4 text-primary" />
                  <p className="mt-1 font-display text-sm font-extrabold text-navy">{item.value}</p>
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <div>
              <h3 className="font-display text-xl font-extrabold text-navy sm:text-2xl">
                Find Work. Hire Talent.{" "}
                <span className="text-primary">Grow Together.</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Access verified freelancers and serious projects - without platform fees on negotiated rates.
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { icon: DollarSign, title: "No Platform Fees", tone: "text-emerald-600 bg-emerald-50" },
                  { icon: ShieldCheck, title: "Complete professional profiles", tone: "text-violet-600 bg-violet-50" },
                  { icon: Zap, title: "Smart Matching", tone: "text-orange-600 bg-orange-50" },
                ].map((f) => (
                  <li key={f.title} className="flex items-center gap-3">
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", f.tone)}>
                      <f.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-navy">{f.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={c.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-500/20"
                >
                  Browse Jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={c.primaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy"
                >
                  Find Freelancers
                </Link>
              </div>
            </div>

            <ConnectJobsMock />
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-navy">Explore Top Categories</p>
              <Link href="/connect" className="text-xs font-semibold text-primary hover:underline">
                View all categories
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {c.categories.map((cat) => {
                const Icon = categoryIcons[cat.title] ?? Briefcase;
                return (
                  <div
                    key={cat.title}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-md",
                        toneCard[cat.tone],
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <p className="mt-1.5 text-xs font-bold text-navy">{cat.title}</p>
                    <p className="text-[10px] text-slate-500">{cat.jobs}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

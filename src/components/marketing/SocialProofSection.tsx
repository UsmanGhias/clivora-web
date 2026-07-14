"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Check,
  Globe2,
  MessageCircle,
  Rocket,
  ShieldCheck,
  ThumbsUp,
  TrendingUp,
  Users,
  Crown,
} from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";
import { TrustedNetworkMock } from "./mockups/TrustedNetworkMock";

const toneBg: Record<string, string> = {
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-sky-100 text-sky-600",
  teal: "bg-teal-100 text-teal-700",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-emerald-100 text-emerald-600",
};

const metricTone: Record<number, string> = {
  0: "bg-teal-50 text-primary",
  1: "bg-violet-50 text-violet-600",
  2: "bg-orange-50 text-orange-600",
  3: "bg-sky-50 text-sky-600",
  4: "bg-emerald-50 text-emerald-600",
};

const featureIcons = [Crown, ShieldCheck, Rocket, ShieldCheck, Globe2, TrendingUp];
const metricIcons = [Users, Briefcase, ThumbsUp, ShieldCheck, MessageCircle];

export function SocialProofSection() {
  const s = marketing.socialProof;

  return (
    <section id="trust" className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(13,148,136,0.08),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            {s.badge}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          >
            {s.headline[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              {s.headline[1]}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-600"
          >
            {s.body}
          </motion.p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {s.features.map((f, i) => {
              const Icon = featureIcons[i] ?? Building2;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                >
                  <div className={cn("mb-3 inline-flex rounded-xl p-2.5", toneBg[f.tone])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-bold text-navy">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:pt-6"
        >
          <TrustedNetworkMock />
        </motion.div>
      </div>

      {/* Trusted-by logo bar */}
      <div className="relative mx-auto mt-14 max-w-7xl px-5 lg:mt-20 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {s.trustedBy.title}
              </p>
              <p className="mt-1.5 max-w-xl text-sm text-slate-500">{s.trustedBy.body}</p>
            </div>
            <Link
              href={s.trustedBy.link.href}
              className="shrink-0 text-sm font-semibold text-primary hover:underline"
            >
              {s.trustedBy.link.label} →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:justify-between sm:gap-x-4">
            {s.trustedBy.logos.map((name) => (
              <span
                key={name}
                className="font-display text-sm font-bold tracking-wide text-slate-300 transition hover:text-slate-500 sm:text-[15px]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom metrics */}
      <div className="relative mx-auto mt-6 max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {s.metrics.map((m, i) => {
            const Icon = metricIcons[i] ?? Users;
            return (
              <div
                key={m.label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3.5 shadow-sm"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    metricTone[i] ?? "bg-teal-50 text-primary",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-navy sm:text-[15px]">{m.value}</p>
                  <p className="truncate text-[11px] text-slate-500">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

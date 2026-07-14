"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { ClientDashMock } from "./mockups/ClientDashMock";

export function HomeHero() {
  const h = marketing.hero;

  return (
    <section className="relative overflow-hidden pb-16 pt-10 lg:pb-24 lg:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_-10%,rgba(13,148,136,0.14),transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.12fr] lg:gap-10 lg:px-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {h.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-navy sm:text-5xl lg:text-[3.35rem]"
          >
            {h.headline[0]}{" "}
            <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              {h.headline[1]}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            {h.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href={h.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark"
            >
              {h.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={h.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition hover:bg-slate-50"
            >
              {h.secondaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2"
          >
            {h.trusts.map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-teal-100/40 to-slate-100/30 blur-2xl" />
          <div className="relative">
            <ClientDashMock />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

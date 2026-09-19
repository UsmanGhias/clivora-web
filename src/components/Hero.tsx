"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Network, Smartphone } from "lucide-react";
import { PhoneMockup } from "./PhoneMockup";
import { site } from "@/lib/site";

/**
 * Marketing hero: one composition, brand-first, mobile Chrome friendly.
 * Phone mockup is desktop-only so the first viewport stays readable on phones.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
      <div className="absolute inset-0 bg-dark-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-5%,rgba(13,148,136,0.38),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_90%_60%,rgba(15,118,110,0.18),transparent_55%)]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-dark-bg to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display text-3xl font-extrabold tracking-[0.2em] text-white sm:text-4xl lg:text-[2.75rem]"
            >
              {site.name}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]"
            >
              Hire freely.
              <br />
              <span className="text-gradient">Run the business here.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg lg:mx-0 lg:max-w-lg"
            >
              Private Connect marketplace with $0 platform fees on your deals, plus CRM,
              projects, and invoices. Web and Android. One account.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
            >
              <Link
                href="/connect"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark"
              >
                <Network className="h-4 w-4" />
                Browse Connect free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/[0.07] px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/12"
              >
                Start free
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.24 }}
              className="mt-5 text-sm text-white/45"
            >
              <Link href="/login" className="hover:text-white">
                Sign in
              </Link>
              <span className="mx-2 text-white/20">·</span>
              <a
                href={site.playStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Android app
              </a>
              <span className="mx-2 text-white/20">·</span>
              <span className="text-teal-200/80">$0 hire fees</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
            className="relative hidden justify-center lg:flex"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

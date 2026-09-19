"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedSection";
import { Check, Sparkles, Zap, Gift } from "lucide-react";
import { site } from "@/lib/site";

const freePlanFeatures = [
  `Up to ${site.freeLimits.clients} clients`,
  `Up to ${site.freeLimits.projects} projects`,
  `${site.freeLimits.invoicesPerMonth} invoices per month`,
  `Up to ${site.freeLimits.templates} smart templates`,
  `${site.freeLimits.fileVaultMb} MB File Vault`,
  "Tasks, expenses & notes",
  "Calendar & follow-up alerts",
  "Financial reports & PDF invoices",
  "CLIVORA AI insights (local)",
  "Light & dark mode",
  "Offline - data stays on device",
];

const proPlanFeatures = [
  "Unlimited clients & projects",
  "Unlimited invoices & tasks",
  "Unlimited smart templates",
  "Client contracts & tracking",
  "Business workflows & automations",
  `${site.proLimits.fileVaultGb} GB File Vault storage`,
  "Invoice branding & PDF export",
  "Project time tracking",
  "All future premium features",
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Free During{" "}
            <span className="text-gradient">Early Access</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            {site.pricing.earlyAccessNote}
          </p>
        </AnimatedSection>

        {/* Early access banner */}
        <AnimatedSection className="mt-10" delay={0.1}>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-brand-gradient p-px">
            <div className="flex items-center gap-4 rounded-[0.9rem] bg-dark-bg/90 px-6 py-5 sm:px-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Upgrade when you are ready</p>
                <p className="mt-1 text-sm text-white/60">
                  Free to start. Pro ({site.pricing.proMonthlyLabel}/mo) and Pro Plus (
                  {site.pricing.proPlusMonthlyLabel}/mo) unlock unlimited tools via website
                  checkout.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <StaggerContainer className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          <StaggerItem>
            <div className="relative h-full rounded-3xl glass p-8 lg:p-10">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-white/60" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/60">
                    Free Plan
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-white">
                    $0
                  </span>
                  <span className="text-white/50">/month</span>
                </div>
                <p className="mt-2 text-white/50">
                  When limits return after early access
                </p>
              </div>

              <motion.a
                href="#download"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full rounded-full border border-white/20 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/5"
              >
                Download Free
              </motion.a>

              <ul className="mt-8 space-y-3">
                {freePlanFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="relative h-full">
              <div className="absolute -inset-px rounded-3xl bg-brand-gradient" />
              <div className="relative h-full rounded-3xl bg-dark-bg p-8 lg:p-10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/30">
                    <Sparkles className="h-3.5 w-3.5" />
                    Pro & Pro Plus
                  </span>
                </div>

                <div className="mb-6 mt-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Pro Plus
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-gradient">
                      {site.pricing.proPlusMonthlyLabel}
                    </span>
                    <span className="text-white/50">/month</span>
                  </div>
                  <p className="mt-2 text-white/50">
                    Pro from {site.pricing.proMonthlyLabel}/mo · {site.pricing.billingNote}
                  </p>
                </div>

                <motion.a
                  href="/pro"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full rounded-full bg-primary py-3.5 text-center font-semibold text-white shadow-lg shadow-primary/30"
                >
                  Get Pro Plus
                </motion.a>

                <ul className="mt-8 space-y-3">
                  {proPlanFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}

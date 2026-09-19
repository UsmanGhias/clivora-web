"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./ui/AnimatedSection";
import { ChevronDown } from "lucide-react";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Is CLIVORA free right now?",
    a: "Yes - all features are unlocked during early access. Unlimited clients, projects, and invoices at no cost while we prepare Google Play subscriptions.",
  },
  {
    q: "Where is my data stored?",
    a: "All business data is stored locally on your device using SQLite. Nothing leaves your phone unless you enable future cloud sync. CLIVORA AI runs entirely offline.",
  },
  {
    q: "What are the free plan limits after early access?",
    a: "3 clients, 5 projects, 10 invoices per month, 3 smart templates, and 100 MB File Vault. Tasks, expenses, notes, reports, and PDF invoices remain available.",
  },
  {
    q: "How much will Pro cost?",
    a: "Pro is $9/month via Google Play Billing. It unlocks unlimited usage, contracts, workflows, and 5 GB File Vault storage.",
  },
  {
    q: "Can I export branded PDF invoices?",
    a: "Yes. Create invoices, pick Classic/Modern/Minimal templates, add your logo and accent color, then preview and share PDFs directly from the app.",
  },
  {
    q: "What is CLIVORA AI?",
    a: "Local smart insights from your business data - follow-up drafts, revenue snapshots, and project alerts. Private, offline, and instant. No cloud AI required.",
  },
  {
    q: "How do I get support?",
    a: `Email ${site.company.email} or visit our Support page. Include your device model and app version for faster help.`,
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Everything you need to know before getting started.
          </p>
        </AnimatedSection>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <AnimatedSection key={faq.q} delay={i * 0.05}>
              <div className="overflow-hidden rounded-2xl glass transition-colors hover:border-primary/20">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={open === i}
                >
                  <span className="font-semibold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/5 px-6 pb-5 pt-2 text-white/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-8 text-center" delay={0.3}>
          <p className="text-white/50">
            More questions?{" "}
            <a href="/support" className="text-primary hover:text-primary-light">
              Visit our Support center
            </a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "./ui/AnimatedSection";
import { site } from "@/lib/site";
import { ArrowRight, Cloud, Network, Smartphone } from "lucide-react";

const highlights = [
  { icon: Network, text: "CLIVORA Connect" },
  { icon: Cloud, text: "Web + cloud CRM" },
  { icon: Smartphone, text: "Android · v" + site.appVersion },
];

export function CTA() {
  return (
    <section id="download" className="relative overflow-hidden py-20 lg:py-28">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark-bg to-primary-dark/20" />
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 sm:p-12 lg:p-16"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-teal-500/10 blur-[60px]" />

            <div className="relative">
              <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
                Start on Connect.
                <br />
                <span className="text-gradient">Run the rest in CLIVORA.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/60 sm:text-lg">
                Create a free account, browse the marketplace, and upgrade to Pro Plus when you
                are ready to contact, post jobs, and publish your profile.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-5 sm:gap-6">
                {highlights.map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/60">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/connect"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-white"
                >
                  Open Connect
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white"
                >
                  Start free on web
                </Link>
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href={site.playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl bg-white px-6 py-3 text-navy shadow-xl"
                >
                  <div className="relative h-9 w-9 overflow-hidden rounded-xl">
                    <Image
                      src="/app-icon.png"
                      alt="CLIVORA app icon"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-navy/60">Get it on</div>
                    <div className="text-base font-bold">Google Play</div>
                  </div>
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <p className="mt-8 text-sm text-white/40">
                Developed by{" "}
                <Link
                  href="/about"
                  className="text-white/60 underline underline-offset-2 hover:text-white"
                >
                  {site.company.name}
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

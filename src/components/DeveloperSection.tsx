"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "./ui/AnimatedSection";
import { site } from "@/lib/site";
import { ExternalLink, Shield, Code2 } from "lucide-react";

export function DeveloperSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-dark-surface to-navy p-px">
            <div className="rounded-[1.4rem] bg-dark-bg/80 p-8 lg:p-14">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                    <Code2 className="h-4 w-4" />
                    Developed by {site.company.name}
                  </div>
                  <h2 className="text-3xl font-bold lg:text-4xl">
                    Built by{" "}
                    <span className="text-gradient">{site.company.name}</span>
                  </h2>
                  <p className="mt-4 text-lg text-white/60 leading-relaxed">
                    {site.company.name} crafts premium software for freelancers
                    and agencies. {site.name} is our flagship product - designed
                    with the same precision and care we bring to every project.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/40"
                    >
                      About {site.company.name}
                    </Link>
                    <a
                      href={site.company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
                    >
                      {site.company.url.replace("https://", "")}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: Shield,
                      title: "Privacy First",
                      text: "Local data storage. Full transparency.",
                      href: "/privacy",
                    },
                    {
                      icon: Code2,
                      title: "Open Policies",
                      text: "Privacy, terms, and data safety published.",
                      href: "/data-safety",
                    },
                    {
                      icon: Shield,
                      title: "Account Control",
                      text: "Delete your data anytime.",
                      href: "/delete-account",
                    },
                    {
                      icon: ExternalLink,
                      title: "24/7 Support",
                      text: "Help when you need it.",
                      href: "/support",
                    },
                  ].map((item) => (
                    <Link key={item.title} href={item.href}>
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="h-full rounded-2xl glass p-5 transition-colors hover:bg-white/5"
                      >
                        <item.icon className="mb-3 h-6 w-6 text-primary" />
                        <h3 className="font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-white/50">
                          {item.text}
                        </p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

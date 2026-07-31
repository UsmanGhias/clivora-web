"use client";

import Link from "next/link";
import { AnimatedSection, FadeIn } from "./ui/AnimatedSection";
import {
  Cloud,
  Layers,
  Network,
  Puzzle,
  Shield,
  AlertTriangle,
} from "lucide-react";

const problems = [
  {
    icon: Puzzle,
    title: "Tool sprawl",
    description:
      "One app for clients, another for invoices, a third marketplace for hiring, and nothing talks to each other.",
  },
  {
    icon: AlertTriangle,
    title: "Open marketplace risk",
    description:
      "Public profiles and open contact invite spam. Serious freelancers and clients need private matching.",
  },
  {
    icon: Shield,
    title: "Work stops after the hire",
    description:
      "Most platforms take a cut and leave you to rebuild the relationship elsewhere. The job should continue in your OS.",
  },
];

export function ProblemSolution() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why CLIVORA
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Built for how freelancers actually work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            We are not another gig board. CLIVORA is a cloud-first business operating
            system. Connect to find work, CRM to run it, web and Android in sync.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {problems.map((problem, i) => (
            <FadeIn key={problem.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <problem.icon className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                  {problem.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <AnimatedSection className="mt-16" delay={0.15}>
          <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-navy to-navy p-6 sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-teal-300">
                  <Layers className="h-4 w-4" />
                  The CLIVORA way
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl lg:text-4xl">
                  Connect. Manage. Get paid.{" "}
                  <span className="text-gradient">One account.</span>
                </h3>
                <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
                  Sign in once on the web or Android app. Discover talent and jobs on
                  Connect, keep relationships in your CRM, send invoices, and sync
                  offline when you are on the go.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/connect"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
                  >
                    <Network className="h-4 w-4" />
                    Explore Connect
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-2xl border border-white/20 px-5 py-2.5 text-sm font-bold text-white"
                  >
                    Create free account
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: Network, label: "Private Connect marketplace" },
                  { icon: Cloud, label: "Cloud CRM · web + app" },
                  { icon: Layers, label: "Projects & invoices" },
                  { icon: Shield, label: "Contact only after accept" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center"
                  >
                    <item.icon className="mb-2 h-7 w-7 text-primary" />
                    <span className="text-xs font-medium text-white/80 sm:text-sm">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

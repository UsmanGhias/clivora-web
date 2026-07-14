"use client";

import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedSection";
import {
  User,
  Building2,
  Code,
  Palette,
  PenTool,
  Camera,
  Briefcase,
} from "lucide-react";

const freelancerTypes = [
  { icon: Code, label: "Developers" },
  { icon: Palette, label: "Designers" },
  { icon: Camera, label: "Creators" },
  { icon: PenTool, label: "Writers" },
  { icon: Briefcase, label: "Consultants" },
];

const freelancerBenefits = [
  "Manage all clients in one CRM",
  "Send professional branded invoices",
  "Track projects and deadlines",
  "Monitor expenses and profit",
  "Never miss a follow-up",
];

const agencyBenefits = [
  "Centralized client database",
  "Project budgets and tracking",
  "Team collaboration (coming soon)",
  "Advanced reports and exports",
  "Scalable Pro plan",
];

export function Audience() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Built For You
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Designed for{" "}
            <span className="text-gradient">How You Work</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            Whether you&apos;re a solo freelancer or growing agency, CLIVORA
            adapts to your workflow - not the other way around.
          </p>
        </AnimatedSection>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {freelancerTypes.map((type, i) => (
            <FadeIn key={type.label} delay={i * 0.05}>
              <div className="flex items-center gap-2 rounded-full glass px-4 py-2">
                <type.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-white/80">
                  {type.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        <StaggerContainer className="mt-16 grid gap-8 lg:grid-cols-2">
          <StaggerItem>
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-transparent p-px">
              <div className="h-full rounded-[1.4rem] bg-dark-surface p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  For Freelancers
                </h3>
                <p className="mt-3 text-white/60 leading-relaxed">
                  Independent professionals who need to bill clients, manage
                  multiple projects, and track finances - without enterprise
                  complexity or monthly fees for five different tools.
                </p>
                <ul className="mt-6 space-y-3">
                  {freelancerBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                        <span className="text-xs text-success">✓</span>
                      </div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent p-px">
              <div className="h-full rounded-[1.4rem] bg-dark-surface p-8 lg:p-10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20">
                  <Building2 className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  For Agencies
                </h3>
                <p className="mt-3 text-white/60 leading-relaxed">
                  Small teams and growing agencies that need centralized client
                  management, project oversight, and financial visibility - 
                  with team features and collaboration on the roadmap.
                </p>
                <ul className="mt-6 space-y-3">
                  {agencyBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                        <span className="text-xs text-blue-400">✓</span>
                      </div>
                      {benefit}
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

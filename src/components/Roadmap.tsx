"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedSection";
import {
  Cloud,
  Users,
  Globe,
  Kanban,
  Calendar,
  RefreshCw,
} from "lucide-react";

const roadmapItems = [
  {
    icon: Cloud,
    title: "Cloud Sync & Backup",
    description:
      "Securely sync your business data across devices with encrypted cloud backup.",
    phase: "Next",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: RefreshCw,
    title: "Google Play Billing",
    description:
      "Pro subscriptions at $9/month · Pro Plus at $19/month with secure Play Store payments.",
    phase: "Next",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Roles, permissions, and shared projects for growing agency teams.",
    phase: "Planned",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Kanban,
    title: "Kanban Boards",
    description:
      "Visual drag-and-drop task boards for project management power users.",
    phase: "Planned",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Calendar,
    title: "Google Calendar Sync",
    description:
      "Two-way sync between CLIVORA deadlines and your Google Calendar.",
    phase: "Planned",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Globe,
    title: "Client Portal",
    description:
      "Give clients a branded portal to view projects, invoices, and contracts.",
    phase: "Vision",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
];

const shippedBanner = [
  "Branded PDF Invoices",
  "CLIVORA AI",
  "Smart Templates",
  "Contracts",
  "Workflows",
  "File Vault",
  "Time Tracking",
  "Payments Hub",
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Roadmap
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            What&apos;s{" "}
            <span className="text-gradient">Coming Next</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            We ship fast. Here&apos;s what we&apos;re building next - everything
            else is already in the app.
          </p>
        </AnimatedSection>

        <AnimatedSection className="mt-10" delay={0.1}>
          <div className="rounded-2xl glass p-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-success mb-4">
              Already Shipped ✓
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {shippedBanner.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -4 }}
                className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-all hover:border-primary/20"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg}`}
                  >
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    {item.phase}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedSection";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  CheckSquare,
  Receipt,
  StickyNote,
  Calendar,
  Bell,
  BarChart3,
  Palette,
  Bot,
  FileStack,
  FileSignature,
  Workflow,
  HardDrive,
  Timer,
  Share2,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Business Command Center",
    description:
      "Paid revenue, outstanding amounts, active projects, and onboarding checklist - your morning snapshot in seconds.",
    color: "from-teal-500/20 to-teal-600/10",
    iconColor: "text-teal-400",
    badge: "Core",
  },
  {
    icon: Users,
    title: "Client CRM",
    description:
      "Business name, contact, email, phone, WhatsApp, address, and notes. Search and manage your entire client base.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
    badge: "Core",
  },
  {
    icon: FolderKanban,
    title: "Projects & Time Tracking",
    description:
      "Budgets, deadlines, status filters, and a built-in project timer. Track hours and see earned revenue per project.",
    color: "from-orange-500/20 to-orange-600/10",
    iconColor: "text-orange-400",
    badge: "Core",
  },
  {
    icon: FileText,
    title: "Professional Invoicing",
    description:
      "Tax, discounts, draft/sent/paid/overdue workflow. Link invoices to clients and projects effortlessly.",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-green-400",
    badge: "Core",
  },
  {
    icon: Share2,
    title: "Branded PDF Invoices",
    description:
      "Preview and share polished PDF invoices. Classic, Modern, or Minimal templates with your logo and accent color.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
    badge: "New",
  },
  {
    icon: CreditCard,
    title: "Payments Hub",
    description:
      "Dedicated view for pending and paid invoices. Mark payments received with one tap and keep cash flow clear.",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-cyan-400",
    badge: "Core",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description:
      "Priorities, due dates, project links, and completion tracking. Filter pending vs completed instantly.",
    color: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
    badge: "Core",
  },
  {
    icon: Receipt,
    title: "Expense Tracking",
    description:
      "11 categories - software, hardware, travel, marketing, taxes, and more. Link expenses to projects.",
    color: "from-red-500/20 to-red-600/10",
    iconColor: "text-red-400",
    badge: "Core",
  },
  {
    icon: StickyNote,
    title: "Smart Notes",
    description:
      "Personal, client, and project notes. Capture meeting summaries, ideas, and quick thoughts on the go.",
    color: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-400",
    badge: "Core",
  },
  {
    icon: Calendar,
    title: "Unified Calendar",
    description:
      "Task due dates, project deadlines, and invoice due dates in one chronological view.",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-400",
    badge: "Core",
  },
  {
    icon: Bell,
    title: "Follow-up Alerts",
    description:
      "Auto-generated reminders for overdue invoices, pending payments, and due or overdue tasks.",
    color: "from-pink-500/20 to-pink-600/10",
    iconColor: "text-pink-400",
    badge: "Core",
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    description:
      "Revenue, outstanding, expenses, net profit, and monthly breakdowns. Know your numbers at a glance.",
    color: "from-teal-500/20 to-teal-600/10",
    iconColor: "text-teal-400",
    badge: "Core",
  },
  {
    icon: Palette,
    title: "Invoice Branding",
    description:
      "Upload your logo, pick from 8 accent colors, and choose Classic, Modern, or Minimal PDF styles.",
    color: "from-fuchsia-500/20 to-fuchsia-600/10",
    iconColor: "text-fuchsia-400",
    badge: "Core",
  },
  {
    icon: Bot,
    title: "CLIVORA AI",
    description:
      "Smart insights from your local business data - follow-up drafts, revenue snapshots, and project alerts. Private and offline.",
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
    badge: "New",
  },
  {
    icon: FileStack,
    title: "Smart Templates",
    description:
      "Reusable messages with variables like {{clientName}} and {{invoiceNumber}}. Invoice, project, and follow-up categories.",
    color: "from-sky-500/20 to-sky-600/10",
    iconColor: "text-sky-400",
    badge: "New",
  },
  {
    icon: FileSignature,
    title: "Client Contracts",
    description:
      "Create, send, and track agreements linked to customers. Draft, sent, signed, and cancelled statuses.",
    color: "from-amber-500/20 to-amber-600/10",
    iconColor: "text-amber-400",
    badge: "Pro",
  },
  {
    icon: Workflow,
    title: "Business Workflows",
    description:
      "Auto follow-up tasks for overdue invoices, welcome notes for new clients, and weekly revenue summaries.",
    color: "from-rose-500/20 to-rose-600/10",
    iconColor: "text-rose-400",
    badge: "Pro",
  },
  {
    icon: HardDrive,
    title: "File Vault",
    description:
      "Store project assets, logos, and client documents securely on-device. 100 MB free, 5 GB on Pro.",
    color: "from-slate-500/20 to-slate-600/10",
    iconColor: "text-slate-300",
    badge: "New",
  },
  {
    icon: Timer,
    title: "Project Time Tracker",
    description:
      "Start and stop timers per project. Tracked hours appear on your projects dashboard automatically.",
    color: "from-lime-500/20 to-lime-600/10",
    iconColor: "text-lime-400",
    badge: "New",
  },
];

const badgeStyles: Record<string, string> = {
  Core: "bg-teal-500/10 text-teal-400",
  New: "bg-primary/10 text-primary-light",
  Pro: "bg-brand-purple/10 text-brand-purple",
};

export function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            19 Tools.{" "}
            <span className="text-gradient">One Business OS.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            Everything freelancers and agencies need - from CRM and invoicing to
            AI insights, contracts, workflows, and secure file storage.
          </p>
        </AnimatedSection>

        <StaggerContainer className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative h-full overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:border-primary/20 hover:bg-white/5"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {feature.description}
                </p>
                <span
                  className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[feature.badge]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {feature.badge}
                </span>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

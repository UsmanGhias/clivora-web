"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedSection, FadeIn } from "./ui/AnimatedSection";
import { TrendingUp, DollarSign, PieChart, ArrowUpRight } from "lucide-react";

const dashboardFeatures = [
  {
    title: "Revenue at a Glance",
    description:
      "See total revenue, outstanding payments, and month-over-month growth instantly.",
    metric: "$12,450",
    change: "+12.5%",
    positive: true,
  },
  {
    title: "Active Projects",
    description:
      "Track progress across all engagements with visual progress bars and deadlines.",
    metric: "8 Active",
    change: "3 due this week",
    positive: true,
  },
  {
    title: "Financial Health",
    description:
      "Net profit, expenses, and cash flow metrics help you make informed decisions.",
    metric: "$9,200",
    change: "Net Profit",
    positive: true,
  },
];

export function DashboardPreview() {
  return (
    <section id="dashboard" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <AnimatedSection>
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
              Dashboard
            </span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Your Business{" "}
              <span className="text-gradient">Command Center</span>
            </h2>
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              Start every day with clarity. The CLIVORA dashboard gives you an
              instant snapshot of revenue, outstanding invoices, active projects,
              and upcoming deadlines - all in one beautiful view.
            </p>

            <div className="mt-8 space-y-4">
              {dashboardFeatures.map((item, i) => (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <div className="flex items-start gap-4 rounded-2xl glass p-5 transition-colors hover:bg-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">
                          {item.title}
                        </h4>
                        <span className="text-sm font-bold text-success">
                          {item.metric}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/50">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative">
              {/* Dashboard mockup card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl glass-strong p-6 glow-purple-sm lg:p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/50">Good morning, Alex</p>
                    <h3 className="text-2xl font-bold text-white">
                      Dashboard Overview
                    </h3>
                  </div>
                  <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
                    <Image
                      src="/clivora_logo.png"
                      alt="CLIVORA"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Stat cards */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-navy p-5">
                    <div className="flex items-center gap-2 text-white/50">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Total Revenue</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">
                      $12,450
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-success">
                      <ArrowUpRight className="h-3 w-3" />
                      +12.5% this month
                    </div>
                  </div>
                  <div className="rounded-2xl bg-warning/10 p-5">
                    <div className="flex items-center gap-2 text-white/50">
                      <PieChart className="h-4 w-4" />
                      <span className="text-xs">Outstanding</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-warning">
                      $1,840
                    </p>
                    <p className="mt-1 text-xs text-white/40">4 invoices pending</p>
                  </div>
                </div>

                {/* Chart placeholder */}
                <div className="mb-6 rounded-2xl bg-white/5 p-5">
                  <p className="mb-4 text-sm font-medium text-white/70">
                    Monthly Revenue
                  </p>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map(
                      (height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-primary/50 to-primary"
                        />
                      )
                    )}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-white/30">
                    {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map(
                      (m) => (
                        <span key={m}>{m}</span>
                      )
                    )}
                  </div>
                </div>

                {/* Recent activity */}
                <div>
                  <p className="mb-3 text-sm font-medium text-white/70">
                    Recent Activity
                  </p>
                  {[
                    { text: "Invoice #1042 paid", time: "2h ago", color: "bg-success" },
                    { text: "New client: Studio X", time: "5h ago", color: "bg-primary" },
                    { text: "Task completed: Logo design", time: "1d ago", color: "bg-blue-500" },
                  ].map((activity) => (
                    <div
                      key={activity.text}
                      className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0"
                    >
                      <div className={`h-2 w-2 rounded-full ${activity.color}`} />
                      <span className="flex-1 text-sm text-white/80">
                        {activity.text}
                      </span>
                      <span className="text-xs text-white/30">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

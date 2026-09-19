"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PhoneMockup() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="relative mx-auto w-[280px] sm:w-[300px] lg:w-[320px]">
          <div className="rounded-[3rem] border-[6px] border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-primary/20">
            <div className="absolute top-4 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900" />

            <div className="overflow-hidden rounded-[2.4rem] bg-dark-bg">
              <div className="flex items-center justify-between px-6 pt-3 pb-1">
                <span className="text-[10px] text-white/60">9:41</span>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-white/60" />
                  <div className="h-2 w-3 rounded-sm bg-white/60" />
                </div>
              </div>

              <div className="px-4 pb-6 pt-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-white/50">Good morning</p>
                    <p className="text-sm font-bold text-white">Dashboard</p>
                  </div>
                  <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                    <Image
                      src="/clivora_logo.png"
                      alt="CLIVORA"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-brand-gradient p-3">
                    <p className="text-[9px] text-white/70">Paid Revenue</p>
                    <p className="text-sm font-bold text-white">$12,450</p>
                    <p className="text-[9px] text-teal-200">+12.5%</p>
                  </div>
                  <div className="rounded-2xl bg-warning/10 p-3">
                    <p className="text-[9px] text-white/50">Outstanding</p>
                    <p className="text-sm font-bold text-warning">$1,840</p>
                    <p className="text-[9px] text-white/40">4 invoices</p>
                  </div>
                </div>

                <p className="mb-2 text-[10px] font-semibold text-white/70">
                  Quick Actions
                </p>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {["👤", "📁", "📄", "✓"].map((icon, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center rounded-xl bg-primary/15 p-2 text-sm"
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                <p className="mb-2 text-[10px] font-semibold text-white/70">
                  Active Projects
                </p>
                {[
                  { name: "Website Redesign", client: "Acme Corp", progress: 75 },
                  { name: "Brand Identity", client: "Studio X", progress: 45 },
                ].map((project) => (
                  <div
                    key={project.name}
                    className="mb-2 rounded-xl glass p-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-medium text-white">
                        {project.name}
                      </p>
                      <span className="text-[9px] text-white/40">
                        {project.progress}%
                      </span>
                    </div>
                    <p className="text-[9px] text-white/40">{project.client}</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex justify-around rounded-2xl glass py-2">
                  {["Home", "Clients", "Work", "Bill", "Hub"].map((label, i) => (
                    <span
                      key={label}
                      className={`text-[8px] font-medium ${i === 0 ? "text-primary" : "text-white/40"}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-primary/15 blur-[80px]" />
      </div>
    </div>
  );
}

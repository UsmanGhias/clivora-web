"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { marketing } from "@/lib/marketing";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">FAQ</span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Questions, answered
          </h2>
          <p className="mt-3 text-slate-600">
            Everything you need to know before you start on CLIVORA.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {marketing.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-navy sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-slate-400 transition",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-600">
                    {item.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

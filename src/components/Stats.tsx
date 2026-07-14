"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { AnimatedSection } from "./ui/AnimatedSection";

function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 2,
      ease: "easeOut",
    });
    return controls.stop;
  }, [motionValue, value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`;
      }
    });
    return unsubscribe;
  }, [rounded, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const stats = [
  { value: 19, suffix: "", label: "Business Tools", prefix: "" },
  { value: 100, suffix: "%", label: "Offline & Private", prefix: "" },
  { value: 5, suffix: "", label: "Free Projects", prefix: "" },
  { value: 24, suffix: "/7", label: "Access Your Data", prefix: "" },
];

export function Stats() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-6 rounded-3xl glass-strong p-8 lg:grid-cols-4 lg:p-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-gradient sm:text-4xl lg:text-5xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <p className="mt-2 text-sm text-white/50 lg:text-base">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

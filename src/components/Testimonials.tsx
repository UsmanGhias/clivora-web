"use client";

import { motion } from "framer-motion";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "./ui/AnimatedSection";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed K.",
    role: "Freelance Developer",
    location: "Karachi, PK",
    text: "I used to juggle Excel, a notes app, and a separate invoicing tool. CLIVORA replaced all three. My morning dashboard alone saves me 30 minutes every day.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Brand Designer",
    location: "Lahore, PK",
    text: "The invoice branding feature is a game-changer. Clients actually comment on how professional my invoices look. Worth every rupee of the Pro plan.",
    rating: 5,
  },
  {
    name: "Omar R.",
    role: "Digital Marketing Consultant",
    location: "Islamabad, PK",
    text: "Finally an app built for freelancers, not enterprises. Clean UI, fast, and my data stays on my phone. The follow-up notifications alone have helped me collect overdue payments.",
    rating: 5,
  },
  {
    name: "Fatima Z.",
    role: "Agency Owner",
    location: "Dubai, UAE",
    text: "Managing 15+ client projects used to be chaos. CLIVORA's project tracking and calendar view keep my small team aligned without the complexity of enterprise tools.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="text-gradient">Freelancers Worldwide</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            Join thousands of independent professionals who run their business
            smarter with CLIVORA.
          </p>
        </AnimatedSection>

        <StaggerContainer className="mt-16 grid gap-6 sm:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative h-full rounded-2xl glass p-8 transition-all hover:border-white/15"
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-white/50">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

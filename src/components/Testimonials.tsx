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
    location: "Remote",
    text: "I used to keep client emails in labels, hours in a notes file, and invoices in a Word template. CLIVORA’s morning dashboard shows paid vs pending from real invoice rows - I stopped guessing what I’m owed.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Brand Designer",
    location: "Europe",
    text: "Pro invoice branding made my PDF look like my studio, not a generic template. Clients notice - and they pay me directly on the invoice, without a marketplace taking a cut.",
    rating: 5,
  },
  {
    name: "Omar R.",
    role: "Marketing consultant",
    location: "Middle East",
    text: "Connect’s mutual-accept rule is the feature I quote to clients: nobody gets my email until I say yes. After accept, the CRM project and invoice live in the same login as the Android app.",
    rating: 5,
  },
  {
    name: "Fatima Z.",
    role: "Small agency owner",
    location: "Remote",
    text: "Fifteen shared projects used to live in chat threads. Shared project status + tasks on CLIVORA is boring in a good way - freelancers know what’s in progress without another tool.",
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
            Notes from freelancers{" "}
            <span className="text-gradient">who invoice for real</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
            Early users worldwide - concrete desks, not empty “thousands of customers” claims.
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

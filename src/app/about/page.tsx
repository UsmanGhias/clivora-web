import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/LegalPageShell";
import { site } from "@/lib/site";
import { Code2, Rocket, Shield, Users } from "lucide-react";

export const metadata: Metadata = {
  title: `About - ${site.company.name}`,
  description: `Learn about ${site.company.name}, the team behind ${site.name}.`,
};

export default function AboutPage() {
  return (
    <LegalPageShell
      title={`About ${site.company.name}`}
      description={`We build beautiful, intelligent software for freelancers and independent professionals.`}
    >
      <p>
        <strong>{site.company.name}</strong> is a software development company
        focused on creating premium mobile experiences for freelancers, agencies,
        and independent professionals. We believe running a business should be
        simple, beautiful, and unified - not scattered across a dozen apps.
      </p>

      <h2>Our Mission</h2>
      <p>
        To build the world&apos;s most beautiful and intelligent Business
        Operating System - giving every freelancer and agency the tools to
        manage clients, projects, finances, and growth from a single platform.
      </p>

      <h2>{site.name} - Our Flagship Product</h2>
      <p>
        {site.name} is our all-in-one Freelancer OS - available on the web at{" "}
        <a href={site.url}>{site.url.replace("https://", "")}</a> and on Android.
        It combines a private Connect marketplace, CRM, project management,
        professional invoicing, expense tracking, tasks, calendar, and financial
        reports into one polished platform designed for how freelancers and
        clients actually work.
      </p>

      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Code2,
            title: "Crafted with Care",
            text: "Every screen, animation, and interaction is designed for clarity and speed.",
          },
          {
            icon: Shield,
            title: "Privacy First",
            text: "Your business data stays on your device. Local-first, always in your control.",
          },
          {
            icon: Users,
            title: "Built for Freelancers",
            text: "Not enterprise bloat - tools tuned for solo professionals and small teams.",
          },
          {
            icon: Rocket,
            title: "Always Improving",
            text: "Cloud sync, AI assistant, team features, and more on our active roadmap.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl glass p-6">
            <item.icon className="mb-3 h-8 w-8 text-primary" />
            <h3 className="font-bold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-white/60">{item.text}</p>
          </div>
        ))}
      </div>

      <h2>What We Value</h2>
      <ul>
        <li>
          <strong>Simplicity</strong> - Powerful features without complexity
        </li>
        <li>
          <strong>Design excellence</strong> - Premium UI that professionals are
          proud to use
        </li>
        <li>
          <strong>User ownership</strong> - Your data belongs to you
        </li>
        <li>
          <strong>Honest pricing</strong> - Generous free tier, fair Pro plan
        </li>
      </ul>

      <h2>Company Information</h2>
      <ul>
        <li>
          <strong>Company:</strong> {site.company.name}
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a href={site.company.url}>{site.company.url}</a>
        </li>
        <li>
          <strong>Product:</strong> {site.name} ({site.appPackage})
        </li>
        <li>
          <strong>Support:</strong>{" "}
          <a href={`mailto:${site.company.email}`}>{site.company.email}</a>
        </li>
      </ul>

      <h2>Get in Touch</h2>
      <p>
        Have questions, feedback, or partnership inquiries? We&apos;d love to
        hear from you. Visit our{" "}
        <Link href="/contact">contact page</Link> or email{" "}
        <a href={`mailto:${site.company.email}`}>{site.company.email}</a>.
      </p>
    </LegalPageShell>
  );
}

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Briefcase,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import { cleanText } from "@/lib/clean-text";
import { getLanguageBadge } from "@/lib/job-languages";
import type { JobCardData } from "./JobListingCard";

interface JobDetailDrawerProps {
  job: JobCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailDrawer({ job, isOpen, onClose }: JobDetailDrawerProps) {
  // Lock body scroll when open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!job) return null;

  const cleanTitle = cleanText(job.title).replace(/\s*-\s*\d{3,6}$/, "").trim();
  const cleanCompany = cleanText(job.company_name);
  const cleanLocation = cleanText(job.location || "Remote");
  const langBadge = getLanguageBadge(job.language);
  const isDirectClientJob = job.source === "manual" || !!job.posted_by;
  const isRemote =
    cleanLocation.toLowerCase().includes("remote") ||
    cleanLocation.toLowerCase().includes("worldwide") ||
    cleanLocation.toLowerCase().includes("anywhere");

  const formatSalaryText = (min?: number | null, max?: number | null, currency: string = "USD") => {
    if (!min && !max) return "Competitive Industry Pay";
    const curr = currency || "USD";
    if (min && !max) return `From ${min.toLocaleString()} ${curr}`;
    if (!min && max) return `Up to ${max.toLocaleString()} ${curr}`;
    return `${min?.toLocaleString()} - ${max?.toLocaleString()} ${curr}`;
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/jobs/view/${job.seo_slug}` : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cleanTitle} at ${cleanCompany}`,
          text: `Check out this remote opportunity on CLIVORA ($0 Platform Fee): ${cleanTitle}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (url) {
      await navigator.clipboard.writeText(url);
      alert("Job link copied to clipboard!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl z-10"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Verified Fresh
                </span>
                {job.source && (
                  <span className="uppercase text-[10px] tracking-wider font-bold text-slate-400">
                    via {job.source}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleShare}
                  title="Share listing"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  title="Close preview"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Header section */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                    {cleanTitle}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Building2 className="h-4 w-4 text-teal-600" />
                    <span>{cleanCompany}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{cleanLocation}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold ${langBadge.className}`}>
                    <span>{langBadge.flag}</span>
                    <span>{langBadge.nativeLabel}</span>
                  </span>

                  {isDirectClientJob && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-teal-800 text-white px-2 py-0.5 text-[10px] font-black uppercase">
                      <ShieldCheck className="h-3 w-3 text-emerald-300" />
                      Direct Client
                    </span>
                  )}
                </div>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Compensation</div>
                  <div className="mt-1 text-sm font-bold text-emerald-700">
                    {formatSalaryText(job.salary_min, job.salary_max, job.currency)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Work Mode</div>
                  <div className="mt-1 text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-teal-600" />
                    {isRemote ? "100% Remote" : cleanLocation}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Contract Type</div>
                  <div className="mt-1 text-sm font-bold text-slate-900 capitalize">
                    {job.job_type ? job.job_type.replace("_", " ") : "Direct Contract"}
                  </div>
                </div>
              </div>

              {/* Skill Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Required Tech Stack & Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Zero-Fee Value Proposition Banner */}
              <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/80 to-emerald-50/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-950">
                      $0 Platform Fee via CLIVORA Connect
                    </h4>
                    <p className="text-xs text-teal-900/80 leading-relaxed">
                      Negotiate milestones directly. When you accept and invoice this client through Clivora, you keep 100% of your earnings. Zero deductions, zero take rates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Job Overview & Scope
                </div>
                <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line text-sm font-normal">
                  {job.description || "No full description provided. Click below to view the original posting."}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="border-t border-slate-200 bg-white p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <Link
                href={`/jobs/view/${job.seo_slug}`}
                className="text-xs font-semibold text-slate-500 hover:text-teal-700 flex items-center gap-1"
              >
                Open dedicated page
                <ArrowRight className="h-3 w-3" />
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {job.source_url && (
                  <a
                    href={job.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Direct ATS
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                <Link
                  href={`/app/connect?job_slug=${job.seo_slug}&job_title=${encodeURIComponent(cleanTitle)}`}
                  className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-teal-800 transition-all hover:shadow-md"
                >
                  <Send className="h-3.5 w-3.5" />
                  Apply ($0 Fee)
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

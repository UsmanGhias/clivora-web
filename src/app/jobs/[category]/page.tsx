import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { cleanText } from "@/lib/clean-text";
import { getJobExecutiveSummary } from "@/lib/job-formatter";
import { JobAdSenseSlot } from "@/components/ads/JobAdSenseSlot";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Globe,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 3600;

const CATEGORIES = [
  "software-development",
  "design",
  "devops-sysadmin",
  "data-science",
  "marketing",
  "product",
  "customer-support",
  "management",
  "general",
];

const EXCLUDED_TAGS = new Set([
  "hackernews",
  "who-is-hiring",
  "arbeitnow",
  "remotive",
  "source",
  "external",
]);

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

function formatTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!CATEGORIES.includes(category)) return {};

  const title = `${formatTitle(category)} Remote Jobs - $0 Fee | CLIVORA`;
  const description = `Find the best remote ${formatTitle(category)} jobs. Apply directly with $0 platform fees.`;

  return {
    title,
    description,
    alternates: { canonical: `${site.url}/jobs/${category}` },
    openGraph: { title, description },
  };
}

function formatSalary(min?: number, max?: number, currency: string = "USD") {
  if (!min && !max) return "Competitive Pay";
  const curr = currency || "USD";
  if (min && !max) return `From ${min.toLocaleString()} ${curr}`;
  if (!min && max) return `Up to ${max.toLocaleString()} ${curr}`;
  return `${min?.toLocaleString()} - ${max?.toLocaleString()} ${curr}`;
}

function getInitials(name: string): string {
  const clean = cleanText(name).trim();
  if (!clean) return "CL";
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function getAvatarGradient(name: string): string {
  const gradients = [
    "from-teal-500 to-emerald-600",
    "from-blue-600 to-cyan-600",
    "from-indigo-600 to-violet-600",
    "from-slate-700 to-slate-900",
    "from-emerald-600 to-teal-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return gradients[Math.abs(hash) % gradients.length];
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (!CATEGORIES.includes(category)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("connect_jobs")
    .select("*")
    .eq("is_public", true)
    .eq("status", "published")
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(50);

  const titleName = formatTitle(category);

  return (
    <main className="min-h-screen bg-slate-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all jobs
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {titleName} Remote Jobs <span className="text-teal-600"> -  $0 Fee</span>
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Browse remote opportunities in {titleName}. Apply directly, negotiate privately, and keep 100% of your earnings.
          </p>
        </div>

        <div className="space-y-4">
          {jobs && jobs.length > 0 ? (
            jobs.map((job, idx) => {
              const displayTags = (job.tags || [])
                .filter((t: string) => !EXCLUDED_TAGS.has(t.toLowerCase()))
                .slice(0, 4);

              const companyInitials = getInitials(job.company_name);
              const avatarGradient = getAvatarGradient(job.company_name);
              const isExternal = Boolean(job.source_url || (job.source && job.source !== "client" && job.source !== "clivora"));

              return (
                <React.Fragment key={job.id}>
                  <Link
                    href={`/jobs/view/${job.seo_slug}`}
                    className="group relative flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-teal-500/80 hover:shadow-md md:flex-row md:items-center"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGradient} text-base font-bold text-white shadow-xs`}
                      >
                        {companyInitials}
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-teal-700">
                            {cleanText(job.title)}
                          </h2>
                          {isExternal ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                              <Globe className="h-3 w-3 text-slate-500" />
                              Curated Remote
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-700 border border-teal-200/60">
                              <CheckCircle2 className="h-3 w-3 text-teal-600" />
                              CLIVORA Client &bull; $0 Fee
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <span>{cleanText(job.company_name)}</span>
                          <span className="text-slate-300">&bull;</span>
                          {isExternal ? (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Globe className="h-3 w-3 text-slate-400" />
                              Official Listing
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-medium">
                              <ShieldCheck className="h-3 w-3 text-teal-600" />
                              Direct Client Contact
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-0.5">
                            {getJobExecutiveSummary(job.description, 160)}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{cleanText(job.location)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 font-semibold text-slate-700">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                          </div>
                          {job.job_type && (
                            <div className="flex items-center gap-1 capitalize">
                              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                              <span>{job.job_type.replace("_", " ")}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {displayTags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {displayTags.map((tag: string) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                              >
                                {cleanText(tag)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-end gap-3 pt-2 md:pt-0">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-teal-50 px-4 py-2 text-xs font-bold text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                        Apply Role
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>

                  {/* Interleave In-Feed Native Ad every 5 jobs */}
                  {(idx + 1) % 5 === 0 && idx !== jobs.length - 1 && (
                    <JobAdSenseSlot
                      slotId="in-feed-category-slot"
                      format="in-feed"
                      className="my-3 shadow-2xs"
                    />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-3 text-base font-semibold text-slate-900">No jobs in this category</h3>
              <p className="mt-1 text-sm text-slate-500">
                Check back soon or explore all remote opportunities.
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-flex items-center gap-1 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Browse All Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

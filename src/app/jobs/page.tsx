import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
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
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Building2,
  CheckCircle2,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Remote Jobs Marketplace - $0 Platform Fee | CLIVORA",
  description:
    "Explore curated remote career opportunities and freelance contracts. Direct client relationships, milestone verification, and $0 platform commissions.",
  alternates: { canonical: `${site.url}/jobs` },
  openGraph: {
    title: "Remote Jobs Marketplace - $0 Platform Fee | CLIVORA",
    description:
      "Explore curated remote opportunities with direct client communication and zero platform fees.",
  },
};

const CATEGORIES = [
  { id: "software-development", label: "Software & Engineering" },
  { id: "sales", label: "Sales & Growth" },
  { id: "product", label: "Product Management" },
  { id: "design", label: "Design & Creative" },
  { id: "devops-sysadmin", label: "DevOps & Cloud" },
  { id: "data-science", label: "AI & Data Science" },
  { id: "marketing", label: "Marketing & Content" },
  { id: "finance-legal", label: "Finance & Legal" },
  { id: "management", label: "Project & Operations" },
  { id: "human-resources", label: "People & HR" },
  { id: "customer-support", label: "Customer Success" },
  { id: "general", label: "All Opportunities" },
];

const EXCLUDED_TAGS = new Set([
  "hackernews",
  "who-is-hiring",
  "arbeitnow",
  "remotive",
  "source",
  "external",
]);

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

export default async function JobsIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; page?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const q = sp?.q || "";
  const page = parseInt(sp?.page || "1", 10) || 1;
  const perPage = 20;

  const supabase = await createClient();
  let query = supabase
    .from("connect_jobs")
    .select("*", { count: "exact" })
    .eq("is_public", true)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,company_name.ilike.%${q}%`);
  }

  const { data: jobs, count } = await query.range((page - 1) * perPage, page * perPage - 1);
  const totalJobs = count || 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Marketplace Sub-Navigation Bridge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-2xl bg-slate-100/90 p-1 border border-slate-200/80 shadow-xs">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-xs"
            >
              <Briefcase className="h-3.5 w-3.5 text-teal-600" />
              Remote Jobs ({totalJobs}+)
            </Link>
            <Link
              href="/connect"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              Hire Talent
            </Link>
            <Link
              href="/app/connect"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-500" />
              Connect Hub
            </Link>
          </div>
        </div>

        {/* Top Announcement Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/90 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
            <span>FOUNDER LAUNCH: 100% Free Access & $0 Platform Fees</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Browse Remote Jobs <span className="text-teal-600"> -  $0 Fee</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600">
            Direct opportunities from high-growth companies and startups worldwide. 
            Negotiate directly, get paid on milestones, and keep 100% of what you earn.
          </p>

          {/* Quick Value Metrics */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur">
              <p className="text-xl font-bold text-slate-900">{totalJobs > 0 ? `${totalJobs}+` : "200+"}</p>
              <p className="text-xs font-medium text-slate-500">Active Roles</p>
            </div>
            <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 p-3 shadow-xs">
              <p className="text-xl font-bold text-teal-700">$0</p>
              <p className="text-xs font-medium text-teal-600">Platform Fees</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur">
              <p className="text-xl font-bold text-slate-900">Direct</p>
              <p className="text-xs font-medium text-slate-500">Client Contact</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur">
              <p className="text-xl font-bold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500">You Keep</p>
            </div>
          </div>
        </div>

        {/* Search & Category Pills */}
        <div className="mt-10 space-y-5">
          <form method="get" action="/jobs" className="mx-auto flex max-w-2xl items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search by role, tech stack, or company name..."
                className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === "general" ? "/jobs" : `/jobs/${cat.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Job Listings Grid */}
        <div className="mt-10 space-y-4">
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
                      {/* Company Initial Avatar */}
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
                          {job.category && (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                              {job.category.replace("-", " ")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <span>{cleanText(job.company_name)}</span>
                          <span className="text-slate-300">&bull;</span>
                          {isExternal ? (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Globe className="h-3 w-3 text-slate-400" />
                              Company Portal Opportunity
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

                        {/* Meta information */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span>{cleanText(job.location)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
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

                        {/* Filtered skill tags */}
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

                    {/* Apply CTA Button */}
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
                      slotId="in-feed-job-index-slot"
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
              <h3 className="mt-3 text-base font-semibold text-slate-900">No jobs found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try searching with different keywords or browse all categories.
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-flex items-center gap-1 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700"
              >
                Clear Search
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {count && count > perPage && (
          <div className="mt-10 flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/jobs?q=${q}&page=${page - 1}`}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                &larr; Previous Page
              </Link>
            )}
            {page * perPage < count && (
              <Link
                href={`/jobs?q=${q}&page=${page + 1}`}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                Next Page &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

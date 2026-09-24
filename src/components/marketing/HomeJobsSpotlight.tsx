import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JobListingCard, type JobCardData } from "@/components/jobs/JobListingCard";
import { JOB_LANGUAGES } from "@/lib/job-languages";
import { JOB_CATEGORIES } from "@/lib/job-categories";
import {
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

export async function HomeJobsSpotlight() {
  const supabase = await createClient();

  const { count } = await supabase
    .from("connect_jobs")
    .select("id", { count: "exact", head: true })
    .eq("is_public", true)
    .eq("status", "published");

  const totalCount = count || 6000;

  // Prioritize high-quality tech & developer roles in English with diverse companies
  const { data: techJobs } = await supabase
    .from("connect_jobs")
    .select(
      "id, title, company_name, company_domain, description, category, tags, salary_min, salary_max, currency, location, job_type, seo_slug, created_at, language"
    )
    .eq("is_public", true)
    .eq("status", "published")
    .eq("language", "en")
    .in("category", [
      "software-development",
      "product",
      "design",
      "devops-sysadmin",
      "data-science",
      "marketing",
    ])
    .order("created_at", { ascending: false })
    .limit(30);

  // Guarantee company diversity (no multiple cards from the same company)
  const seenCompanies = new Set<string>();
  const diverseJobs: JobCardData[] = [];
  for (const j of ((techJobs || []) as JobCardData[])) {
    const comp = (j.company_name || "").toLowerCase().trim();
    if (!comp || seenCompanies.has(comp)) continue;
    seenCompanies.add(comp);
    diverseJobs.push(j);
    if (diverseJobs.length >= 5) break;
  }

  // Fallback if needed
  let jobList = diverseJobs;
  if (jobList.length === 0) {
    const { data: fallback } = await supabase
      .from("connect_jobs")
      .select(
        "id, title, company_name, company_domain, description, category, tags, salary_min, salary_max, currency, location, job_type, seo_slug, created_at, language"
      )
      .eq("is_public", true)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(5);
    jobList = (fallback || []) as JobCardData[];
  }

  if (jobList.length === 0) return null;

  const firstJob = jobList[0];
  const otherJobs = jobList.slice(1);

  return (
    <section className="relative border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header with Live Badge */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-bold text-teal-800 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span>LIVE MARKETPLACE · VERIFIED REMOTE ROLES</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest Remote Jobs & Opportunities
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Apply directly with $0 platform fees. Keep 100% of your earnings with direct client contact and instant WhatsApp sharing.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-teal-600/20 transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
            >
              <span>Explore All Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Language Quick Access Strip */}
        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
            Browse by Language:
          </span>
          {JOB_LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={lang.code === "all" ? "/jobs" : `/jobs?lang=${lang.code}`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-teal-400 hover:bg-teal-50/80 hover:text-teal-900"
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
            </Link>
          ))}
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
            <ShieldCheck className="h-4 w-4 text-teal-600" />
            <span>Zero intermediary commissions</span>
          </div>
        </div>

        {/* Featured First Job Card (High Prominence) */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Spotlight Opportunity (All Details Visible)
            </p>
            <span className="text-xs text-slate-500 font-medium">100% Platform Cut Free</span>
          </div>
          <JobListingCard job={firstJob} isFeatured={true} />
        </div>

        {/* Subsequent Jobs Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {otherJobs.map((job) => (
            <JobListingCard key={job.id} job={job} />
          ))}
        </div>

        {/* Bottom Category Quick Navigation */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Popular Job Categories
            </h3>
            <Link href="/jobs" className="text-xs font-bold text-teal-700 hover:underline">
              View all 12 categories →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/jobs/${cat.id}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

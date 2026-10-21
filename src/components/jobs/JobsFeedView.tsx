"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { JobListingCard, type JobCardData } from "./JobListingCard";
import { JobDetailDrawer } from "./JobDetailDrawer";
import { Briefcase, Sparkles } from "lucide-react";

interface JobsFeedViewProps {
  jobs: JobCardData[];
  totalJobs: number;
}

export function JobsFeedView({ jobs, totalJobs }: JobsFeedViewProps) {
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSkillClick = (skill: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.set("tech", skill.toLowerCase().trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  };

  return (
    <>
      {/* Active Jobs Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 tracking-tight">
            {totalJobs.toLocaleString()} Verified Positions
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Marketplace
          </span>
        </div>

        <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1 font-medium">
          <Sparkles className="h-3.5 w-3.5 text-teal-600" />
          <span>$0 Platform Fees on all direct deals</span>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3.5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobListingCard
              key={job.id}
              job={job}
              onSelect={(j) => setSelectedJob(j)}
              onSkillClick={handleSkillClick}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900">
              No matching listings found
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try widening your filters, clearing your tech stack selection, or resetting the search keywords.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Quick Preview Drawer */}
      <JobDetailDrawer
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
}

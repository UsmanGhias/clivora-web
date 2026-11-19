"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Landmark,
  Lock,
  ArrowRight,
  Clock,
  Briefcase,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type MilestoneDetail = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  client_user_id: string;
  freelancer_user_id: string;
  proposal_id?: string;
  freelancer_name?: string;
  job_title?: string;
};

function EscrowCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const milestoneId = searchParams.get("milestone");

  const [milestone, setMilestone] = useState<MilestoneDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funding, setFunding] = useState(false);
  const [fundedSuccess, setFundedSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!milestoneId) {
      setLoading(false);
      setError("No milestone ID specified.");
      return;
    }

    async function fetchMilestone() {
      try {
        const supabase = createClient();
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr || !user) {
          router.push(`/login?next=/checkout/escrow?milestone=${milestoneId}`);
          return;
        }

        const { data: ms, error: msErr } = await supabase
          .from("connect_milestones")
          .select("id, title, amount, currency, status, created_at, client_user_id, freelancer_user_id, proposal_id, job_id")
          .eq("id", milestoneId)
          .maybeSingle();

        if (msErr || !ms) {
          setError("Milestone not found or you do not have permission to view it.");
          setLoading(false);
          return;
        }

        if (ms.client_user_id !== user.id) {
          setError("Only the hiring client can fund escrow for this contract.");
          setLoading(false);
          return;
        }

        let freelancerName = "Freelancer";
        if (ms.freelancer_user_id) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", ms.freelancer_user_id)
            .maybeSingle();
          if (prof?.name) freelancerName = prof.name;
        }

        let jobTitle = ms.title;
        if (ms.job_id) {
          const { data: jb } = await supabase
            .from("connect_jobs")
            .select("title")
            .eq("id", ms.job_id)
            .maybeSingle();
          if (jb?.title) jobTitle = jb.title;
        }

        setMilestone({
          ...ms,
          freelancer_name: freelancerName,
          job_title: jobTitle,
        });

        if (ms.status === "funded") {
          setFundedSuccess(true);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load escrow details");
      } finally {
        setLoading(false);
      }
    }

    void fetchMilestone();
  }, [milestoneId, router]);

  const handleFundEscrow = async () => {
    if (!milestoneId || funding) return;
    setFunding(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: fundErr } = await supabase.rpc("connect_transition_milestone", {
        p_milestone_id: milestoneId,
        p_status: "funded",
      });

      if (fundErr) {
        throw new Error(fundErr.message || "Failed to fund escrow");
      }

      setFundedSuccess(true);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Escrow deposit failed");
    } finally {
      setFunding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-text-secondary">Securing milestone escrow channel...</p>
      </div>
    );
  }

  if (error || !milestone) {
    return (
      <div className="mx-auto max-w-xl py-12 px-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-navy">Checkout Error</h1>
        <p className="mt-2 text-sm text-text-secondary">{error || "Unable to retrieve milestone checkout."}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/app/proposals"
            className="rounded-xl border border-border bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-slate-50 transition"
          >
            Back to Proposals
          </Link>
          <Link
            href="/app"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (fundedSuccess) {
    return (
      <div className="mx-auto max-w-lg py-16 px-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-2xl font-black tracking-tight text-navy">Escrow Successfully Funded</h1>
        <p className="mt-2 text-sm text-text-secondary">
          ${milestone.amount} {milestone.currency} is now locked in secure escrow for{" "}
          <strong className="text-navy">{milestone.freelancer_name}</strong>.
        </p>
        <p className="mt-2 text-xs text-text-muted">
          Your freelancer has been notified to commence work. Funds will remain protected until you review and approve deliverables.
        </p>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-left text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            14-Day Deterministic Review Active
          </div>
          <p className="mt-1 text-xs text-emerald-800">
            Once deliverables are submitted, you have 14 days to review or dispute before automated funds release.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/app/milestones"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition"
          >
            View Milestones
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/app/proposals"
            className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-slate-50 transition"
          >
            Back to Proposals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Landmark className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-navy sm:text-3xl">Fund Escrow & Confirm Hire</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Lock funds in protected escrow to authorize work with 0% platform take rate.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between border-b border-border/60 pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              <Clock className="h-3 w-3" />
              Pending Escrow Funding
            </span>
            <h2 className="mt-2 text-lg font-bold text-navy">{milestone.title}</h2>
            <p className="text-xs text-text-secondary">Project: {milestone.job_title}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-navy">
              ${milestone.amount}
            </p>
            <p className="text-xs font-medium text-text-muted">{milestone.currency}</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Freelancer Candidate</span>
            <span className="font-semibold text-navy">{milestone.freelancer_name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Milestone Status</span>
            <span className="font-mono text-xs font-bold uppercase text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
              {milestone.status}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">CLIVORA Platform Fee</span>
            <span className="font-bold text-emerald-600">$0.00 (0%)</span>
          </div>
          <div className="border-t border-dashed border-border pt-3 flex items-center justify-between text-base font-bold">
            <span className="text-navy">Total Escrow Deposit</span>
            <span className="text-primary text-xl">${milestone.amount} {milestone.currency}</span>
          </div>
        </div>
      </div>

      {/* Escrow Guarantee Grid */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-slate-50/70 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-bold text-navy">0% Platform Fee</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">
            Keep 100% of your budget working directly for your deliverables.
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-slate-50/70 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Lock className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-bold text-navy">Safe Escrow Lock</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">
            Funds remain secured and unreleased until you inspect and approve the work.
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-slate-50/70 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <Clock className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-bold text-navy">14-Day Review Buffer</p>
          <p className="mt-0.5 text-[11px] text-text-secondary">
            Deterministic auto-release with Day 10 and Day 13 client reminder notices.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleFundEscrow}
          disabled={funding || isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-base font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition disabled:opacity-50"
        >
          {funding || isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Securing Escrow Deposit...
            </>
          ) : (
            <>
              <Lock className="h-5 w-5" />
              Deposit ${milestone.amount} into Escrow
            </>
          )}
        </button>

        <p className="text-center text-xs text-text-muted">
          By depositing escrow, you activate the contract milestone under CLIVORA marketplace terms.
        </p>
      </div>
    </div>
  );
}

export default function EscrowCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <EscrowCheckoutContent />
    </Suspense>
  );
}

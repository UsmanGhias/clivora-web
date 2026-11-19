"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Loader2,
  Send,
  Check,
  ChevronRight,
  Filter,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Milestone = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  notes?: string;
  created_at: string;
  submitted_at?: string;
  funded_at?: string;
  released_at?: string;
  disputed_at?: string;
  client_user_id: string;
  freelancer_user_id: string;
  proposal_id?: string;
  job_id?: string;
  counterpart_name?: string;
};

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Submission modal state
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitNotes, setSubmitNotes] = useState("");

  // Dispute modal state
  const [disputingId, setDisputingId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");

  const loadMilestones = async () => {
    try {
      const supabase = createClient();
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type, role")
        .eq("id", user.id)
        .maybeSingle();

      const clientAccount = profile?.account_type === "client" || profile?.role === "client";
      setIsClient(clientAccount);

      const { data, error } = await supabase
        .from("connect_milestones")
        .select("*")
        .or(`client_user_id.eq.${user.id},freelancer_user_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        setActionError(error.message);
        return;
      }

      if (data) {
        // Resolve counterpart names
        const counterpartIds = [
          ...new Set(
            data.map((m) => (m.client_user_id === user.id ? m.freelancer_user_id : m.client_user_id))
          ),
        ];

        let nameMap: Record<string, string> = {};
        if (counterpartIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, name")
            .in("id", counterpartIds);
          if (profiles) {
            nameMap = Object.fromEntries(profiles.map((p) => [p.id, p.name]));
          }
        }

        setMilestones(
          data.map((m) => ({
            ...m,
            counterpart_name:
              nameMap[m.client_user_id === user.id ? m.freelancer_user_id : m.client_user_id] ||
              (m.client_user_id === user.id ? "Freelancer" : "Client"),
          }))
        );
      }
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMilestones();
  }, []);

  const handleApproveAndRelease = async (id: string) => {
    setActionBusyId(id);
    setActionError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("approve_and_release_milestone", {
        p_milestone_id: id,
      });
      if (error) throw error;
      await loadMilestones();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Release failed");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleSubmitDeliverable = async () => {
    if (!submittingId) return;
    setActionBusyId(submittingId);
    setActionError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("submit_milestone_deliverable", {
        p_milestone_id: submittingId,
        p_notes: submitNotes.trim(),
      });
      if (error) throw error;
      setSubmittingId(null);
      setSubmitNotes("");
      await loadMilestones();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setActionBusyId(null);
    }
  };

  const handleOpenDispute = async () => {
    if (!disputingId) return;
    setActionBusyId(disputingId);
    setActionError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("dispute_milestone", {
        p_milestone_id: disputingId,
        p_reason: disputeReason.trim(),
      });
      if (error) throw error;
      setDisputingId(null);
      setDisputeReason("");
      await loadMilestones();
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Dispute initiation failed");
    } finally {
      setActionBusyId(null);
    }
  };

  const filtered = milestones.filter((m) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return m.status === "pending_funding" || m.status === "pending";
    if (activeFilter === "funded") return m.status === "funded";
    if (activeFilter === "submitted") return m.status === "submitted";
    if (activeFilter === "released") return m.status === "released";
    if (activeFilter === "disputed") return m.status === "disputed";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_funding":
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/50">
            <Clock className="h-3 w-3" />
            Pending Escrow
          </span>
        );
      case "funded":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/50">
            <Lock className="h-3 w-3" />
            In Progress (Escrow Locked)
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200/50">
            <Clock className="h-3 w-3" />
            Under 14-Day Review
          </span>
        );
      case "released":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/50">
            <CheckCircle2 className="h-3 w-3" />
            Released & Paid
          </span>
        );
      case "disputed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200/50">
            <AlertTriangle className="h-3 w-3" />
            Disputed (Paused)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">Milestones & Escrow</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage contract deliverables, escrow funding, and deterministic 14-day auto-release with 0% platform fees.
          </p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
        {[
          { key: "all", label: "All Milestones" },
          { key: "pending", label: "Pending Escrow" },
          { key: "funded", label: "Active (Funded)" },
          { key: "submitted", label: "Under Review" },
          { key: "released", label: "Completed" },
          { key: "disputed", label: "Disputed" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold transition",
              activeFilter === tab.key
                ? "bg-navy text-white shadow-sm"
                : "bg-surface text-text-secondary hover:bg-slate-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <Landmark className="mx-auto h-10 w-10 text-text-muted" />
          <h2 className="mt-3 text-base font-bold text-navy">No milestones found</h2>
          <p className="mt-1 text-sm text-text-secondary">
            When proposals are accepted on CLIVORA, contract kickoff milestones appear here automatically.
          </p>
          <div className="mt-6">
            <Link
              href="/app/proposals"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition"
            >
              View Proposals
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => {
            const isClientParty = m.client_user_id === userId;
            const isFreelancerParty = m.freelancer_user_id === userId;
            const isBusy = actionBusyId === m.id;

            return (
              <div
                key={m.id}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(m.status)}
                      <span className="text-xs text-text-muted">
                        Created {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-navy">{m.title}</h2>
                    <p className="text-sm text-text-secondary">
                      {isClientParty ? "Freelancer" : "Client"}:{" "}
                      <strong className="text-navy">{m.counterpart_name}</strong>
                    </p>
                    {m.notes && (
                      <p className="text-xs text-text-muted italic bg-slate-50 p-2.5 rounded-xl border border-border/60">
                        {m.notes}
                      </p>
                    )}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black text-navy">
                      ${m.amount}{" "}
                      <span className="text-xs font-semibold text-text-muted uppercase">{m.currency}</span>
                    </p>
                    <p className="text-xs font-semibold text-emerald-600 mt-0.5">$0.00 Platform Fee (0%)</p>
                  </div>
                </div>

                {/* Status Guidance Banner */}
                {m.status === "submitted" && m.submitted_at && (
                  <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/60 p-3 text-xs text-purple-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600 shrink-0" />
                      <span>
                        Deliverable submitted on {new Date(m.submitted_at).toLocaleDateString()}. Client has 14 days to review.
                      </span>
                    </div>
                    <span className="font-bold text-purple-700">14-Day Auto-Release Active</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 border-t border-border/60 pt-4 flex flex-wrap items-center justify-end gap-2.5">
                  {/* Client: Fund Escrow on pending_funding */}
                  {isClientParty && (m.status === "pending_funding" || m.status === "pending") && (
                    <Link
                      href={`/checkout/escrow?milestone=${m.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Fund Escrow (${m.amount})
                    </Link>
                  )}

                  {/* Freelancer: Submit Deliverables on funded */}
                  {isFreelancerParty && m.status === "funded" && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setSubmittingId(m.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Submit Deliverables
                    </button>
                  )}

                  {/* Client: Approve and Release on submitted or funded */}
                  {isClientParty && (m.status === "submitted" || m.status === "funded") && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleApproveAndRelease(m.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
                    >
                      {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Approve & Release Funds
                    </button>
                  )}

                  {/* Dispute: Either party on funded or submitted */}
                  {(m.status === "funded" || m.status === "submitted") && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => setDisputingId(m.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Dispute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deliverable Submission Modal */}
      {submittingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-navy">Submit Milestone Deliverables</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Describe your completed work, share links to assets, or provide notes for the client review.
            </p>
            <textarea
              rows={4}
              value={submitNotes}
              onChange={(e) => setSubmitNotes(e.target.value)}
              placeholder="e.g. Completed initial design sprint. Source files uploaded to repository..."
              className="mt-4 w-full rounded-xl border border-border p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSubmittingId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitDeliverable}
                disabled={actionBusyId !== null}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition disabled:opacity-50"
              >
                {actionBusyId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Submit for 14-Day Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {disputingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-rose-700">Open Milestone Dispute</h2>
            <p className="mt-1 text-xs text-text-secondary">
              Opening a dispute immediately pauses the 14-day auto-release timer and requests arbitration.
            </p>
            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="State the reason for the dispute or revision disagreement..."
              className="mt-4 w-full rounded-xl border border-border p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDisputingId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenDispute}
                disabled={actionBusyId !== null || !disputeReason.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-50"
              >
                {actionBusyId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                Confirm Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

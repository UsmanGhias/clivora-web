"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Link2,
  Send,
  ShieldAlert,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CONNECT_CREDIT_COSTS, parseConnectCreditError } from "@/lib/connect-credits";
import { cn } from "@/lib/utils";

type NeedDetail = {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  budget_band: string | null;
  client_user_id: string;
};

const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

function detectUrls(text: string): string[] {
  return Array.from(new Set((text.match(URL_REGEX) ?? []).map((u) => u.trim())));
}

export function ConnectApplyPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const needId = params.get("needId") ?? "";
  const peerId = params.get("to") ?? "";
  const mode = (params.get("mode") ?? "proposal") as "proposal" | "contact";

  const [loading, setLoading] = useState(true);
  const [need, setNeed] = useState<NeedDetail | null>(null);
  const [amount, setAmount] = useState("");
  const [timelineDays, setTimelineDays] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [approach, setApproach] = useState("");
  const [milestones, setMilestones] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [planOk, setPlanOk] = useState(false);

  const combinedText = useMemo(
    () => [coverLetter, approach, portfolioLinks, milestones].join("\n"),
    [coverLetter, approach, portfolioLinks, milestones],
  );
  const foundUrls = useMemo(() => detectUrls(combinedText), [combinedText]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace(`/login?next=/app/connect/apply?needId=${encodeURIComponent(needId)}&mode=${mode}`);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_plan, account_type, is_blocked, is_restricted")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.is_blocked) {
        router.replace("/blocked");
        return;
      }
      const p = (profile?.subscription_plan ?? "free").toLowerCase();
      const plus = p === "pro_plus" || p === "plus" || p === "proplus";
      if (!plus) {
        router.replace("/pro?plan=pro_plus");
        return;
      }
      if ((profile?.account_type ?? "").toLowerCase() === "client" && mode === "proposal") {
        setError("Clients review proposals — freelancers submit them.");
      }
      setPlanOk(true);

      if (needId) {
        const { data } = await supabase
          .from("connect_need_posts")
          .select("id, title, summary, skills, budget_band, client_user_id")
          .eq("id", needId)
          .maybeSingle();
        if (data) {
          setNeed({
            id: data.id,
            title: data.title ?? "",
            summary: data.summary ?? "",
            skills: Array.isArray(data.skills)
              ? data.skills
              : String(data.skills ?? "")
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
            budget_band: data.budget_band,
            client_user_id: data.client_user_id,
          });
        }
      }
      setLoading(false);
    })();
  }, [needId, mode, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!planOk) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      return;
    }

    const toUserId = peerId || need?.client_user_id;
    if (!toUserId) {
      setError("Missing recipient. Open this page from a Connect job card.");
      setBusy(false);
      return;
    }

    if (mode === "contact") {
      if (coverLetter.trim().length < 20) {
        setError("Add a short introduction (at least a couple of sentences).");
        setBusy(false);
        return;
      }
      const contactMessage = [
        coverLetter.trim(),
        approach.trim() ? `\n\nWhy this job:\n${approach.trim()}` : "",
        timelineDays ? `\n\nAvailable to start in: ${timelineDays} day(s)` : "",
        portfolioLinks.trim() ? `\n\nProof / links:\n${portfolioLinks.trim()}` : "",
        "\n\n— CLIVORA Contact request (emails unlock after mutual accept)",
      ]
        .filter(Boolean)
        .join("");
      const { error: err } = await supabase.rpc("connect_send_request", {
        p_to_user_id: toUserId,
        p_message: contactMessage.trim(),
        p_target_need_id: needId || null,
      });
      setBusy(false);
      if (err) {
        setError(parseConnectCreditError(err).message);
        return;
      }
      setDone(true);
      return;
    }

    const messageParts = [
      coverLetter.trim(),
      approach.trim() ? `\n\nApproach:\n${approach.trim()}` : "",
      milestones.trim() ? `\n\nMilestones:\n${milestones.trim()}` : "",
      portfolioLinks.trim() ? `\n\nLinks:\n${portfolioLinks.trim()}` : "",
      foundUrls.length
        ? `\n\n[Note: URLs included — CLIVORA may analyze links and remove listings that violate trust & safety.]`
        : "",
    ]
      .filter(Boolean)
      .join("");

    if (messageParts.trim().length < 40) {
      setError("Please share a stronger proposal (at least a few sentences of detail).");
      setBusy(false);
      return;
    }

    const { error: err } = await supabase.rpc("connect_submit_proposal", {
      p_to_user_id: toUserId,
      p_need_id: needId || null,
      p_amount: amount ? Number(amount) : 0,
      p_currency: "USD",
      p_timeline_days: timelineDays ? Number(timelineDays) : null,
      p_message: messageParts.trim(),
    });
    setBusy(false);
    if (err) {
      setError(parseConnectCreditError(err).message);
      return;
    }
    setDone(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-secondary">
        Loading application…
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-navy">
          {mode === "contact" ? "Contact request sent" : "Proposal submitted"}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          (−{CONNECT_CREDIT_COSTS[mode === "contact" ? "contact" : "proposal"]} Connect credit)
          The client can review your details privately. Contact info unlocks only after mutual
          acceptance.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/app/proposals"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            View proposals
          </Link>
          <Link
            href="/app/connect"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-navy"
          >
            Back to Connect
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <Link
          href="/app/connect"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Connect
        </Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
          {mode === "contact" ? "Contact the client" : "Submit a proposal"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          {mode === "contact"
            ? "Send a private Connect request. Emails unlock only after both sides accept. Use Submit proposal when you have a priced offer."
            : "Share a complete pitch with scope, timeline, milestones, and proof of fit — not just a one-line hello."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          {need && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">Applying to</p>
              <p className="mt-1 font-display text-lg font-bold text-navy">{need.title}</p>
              <p className="mt-2 text-sm text-text-secondary line-clamp-4">{need.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {need.budget_band && (
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy">
                    {need.budget_band}
                  </span>
                )}
                {need.skills.slice(0, 6).map((s) => (
                  <span key={s} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-navy">
              {mode === "contact" ? "Introduction *" : "Cover letter *"}
            </span>
            <textarea
              required
              rows={mode === "contact" ? 5 : 6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={
                mode === "contact"
                  ? "Who you are, why this job fits, and one relevant win…"
                  : "Why you're the right fit, relevant experience, and how you'll deliver…"
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-navy">
              {mode === "contact" ? "Why this job / fit" : "Your approach"}
            </span>
            <textarea
              rows={4}
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder={
                mode === "contact"
                  ? "What you'd clarify on a call, questions, or how you'd help…"
                  : "Phases, tools, communication cadence…"
              }
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>

          {mode === "proposal" && (
            <label className="block">
              <span className="text-sm font-semibold text-navy">Suggested milestones</span>
              <textarea
                rows={3}
                value={milestones}
                onChange={(e) => setMilestones(e.target.value)}
                placeholder={"1. Discovery & wireframes\n2. Build & review\n3. Launch & handoff"}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
          )}

          {mode === "contact" && (
            <label className="block">
              <span className="text-sm font-semibold text-navy">Days until you can start</span>
              <input
                type="number"
                min={0}
                step="1"
                value={timelineDays}
                onChange={(e) => setTimelineDays(e.target.value)}
                placeholder="e.g. 3"
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
          )}

          {mode === "proposal" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-navy">Proposed amount (USD)</span>
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2500"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-navy">Timeline (days)</span>
                <input
                  type="number"
                  min={1}
                  step="1"
                  value={timelineDays}
                  onChange={(e) => setTimelineDays(e.target.value)}
                  placeholder="e.g. 21"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                />
              </label>
            </div>
          )}

          <label className="block">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
              <Link2 className="h-4 w-4" />
              Portfolio / reference links
            </span>
            <textarea
              rows={3}
              value={portfolioLinks}
              onChange={(e) => setPortfolioLinks(e.target.value)}
              placeholder="https://… (optional — one per line)"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>

          {foundUrls.length > 0 && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">URL safety notice</p>
                <p className="mt-1 text-amber-900/90">
                  We detected {foundUrls.length} link{foundUrls.length === 1 ? "" : "s"}. CLIVORA may
                  analyze shared URLs for phishing, spam, or policy abuse. Profiles or posts that
                  share harmful links can be removed and accounts restricted.
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-error/10 px-3 py-2 text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={cn(
              "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 sm:w-auto",
              busy && "opacity-70",
            )}
          >
            <Send className="h-4 w-4" />
            {busy
              ? "Sending…"
              : mode === "contact"
                ? `Send contact (−${CONNECT_CREDIT_COSTS.contact} credit)`
                : `Submit proposal (−${CONNECT_CREDIT_COSTS.proposal} credit)`}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-navy">
              <FileText className="h-4 w-4 text-primary" />
              What great proposals include
            </p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>• Clear understanding of the brief</li>
              <li>• Relevant past work (links welcome)</li>
              <li>• Realistic timeline & budget</li>
              <li>• Milestone plan the client can approve</li>
              <li>• No spam — quality over speed</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-5">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Trust & privacy
            </p>
            <p className="mt-2 text-sm text-amber-950/90">
              Contact details unlock only after mutual acceptance. Sharing phone/email in the pitch
              may be filtered. Malicious URLs can trigger profile removal.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

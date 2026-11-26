import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractEmailFromText(text: string): string | null {
  if (!text) return null;
  const matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (!matches) return null;
  const filtered = matches.filter((e) => {
    const lower = e.toLowerCase();
    return (
      !lower.includes("ycombinator") &&
      !lower.includes("example.com") &&
      !lower.includes("w3.org") &&
      !lower.includes("remotive") &&
      !lower.includes("arbeitnow") &&
      !lower.includes("sentry") &&
      !lower.includes(".png") &&
      !lower.includes(".jpg")
    );
  });
  return filtered.length > 0 ? filtered[0].toLowerCase().trim() : null;
}

async function resolveAuthenticatedUser(request: Request) {
  const supabase = await createClient();
  const {
    data: { user: cookieUser },
  } = await supabase.auth.getUser();
  if (cookieUser) return cookieUser;

  const authHeader = request.headers.get("authorization") ?? "";
  if (/^bearer\s+/i.test(authHeader)) {
    const token = authHeader.replace(/^bearer\s+/i, "").trim();
    if (token) {
      const tokenClient = createServiceClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const {
        data: { user: bearerUser },
      } = await tokenClient.auth.getUser();
      if (bearerUser) return bearerUser;
    }
  }
  return null;
}

/**
 * POST /api/connect/notify-client-proposal
 * Notifies hiring clients of submitted proposals. Never discloses client emails or
 * magic review tokens back to the submitting applicant.
 */
export async function POST(request: Request) {
  try {
    const user = await resolveAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      proposalId?: string;
      jobId?: string;
      toUserId?: string;
      companyName?: string;
      amount?: number;
      timelineDays?: number;
      pitchMessage?: string;
      jobTitle?: string;
    };

    const proposalId = body.proposalId?.trim();
    if (!proposalId) {
      return NextResponse.json({ error: "missing_proposal_id" }, { status: 400 });
    }

    let adminCfg: { url: string; serviceRoleKey: string };
    try {
      adminCfg = requireAdminServiceConfig();
    } catch {
      return NextResponse.json({ error: "notification_service_unavailable" }, { status: 503 });
    }

    const adminDb = createServiceClient(adminCfg.url, adminCfg.serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Verify caller ownership of proposal
    const { data: existingProposal, error: proposalErr } = await adminDb
      .from("connect_proposals")
      .select("id, from_user_id, to_user_id, job_id, review_token, amount, timeline_days, message")
      .eq("id", proposalId)
      .maybeSingle();

    if (proposalErr || !existingProposal) {
      return NextResponse.json({ error: "proposal_not_found" }, { status: 404 });
    }

    if (existingProposal.from_user_id !== user.id) {
      return NextResponse.json({ error: "forbidden_proposal_access" }, { status: 403 });
    }

    const effectiveJobId = body.jobId || existingProposal.job_id || null;
    const effectiveToUserId = body.toUserId || existingProposal.to_user_id || null;
    const reviewToken =
      typeof existingProposal.review_token === "string" && existingProposal.review_token.trim()
        ? existingProposal.review_token.trim()
        : randomUUID();
    const reviewUrl = `https://clivora.io/connect/review?token=${encodeURIComponent(reviewToken)}`;

    let targetEmail: string | null = null;
    let targetName: string = body.companyName?.trim() || "";
    let resolvedTitle: string = body.jobTitle?.trim() || "";
    let externalSourceUrl: string | null = null;

    if (effectiveToUserId && effectiveToUserId !== "00000000-0000-0000-0000-000000000000") {
      const { data: clientProfile } = await adminDb
        .from("profiles")
        .select("email, name")
        .eq("id", effectiveToUserId)
        .maybeSingle();

      if (clientProfile?.email) {
        targetEmail = clientProfile.email.trim().toLowerCase();
        if (!targetName) targetName = clientProfile.name || "Client";
      }
    }

    let isJobUnclaimed = false;
    let jobClaimToken: string | null = null;

    if (effectiveJobId) {
      const { data: jobRow } = await adminDb
        .from("connect_jobs")
        .select("id, title, company_name, company_email, description, source_url, posted_by, claimed_by, claim_token")
        .eq("id", effectiveJobId)
        .maybeSingle();

      if (jobRow) {
        if (!resolvedTitle) resolvedTitle = jobRow.title;
        if (!targetName && jobRow.company_name) targetName = jobRow.company_name;
        externalSourceUrl = jobRow.source_url || null;
        isJobUnclaimed = !jobRow.claimed_by && !jobRow.posted_by;
        jobClaimToken = jobRow.claim_token || null;

        if (isJobUnclaimed && !jobClaimToken) {
          jobClaimToken = randomUUID().replace(/-/g, "");
          const { error: claimErr } = await adminDb
            .from("connect_jobs")
            .update({ claim_token: jobClaimToken })
            .eq("id", effectiveJobId);
          if (claimErr) {
            throw new Error(`Failed to persist claim token: ${claimErr.message}`);
          }
        }

        if (!targetEmail && jobRow.posted_by) {
          const { data: directClientProfile } = await adminDb
            .from("profiles")
            .select("email, name")
            .eq("id", jobRow.posted_by)
            .maybeSingle();
          if (directClientProfile?.email) {
            targetEmail = directClientProfile.email.trim().toLowerCase();
            if (!targetName) targetName = directClientProfile.name || "Client";
          }
        }

        if (!targetEmail) {
          if (jobRow.company_email && jobRow.company_email.includes("@")) {
            targetEmail = jobRow.company_email.trim().toLowerCase();
          } else if (jobRow.description) {
            const extracted = extractEmailFromText(jobRow.description);
            if (extracted) {
              targetEmail = extracted;
              const { error: emailUpdErr } = await adminDb
                .from("connect_jobs")
                .update({ company_email: extracted })
                .eq("id", effectiveJobId);
              if (emailUpdErr) {
                console.warn("[notify-client-proposal] company_email backfill failed:", emailUpdErr.message);
              }
            }
          }
        }
      }
    }

    const { error: propUpdErr } = await adminDb
      .from("connect_proposals")
      .update({
        review_token: reviewToken,
        job_id: effectiveJobId,
        client_email: targetEmail,
        client_name: targetName || null,
      })
      .eq("id", proposalId)
      .eq("from_user_id", user.id);

    if (propUpdErr) {
      throw new Error(`Failed to bind proposal notification state: ${propUpdErr.message}`);
    }

    const { data: freelancerProfile } = await adminDb
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    const freelancerName = freelancerProfile?.name || "CLIVORA Freelancer";
    let emailDispatched = false;
    let emailStatus = "no_email_available";

    if (targetEmail && targetEmail.includes("@")) {
      try {
        const claimUrl =
          jobClaimToken && effectiveJobId
            ? `https://clivora.io/connect/claim?token=${encodeURIComponent(jobClaimToken)}&job=${encodeURIComponent(effectiveJobId)}`
            : `https://clivora.io/connect/jobs/${encodeURIComponent(effectiveJobId ?? "")}`;

        const emailPayload = isJobUnclaimed
          ? {
              to: targetEmail,
              subject: `Your "${resolvedTitle || "Open Role"}" role is live on CLIVORA (Applicants awaiting review)`,
              purpose: "job_claim",
              companyName: targetName || "Hiring Team",
              jobTitle: resolvedTitle || "Open Role",
              claimUrl,
            }
          : {
              to: targetEmail,
              subject: `New $0-Fee Proposal for "${resolvedTitle || "Your Project"}" from ${freelancerName}`,
              purpose: "proposal_received",
              freelancerName,
              companyName: targetName || "Hiring Team",
              jobTitle: resolvedTitle || "Open Role",
              amount: Number(body.amount ?? existingProposal.amount ?? 0),
              timelineDays: Number(body.timelineDays ?? existingProposal.timeline_days ?? 7),
              pitchMessage: body.pitchMessage || existingProposal.message || "",
              reviewUrl,
            };

        const emailRes = await fetch(`${adminCfg.url}/functions/v1/send-clivora-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminCfg.serviceRoleKey}`,
          },
          body: JSON.stringify(emailPayload),
        });

        const resData = await emailRes.json().catch(() => ({}));
        if (emailRes.ok) {
          emailDispatched = true;
          emailStatus = "sent";
        } else {
          console.error("[notify-client-proposal] Edge email error:", resData);
          emailStatus = `failed: ${resData.error || emailRes.status}`;
        }
      } catch (err) {
        console.error("[notify-client-proposal] Network email error:", err);
        emailStatus = "network_error";
      }
    }

    return NextResponse.json({
      ok: true,
      emailDispatched,
      emailStatus,
      externalSourceUrl,
    });
  } catch (error) {
    console.error("[notify-client-proposal]", error);
    return NextResponse.json({ error: "notification_failed" }, { status: 500 });
  }
}

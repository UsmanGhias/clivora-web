import { NextRequest } from "next/server";
import { callGemini, sanitizeDashes } from "@/lib/gemini";
import { loadPlatformSnapshot } from "@/lib/admin-platform";
import { adminErrorResponse, adminJson, requireAdminRequest } from "@/lib/admin-auth";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const SYSTEM_ARCHITECT_PROMPT = `You are the Lead System Architect & Deep Diagnostics AI for CLIVORA (https://clivora.io).
You report directly to Usman Ghias (Founder & Lead Architect, portfolio: https://usmanghias.co.uk).

Your Core Mandate:
Perform deep-dive internal bug detection, observability log auditing, and distributed systems diagnosis across the entire CLIVORA platform. 
You identify hidden root causes, data integrity violations, sync conflicts, and silent failures before they impact users.

System Architecture Context:
1. Web Layer: Next.js 15 (App Router, Tailwind CSS, TypeScript) on Vercel.
2. Mobile Layer: Flutter 3.44 Dart with offline-first SQLite/Drift sync outbox for iOS & Android.
3. Database: Supabase PostgreSQL (project: jtzjwgovqczlccyeujhq) with strict Row Level Security (RLS).
4. Edge Functions: Deno runtime handling transactional email dispatch (send-clivora-email) via Hostinger/Brevo SMTP with rate limits and URL whitelisting.
5. Marketplace Core: 0% platform fee model. Freelancers keep 100% of their earnings.
6. Absolute Rule: Zero Odoo module installations. No CRM, Sales, or Account addons in any Odoo database. All CRM and lead storage is strictly in Supabase/PostgreSQL or native base res.partner.

Formatting Directives:
1. NEVER use em dashes (-) or en dashes (-). Use hyphens (-), colons (:), commas (,), or parentheses. Real writing alternates short and long sentences naturally.
2. Direct Technical Precision: State exact numbers, table names, anomaly IDs, and root cause mechanics. Never invent metrics.
3. Structure Responses with Clear Headings:
   - System Health Assessment
   - Detected Bugs & Integrity Anomalies (with exact causes and file/line locations)
   - Observability & Log Pipeline Health
   - Production Remediation Steps (SQL DDL and code diffs)
4. Tone: Senior Distributed Systems Architect speaking to a technical founder. Crisp, analytical, and respectful of engineering reality.`;

export async function POST(req: NextRequest) {
  try {
    // 1. Always authorize admin caller (no environment bypass)
    await requireAdminRequest(req, { requireAal2: false });

    const body = await req.json();
    const { message, messages } = body as {
      message?: string;
      messages?: Array<{ role: string; content: string }>;
    };

    if (!message && (!messages || messages.length === 0)) {
      return adminJson({ error: "Missing message query" }, { status: 400 });
    }

    // 2. Fetch live ground-truth telemetry
    let snapshot = null;
    try {
      snapshot = await loadPlatformSnapshot();
    } catch (e) {
      console.warn("[Admin AI] Snapshot fetch error:", e);
    }

    // 3. Fetch public live job count directly via REST
    let liveJobCount = 7406;
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/connect_jobs?select=id&limit=1`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Range: "0-0",
          Prefer: "count=exact",
        },
        cache: "no-store",
      });
      const range = res.headers.get("content-range");
      const match = range?.match(/\/(\d+)$/);
      if (match) liveJobCount = Number(match[1]);
    } catch (_) {}

    // 4. Analyze internal bugs and integrity anomalies from live data
    const rawProposals = snapshot?.proposals ?? [];
    const zeroAmountProposals = rawProposals.filter((p) => {
      const val = Number(p.amount ?? 0);
      return val <= 0;
    });

    const rawEvents = snapshot?.events ?? [];
    const emptyPayloadEvents = rawEvents.filter((e) => {
      const payload = typeof e.payload === "string" ? e.payload.trim() : JSON.stringify(e.payload || {});
      return !payload || payload === "{}" || payload === "null" || payload === '""';
    });

    const rawInvoices = snapshot?.invoices ?? [];
    const draftInvoices = rawInvoices.filter((i) => i.status === "draft");

    const telemetryContext = {
      timestamp: new Date().toISOString(),
      liveJobsCount: liveJobCount,
      overview: snapshot?.overview ?? {
        totalUsers: 3140,
        freelancers: 263,
        clients: 2633,
        totalRevenue: "$0 (0% platform fee model)",
      },
      proposals: {
        total: rawProposals.length,
        zeroAmountCount: zeroAmountProposals.length,
        zeroAmountSampleIds: zeroAmountProposals.slice(0, 5).map((p) => p.id),
      },
      invoices: {
        total: rawInvoices.length,
        draftCount: draftInvoices.length,
      },
      observability: {
        totalEventsCaptured: rawEvents.length,
        emptyPayloadCount: emptyPayloadEvents.length,
        emptyPayloadSampleIds: emptyPayloadEvents.slice(0, 5).map((e) => e.id),
      },
      supportTickets: snapshot?.tickets ?? 0,
      databaseTables: [
        { name: "connect_jobs", description: "Public remote jobs curated and employer-posted", rls: "Public read, admin write" },
        { name: "connect_proposals", description: "Freelancer bids on connect jobs and needs", rls: "Owner freelancer read/write, client review via token" },
        { name: "connect_milestones", description: "Contract milestones and two-phase escrow deposits with 14-day auto-release", rls: "Client/freelancer participant isolation" },
        { name: "connect_profiles", description: "Freelancer public contractor profiles", rls: "Public listed read, owner write" },
        { name: "crm_invoices", description: "Tax-compliant milestone and time invoices", rls: "Owner write, public share via signed token" },
        { name: "crm_customers", description: "Freelancer client address book", rls: "Owner isolation only" },
        { name: "clivora_events", description: "Audit trail and security events", rls: "Owner read, service-role insert" },
        { name: "email_send_log", description: "Rate limit tracker for transactional emails", rls: "Service role only" },
        { name: "crm_sync_conflicts", description: "Mobile SQLite/Drift sync conflicts and merge errors", rls: "Owner isolation only" },
      ],
      recentProposals: rawProposals.slice(0, 5).map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        created_at: p.created_at,
      })),
      recentEvents: rawEvents.slice(0, 5).map((e) => ({
        id: e.id,
        type: e.eventType,
        email: e.userEmail,
        createdAt: e.createdAt,
      })),
    };

    // 5. Construct conversation turns
    const conversationHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    const systemInstructionWithTelemetry = `${SYSTEM_ARCHITECT_PROMPT}\n\nLIVE SYSTEM TELEMETRY & DIAGNOSTICS PAYLOAD:\n\`\`\`json\n${JSON.stringify(telemetryContext, null, 2)}\n\`\`\``;

    if (messages && messages.length > 0) {
      for (const m of messages.slice(-10)) {
        conversationHistory.push({
          role: m.role === "assistant" || m.role === "model" ? "model" : "user",
          parts: [{ text: m.content }],
        });
      }
    } else if (message) {
      conversationHistory.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

    // 6. Query Gemini API
    const reply = await callGemini({
      contents: conversationHistory,
      systemInstruction: systemInstructionWithTelemetry,
      maxOutputTokens: 1400,
      temperature: 0.25,
    });

    const safeReply = reply
      ? sanitizeDashes(reply)
      : "The AI Advisor could not generate a response. Please verify that your Gemini API key is configured.";

    return adminJson({
      ok: true,
      reply: safeReply,
      telemetry: telemetryContext,
    });
  } catch (error) {
    return adminErrorResponse(error, "Failed to generate admin AI advisor diagnosis");
  }
}

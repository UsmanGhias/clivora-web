import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://jtzjwgovqczlccyeujhq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

type CrmAggregates = {
  customers: number;
  projects: number;
  activeProjects: number;
  invoices: number;
  paidInvoices: number;
  draftInvoices: number;
  overdueInvoices: number;
  paidTotal: number;
  unpaidTotal: number;
};

async function loadCrmAggregates(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerUid: string,
): Promise<CrmAggregates> {
  const empty: CrmAggregates = {
    customers: 0,
    projects: 0,
    activeProjects: 0,
    invoices: 0,
    paidInvoices: 0,
    draftInvoices: 0,
    overdueInvoices: 0,
    paidTotal: 0,
    unpaidTotal: 0,
  };
  try {
    const [customers, projects, invoices] = await Promise.all([
      supabase
        .from("crm_customers")
        .select("id", { count: "exact", head: true })
        .eq("owner_uid", ownerUid),
      supabase
        .from("crm_projects")
        .select("id, status")
        .eq("owner_uid", ownerUid)
        .limit(500),
      supabase
        .from("crm_invoices")
        .select("id, status, total, due_date")
        .eq("owner_uid", ownerUid)
        .limit(500),
    ]);

    const projectRows = projects.data ?? [];
    const invoiceRows = invoices.data ?? [];
    const now = Date.now();

    let paidTotal = 0;
    let unpaidTotal = 0;
    let paidInvoices = 0;
    let draftInvoices = 0;
    let overdueInvoices = 0;

    for (const inv of invoiceRows) {
      const st = (inv.status || "").toLowerCase();
      const total = Number(inv.total) || 0;
      if (st === "paid") {
        paidInvoices += 1;
        paidTotal += total;
      } else if (st === "draft") {
        draftInvoices += 1;
      } else {
        unpaidTotal += total;
        if (inv.due_date && new Date(inv.due_date).getTime() < now && st !== "void") {
          overdueInvoices += 1;
        }
      }
    }

    return {
      customers: customers.count ?? 0,
      projects: projectRows.length,
      activeProjects: projectRows.filter((p) => {
        const st = (p.status || "").toLowerCase();
        return st && !st.includes("complet") && st !== "cancelled" && st !== "canceled";
      }).length,
      invoices: invoiceRows.length,
      paidInvoices,
      draftInvoices,
      overdueInvoices,
      paidTotal,
      unpaidTotal,
    };
  } catch {
    return empty;
  }
}

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function buildCrmTip(query: string, agg: CrmAggregates): string {
  const q = query.toLowerCase();
  const lines: string[] = [];

  if (q.includes("overdue") || q.includes("late") || q.includes("collect")) {
    lines.push(
      agg.overdueInvoices > 0
        ? `You have ${agg.overdueInvoices} overdue invoice(s) totaling about ${formatMoney(agg.unpaidTotal)} unpaid overall. Prioritize follow-ups on the oldest due dates.`
        : `No overdue invoices detected in CRM. You have ${agg.invoices} invoice(s) total (${agg.paidInvoices} paid).`,
    );
  } else if (q.includes("bill") || q.includes("invoice") || q.includes("revenue") || q.includes("earn")) {
    lines.push(
      `CRM snapshot: ${agg.invoices} invoices · ${agg.paidInvoices} paid (${formatMoney(agg.paidTotal)}) · ${agg.draftInvoices} drafts · ~${formatMoney(agg.unpaidTotal)} still open.`,
    );
  } else if (q.includes("client") || q.includes("customer")) {
    lines.push(
      `You have ${agg.customers} CRM client(s) and ${agg.activeProjects} active project(s) of ${agg.projects} total.`,
    );
  } else if (q.includes("project")) {
    lines.push(
      `${agg.activeProjects} active project(s) out of ${agg.projects}. Keep statuses updated so reports stay accurate.`,
    );
  } else {
    lines.push(
      `Quick CRM tip from your data: ${agg.customers} clients · ${agg.projects} projects (${agg.activeProjects} active) · ${agg.invoices} invoices (${agg.paidInvoices} paid, ${formatMoney(agg.paidTotal)} collected).`,
    );
    if (agg.overdueInvoices > 0) {
      lines.push(`Focus next: ${agg.overdueInvoices} overdue invoice(s) need follow-up.`);
    } else if (agg.draftInvoices > 0) {
      lines.push(`Focus next: finish and send ${agg.draftInvoices} draft invoice(s).`);
    } else {
      lines.push("Focus next: log time or add a project milestone so your next invoice is ready.");
    }
  }

  lines.push(
    "Cloud AI is offline (no LLM key). These numbers come from your Supabase CRM. For richer offline AI, use the Android app.",
  );
  return lines.join("\n\n");
}

async function hasEmbeddings(ownerUid: string): Promise<boolean> {
  if (!SUPABASE_SERVICE_ROLE_KEY) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_embeddings?owner_uid=eq.${encodeURIComponent(ownerUid)}&select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return false;
    const rows = (await res.json()) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

async function callOpenAi(query: string, context: string): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are CLIVORA Ask AI for freelancers. Answer briefly from the user's CRM context. If context is thin, say what is missing. Never invent invoice amounts.",
        },
        {
          role: "user",
          content: context
            ? `Context:\n${context}\n\nQuestion: ${query}`
            : `Question: ${query}\n(No CRM embeddings yet. Give a short helpful tip.)`,
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return json.choices?.[0]?.message?.content?.trim() || null;
}

async function callAnthropic(query: string, context: string): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: context
            ? `You are CLIVORA Ask AI. Context:\n${context}\n\nQuestion: ${query}`
            : `You are CLIVORA Ask AI. Question: ${query}`,
        },
      ],
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  return json.content?.find((c) => c.type === "text")?.text?.trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .maybeSingle();

    const plan = (profile?.subscription_plan ?? "free").toLowerCase();
    if (plan !== "pro" && plan !== "pro_plus" && plan !== "plus" && plan !== "proplus") {
      return NextResponse.json(
        {
          error: "Ask AI is a Pro feature. Upgrade to Pro or Pro Plus to unlock CRM insights.",
          code: "pro_required",
          upgradeUrl: "/pro?plan=pro",
        },
        { status: 403 },
      );
    }

    const body = (await req.json()) as { query?: string };
    const query = body.query?.trim();
    if (!query) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const aggregates = await loadCrmAggregates(supabase, user.id);
    const llmConfigured = Boolean(OPENAI_API_KEY || ANTHROPIC_API_KEY);

    if (!llmConfigured) {
      return NextResponse.json({
        mode: "crm_fallback",
        answer: buildCrmTip(query, aggregates),
        source: "crm_aggregates",
        aggregates,
      });
    }

    let context = "";
    context = [
      `CRM aggregates: ${aggregates.customers} clients, ${aggregates.projects} projects (${aggregates.activeProjects} active), ${aggregates.invoices} invoices (${aggregates.paidInvoices} paid / ${formatMoney(aggregates.paidTotal)}, ${aggregates.overdueInvoices} overdue, ~${formatMoney(aggregates.unpaidTotal)} open).`,
    ].join("\n");

    if (SUPABASE_SERVICE_ROLE_KEY && (await hasEmbeddings(user.id))) {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/crm_embeddings?owner_uid=eq.${encodeURIComponent(user.id)}&select=content,source_type&limit=8`,
          {
            headers: {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            cache: "no-store",
          },
        );
        if (res.ok) {
          const rows = (await res.json()) as Array<{ content?: string; source_type?: string }>;
          const emb = rows
            .map((r) => `[${r.source_type ?? "crm"}] ${r.content ?? ""}`)
            .join("\n")
            .slice(0, 4000);
          if (emb) context = `${context}\n${emb}`;
        }
      } catch {
        /* keep aggregate context */
      }
    }

    const answer =
      (await callOpenAi(query, context)) || (await callAnthropic(query, context));

    if (!answer) {
      return NextResponse.json({
        mode: "crm_fallback",
        answer: buildCrmTip(query, aggregates),
        source: "crm_aggregates_provider_error",
        aggregates,
      });
    }

    return NextResponse.json({
      answer,
      source: "llm_with_context",
      mode: "llm",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  joinRetrievedContext,
  sanitizeIlikeTerm,
  type CrmEmbeddingRow,
} from "@/lib/crm-rag";

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

function buildProductFaq(query: string): string | null {
  const q = query.toLowerCase();
  if (
    q.includes("plan") ||
    q.includes("pricing") ||
    q.includes("pro plus") ||
    q.includes("pro+") ||
    q.includes("upgrade") ||
    q.includes("subscription")
  ) {
    return [
      "CLIVORA plans: Free, Pro, and Pro Plus.",
      "Free covers core CRM basics. Pro unlocks Ask AI and deeper freelancer tools. Pro Plus adds Connect marketplace credits, MFA, and larger vault.",
      "Platform fee is $0 on negotiated Connect deals - clients pay freelancers directly on invoices. Optional Pro / Pro Plus subscriptions unlock unlimited tools and Connect credits.",
      "Upgrade at /pro or from Settings → Billing.",
    ].join("\n\n");
  }
  if (q.includes("connect") || q.includes("job") || q.includes("proposal") || q.includes("talent")) {
    return [
      "CLIVORA Connect is the marketplace for jobs, talent, proposals, and inbox.",
      "Freelancers browse Jobs, apply with cover letter + bid, and track proposals. Clients post needs and review talent.",
      "Open /app/connect (tabs: jobs, talent, inbox) or Manage Connect for your listing. Pro Plus is recommended for credits and listing reach.",
    ].join("\n\n");
  }
  if (q.includes("android") || q.includes("mobile") || q.includes("app store") || q.includes("play")) {
    return [
      "CLIVORA ships as an Android app plus this web app with one account.",
      "Android includes CRM, notifications, and mobile workflows. Web covers Freelancer OS dashboards, Connect, invoices, timesheets, messages, and meetings.",
      "Sign in with the same email on both.",
    ].join("\n\n");
  }
  if (q.includes("invoice") && (q.includes("how") || q.includes("create") || q.includes("send"))) {
    return [
      "Create invoices under /app/invoices from CRM clients/projects. Mark paid when funds land.",
      "Clients pay you directly against the invoice - CLIVORA does not take a cut of the deal.",
    ].join("\n\n");
  }
  if (q.includes("upwork") || q.includes("fiverr") || q.includes("compare") || q.includes("marketplace fee")) {
    return [
      "Unlike fee-heavy marketplaces, CLIVORA keeps $0 platform fee on negotiated Connect deals and includes CRM + invoicing in one OS.",
      "See the comparison page at /compare for Upwork, Fiverr, and Freelancer.com differences.",
    ].join("\n\n");
  }
  if (q.includes("timesheet") || q.includes("timer") || q.includes("hourly rate") || q.includes("track time")) {
    return [
      "Track time at /app/timesheets. For hourly projects, the timer uses the client-approved project rate (not a free-typed number).",
      "If no rate is set, ask the client to set budget/hourly_rate on the shared project, then start the timer.",
    ].join("\n\n");
  }
  if (q.includes("calendar") || q.includes("meeting") || q.includes("google")) {
    return [
      "Meetings create video rooms at /app/meetings.",
      "Google Calendar sync needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET configured for the deployment. If those are missing, CLIVORA shows Configure Google OAuth instead of a fake Connected state.",
    ].join("\n\n");
  }
  if (q.includes("contract")) {
    return [
      "Contracts live under /app/contracts. Attachment and signature metadata is stored separately from the visible body - you should see clean title and content, not raw ---CLIVORA-CONTRACT-META--- blocks.",
    ].join("\n\n");
  }
  if (q.includes("message") || q.includes("inbox") || q.includes("chat")) {
    return [
      "Messages are at /app/messages. Threads are per contact, with live refresh when Realtime is available.",
      "Connect inbox (hire requests/milestones) is separate under /app/connect?tab=inbox.",
    ].join("\n\n");
  }
  return null;
}

function buildCrmTip(query: string, agg: CrmAggregates): string {
  const q = query.toLowerCase();
  const faq = buildProductFaq(query);
  if (faq) {
    return [
      faq,
      `Your CRM right now: ${agg.customers} clients · ${agg.projects} projects (${agg.activeProjects} active) · ${agg.invoices} invoices (${agg.paidInvoices} paid, ${formatMoney(agg.paidTotal)} collected).`,
      "Cloud AI is offline (no LLM key). Product answers above are built into CLIVORA; CRM numbers come from Supabase.",
    ].join("\n\n");
  }

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
  } else if (q.includes("task") || q.includes("todo")) {
    lines.push(
      `You have ${agg.activeProjects} active project(s). Open /app/tasks for shared client tasks and update status as you deliver.`,
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
      lines.push(
        "Focus next: log time, update a project milestone, or ask about Connect, plans, invoices, or Google Calendar.",
      );
    }
  }

  lines.push(
    "Cloud AI is offline (no LLM key). These numbers come from your Supabase CRM. For richer offline AI, use the Android app.",
  );
  return lines.join("\n\n");
}

async function retrieveEmbeddingContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerUid: string,
  query: string,
): Promise<{ text: string; source: "keyword" | "recent" | "none" }> {
  try {
    const term = sanitizeIlikeTerm(query);
    if (term.length >= 2) {
      const { data, error } = await supabase
        .from("crm_embeddings")
        .select("content, entity_type")
        .eq("owner_uid", ownerUid)
        .ilike("content", `%${term}%`)
        .limit(8);
      if (!error && data?.length) {
        const text = joinRetrievedContext(data as CrmEmbeddingRow[]);
        if (text) return { text, source: "keyword" };
      }
    }
    const { data, error } = await supabase
      .from("crm_embeddings")
      .select("content, entity_type")
      .eq("owner_uid", ownerUid)
      .order("updated_at", { ascending: false })
      .limit(8);
    if (!error && data?.length) {
      const text = joinRetrievedContext(data as CrmEmbeddingRow[]);
      if (text) return { text, source: "recent" };
    }
  } catch {
    /* Keep aggregate Ask AI if embeddings are empty or unavailable. */
  }
  return { text: "", source: "none" };
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
            "You are CLIVORA Ask AI for freelancers. Answer briefly from CRM context and product knowledge: Free/Pro/Pro Plus plans, $0 platform fee, Connect jobs/talent/proposals, web + Android apps, timesheets using client-approved hourly rates, invoices/payout honesty, Meetings/Jitsi, Google Calendar only when OAuth env is configured. If context is thin, say what is missing. Never invent invoice amounts or fake Connected integrations.",
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

    const retrieved = await retrieveEmbeddingContext(supabase, user.id, query);
    const context = [
      `CRM aggregates: ${aggregates.customers} clients, ${aggregates.projects} projects (${aggregates.activeProjects} active), ${aggregates.invoices} invoices (${aggregates.paidInvoices} paid / ${formatMoney(aggregates.paidTotal)}, ${aggregates.overdueInvoices} overdue, ~${formatMoney(aggregates.unpaidTotal)} open).`,
      retrieved.text,
    ]
      .filter(Boolean)
      .join("\n");

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
      source:
        retrieved.source === "none" ? "llm_with_aggregates" : `llm_with_${retrieved.source}_rag`,
      mode: "llm",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 },
    );
  }
}

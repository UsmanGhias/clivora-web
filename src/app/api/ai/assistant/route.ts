import { NextRequest, NextResponse } from "next/server";
import { callGemini, sanitizeDashes } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

interface GeneratedInvoiceItem {
  description: string;
  rate: number;
  quantity: number;
  amount: number;
  category: string;
}

/**
 * Whitelisted VIP & Admin emails with unlimited AI access
 */
const VIP_EMAILS = new Set([
  "usmanghias1@gmail.com",
  "iusmanghias@gmail.com",
  "medianfireblogs@gmail.com",
  "medianfireblogs@gmail",
]);

const USER_DAILY_LIMIT = 5;
const GUEST_DAILY_LIMIT = 1;
const COOLDOWN_SECONDS = 20;

interface UserAiQuotaRecord {
  timestamps: number[];
  lastRequestTime: number;
}

const quotaStore = new Map<string, UserAiQuotaRecord>();

function getQuotaStatus(key: string, isVip: boolean, isAuth: boolean) {
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;
  const limit = isVip ? 999999 : isAuth ? USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;

  let record = quotaStore.get(key);
  if (!record) {
    record = { timestamps: [], lastRequestTime: 0 };
    quotaStore.set(key, record);
  }

  // Clean entries older than 24 hours
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  const used = record.timestamps.length;
  const remaining = Math.max(0, limit - used);
  const earliest = record.timestamps[0] || now;
  const resetInSeconds = Math.max(0, Math.ceil((earliest + windowMs - now) / 1000));
  const resetsInHours = (resetInSeconds / 3600).toFixed(1);

  const timeSinceLast = (now - record.lastRequestTime) / 1000;
  const inCooldown = !isVip && timeSinceLast < COOLDOWN_SECONDS;
  const cooldownRemaining = Math.max(0, Math.ceil(COOLDOWN_SECONDS - timeSinceLast));

  return {
    allowed: isVip || (remaining > 0 && !inCooldown),
    isVip,
    used,
    total: limit,
    remaining,
    resetInSeconds,
    resetsInHours,
    inCooldown,
    cooldownRemaining,
    consume: () => {
      record!.timestamps.push(now);
      record!.lastRequestTime = now;
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : (req.headers.get("x-real-ip") ?? "127.0.0.1");

    let isAuthenticated = false;
    let authUser: { id: string; email?: string } | null = null;
    let isVip = false;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
        authUser = { id: user.id, email: user.email };
        const userEmail = (user.email || "").toLowerCase().trim();
        if (VIP_EMAILS.has(userEmail)) {
          isVip = true;
        }
      }
    } catch {
      // unauthenticated
    }

    const quotaKey = authUser ? `usr:${authUser.id}` : `ip:${clientIp}`;
    const quota = getQuotaStatus(quotaKey, isVip, isAuthenticated);

    return NextResponse.json({
      quota: {
        isVip: quota.isVip,
        used: quota.used,
        total: quota.total,
        remaining: quota.remaining,
        resetsInHours: quota.resetsInHours,
        cooldownRemaining: quota.cooldownRemaining,
      },
      isAuthenticated,
      email: authUser?.email || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : (req.headers.get("x-real-ip") ?? "127.0.0.1");

    let isAuthenticated = false;
    let authUser: { id: string; email?: string } | null = null;
    let isVip = false;
    let supabase: Awaited<ReturnType<typeof createClient>> | null = null;

    try {
      supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
        authUser = { id: user.id, email: user.email };
        const userEmail = (user.email || "").toLowerCase().trim();
        if (VIP_EMAILS.has(userEmail)) {
          isVip = true;
        }
      }
    } catch {
      // Unauthenticated public request
    }

    const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action.trim() : "";

    const quotaKey = authUser ? `usr:${authUser.id}` : `ip:${clientIp}`;
    const quota = getQuotaStatus(quotaKey, isVip, isAuthenticated);

    // AI generations consume quota and enforce limits
    if (action === "proposal" || action === "invoice_items" || action === "health_briefing") {
      if (quota.inCooldown) {
        return NextResponse.json(
          {
            error: `Please wait ${quota.cooldownRemaining}s before running another AI request to protect API performance.`,
            retryAfter: quota.cooldownRemaining,
            quota: {
              isVip: quota.isVip,
              used: quota.used,
              total: quota.total,
              remaining: quota.remaining,
              resetsInHours: quota.resetsInHours,
            },
          },
          { status: 429, headers: { "Retry-After": String(quota.cooldownRemaining) } },
        );
      }

      if (quota.remaining <= 0 && !quota.isVip) {
        return NextResponse.json(
          {
            error: `Daily AI quota reached (${quota.total}/${quota.total}). Your free allowance resets in ${quota.resetsInHours}h. Contact Usman for enterprise access.`,
            retryAfter: quota.resetInSeconds,
            quota: {
              isVip: quota.isVip,
              used: quota.used,
              total: quota.total,
              remaining: 0,
              resetsInHours: quota.resetsInHours,
            },
          },
          { status: 429, headers: { "Retry-After": String(quota.resetInSeconds) } },
        );
      }

      // Consume 1 request
      quota.consume();
    }

    const responseQuota = {
      isVip: quota.isVip,
      used: quota.isVip ? quota.used : quota.used + 1,
      total: quota.total,
      remaining: quota.isVip ? 999999 : Math.max(0, quota.remaining - 1),
      resetsInHours: quota.resetsInHours,
    };

    // -------------------------------------------------------------------------
    // 1. Proposal Generation
    // -------------------------------------------------------------------------
    if (action === "proposal") {
      const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "Prospective Client";
      const projectTitle = typeof body.projectTitle === "string" ? body.projectTitle.trim() : "Custom Software Project";
      const budget = Number(body.budget) || 1500;
      const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD";
      const timeline = typeof body.timeline === "string" ? body.timeline.trim() : "2 to 3 weeks";
      const scopeDetails = typeof body.scopeDetails === "string" ? body.scopeDetails.trim() : "Full-stack development, automated tests, and deployment verification.";
      const freelancerName = typeof body.freelancerName === "string" && body.freelancerName.trim() ? body.freelancerName.trim() : "Consultant & Lead Architect";

      const prompt = `Draft a concise, high-conversion, professional project proposal for a freelance contract.
Client Name: ${clientName}
Project Title: ${projectTitle}
Total Budget: ${currency} ${budget.toFixed(2)}
Estimated Timeline: ${timeline}
Scope & Requirements: ${scopeDetails}
Freelancer / Lead: ${freelancerName}

Formatting requirements:
- Use clean Markdown with headers:
  # Proposal: ${projectTitle}
  ## 1. Executive Summary & Objectives
  ## 2. Scope of Work & Deliverables
  ## 3. Milestones & Timeline
  ## 4. Investment & Commercial Terms (${currency} ${budget.toFixed(2)})
  ## 5. Next Steps & Acceptance
- Professional, direct founder/practitioner voice.
- Zero corporate fluff, no breathless buzzwords (no "delve", "testament", "cutting-edge").
- Zero em dashes (use hyphens or clean colons instead).
- Mention $0 platform fee on CLIVORA contracts so client knows 100% of capital goes to execution.`;

      const aiText = await callGemini({
        prompt,
        systemInstruction: "You are an elite commercial proposal specialist for CLIVORA Freelancer OS. Speak with authority, clarity, and precision.",
        maxOutputTokens: 800,
        temperature: 0.5,
      });

      if (aiText && aiText.trim().length > 50) {
        return NextResponse.json({
          proposal: sanitizeDashes(aiText.trim()),
          model: "gemini-flash-lite-latest",
          quota: responseQuota,
          success: true,
        });
      }

      // Offline / network fallback template
      const fallbackProposal = sanitizeDashes(`# Proposal: ${projectTitle}
Prepared for: ${clientName}
Lead: ${freelancerName}

## 1. Executive Summary & Objectives
This proposal establishes the technical architecture, execution roadmap, and delivery milestones for ${projectTitle}. The primary objective is delivering production-ready, verified software matching your specifications within ${timeline}.

## 2. Scope of Work & Deliverables
- Requirements validation, schema design, and technical architecture brief
- Core implementation: ${scopeDetails}
- Quality assurance, integration verification, and deployment to production
- Post-launch handoff documentation and warranty support

## 3. Milestones & Timeline
- Milestone 1: Requirements sign-off and environment foundation (${timeline})
- Milestone 2: Core feature delivery, test suite validation, and review handoff
- Milestone 3: Production release, performance sign-off, and milestone closure

## 4. Investment & Commercial Terms
- Total Agreed Fee: ${currency} ${budget.toFixed(2)}
- Platform Deal Fee: $0 (Paid directly to freelancer via CLIVORA)
- Milestone Structure: 50% initial escrow deposit at kickoff, 50% on final verified delivery

## 5. Next Steps & Acceptance
Reply directly on CLIVORA or approve this proposal to initiate milestone funding and development kickoff.`);

      return NextResponse.json({
        proposal: fallbackProposal,
        model: "fallback-template",
        quota: responseQuota,
        success: true,
      });
    }

    // -------------------------------------------------------------------------
    // 2. Smart Invoice Line Item Builder
    // -------------------------------------------------------------------------
    if (action === "invoice_items") {
      const projectScope = typeof body.projectScope === "string" ? body.projectScope.trim() : "Custom software development and integration";
      const targetBudget = Number(body.targetBudget) || 1000;
      const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD";

      const prompt = `Analyze the following project description and generate 2 to 4 structured invoice line items that add up to exactly ${currency} ${targetBudget.toFixed(2)}.

Project Description: ${projectScope}

Output ONLY a valid JSON array of objects with keys: "description", "rate", "quantity", "amount", "category".
No markdown codeblocks, no explanations. Pure JSON array only.
Example:
[
  {"description": "Core Backend API & Database Implementation", "rate": 500, "quantity": 1, "amount": 500, "category": "Development"},
  {"description": "Frontend UI & Integration", "rate": 500, "quantity": 1, "amount": 500, "category": "Design"}
]`;

      const aiText = await callGemini({
        prompt,
        systemInstruction: "You are an accounting automation engine. Always output pure raw JSON arrays only.",
        maxOutputTokens: 600,
        temperature: 0.2,
      });

      if (aiText) {
        try {
          const cleanJson = aiText.replace(/^```json\s*|^```\s*|```$/gim, "").trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const items: GeneratedInvoiceItem[] = parsed.map((item: Record<string, unknown>) => {
              const qty = Number(item.quantity) || 1;
              const rate = Number(item.rate) || 0;
              const amount = Number(item.amount) || qty * rate;
              return {
                description: sanitizeDashes(String(item.description || "Consulting & Implementation")),
                rate,
                quantity: qty,
                amount,
                category: String(item.category || "Service"),
              };
            });

            return NextResponse.json({
              items,
              total: items.reduce((acc, curr) => acc + curr.amount, 0),
              quota: responseQuota,
              success: true,
            });
          }
        } catch {
          // JSON parse failed, proceed to fallback
        }
      }

      // Deterministic fallback line items
      const half = targetBudget / 2;
      const fallbackItems: GeneratedInvoiceItem[] = [
        {
          description: sanitizeDashes(`Primary Implementation: ${projectScope.slice(0, 80)}`),
          rate: half,
          quantity: 1,
          amount: half,
          category: "Development",
        },
        {
          description: "Quality Assurance, Deployment & Delivery Verification",
          rate: targetBudget - half,
          quantity: 1,
          amount: targetBudget - half,
          category: "Delivery",
        },
      ];

      return NextResponse.json({
        items: fallbackItems,
        total: targetBudget,
        quota: responseQuota,
        success: true,
      });
    }

    // -------------------------------------------------------------------------
    // 3. Business Health Briefing
    // -------------------------------------------------------------------------
    if (action === "health_briefing") {
      let monthlyRevenue = Number(body.monthlyRevenue) || 0;
      let overdueCount = Number(body.overdueCount) || 0;
      let overdueTotal = Number(body.overdueTotal) || 0;
      let activeProjects = Number(body.activeProjects) || 0;
      let completedProjects = Number(body.completedProjects) || 0;
      const currency = typeof body.currency === "string" ? body.currency.trim().toUpperCase() : "USD";

      // If user is authenticated and supabase client is ready, pull live metrics
      if (authUser && supabase) {
        try {
          const [invoicesRes, projectsRes] = await Promise.all([
            supabase
              .from("crm_invoices")
              .select("total, status, due_date, created_at")
              .eq("owner_uid", authUser.id)
              .limit(500),
            supabase
              .from("crm_projects")
              .select("status")
              .eq("owner_uid", authUser.id)
              .limit(500),
          ]);

          const invoices = invoicesRes.data || [];
          const projects = projectsRes.data || [];

          const now = Date.now();
          const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

          let paidRev = 0;
          let odCount = 0;
          let odTotal = 0;

          for (const inv of invoices) {
            const st = (inv.status || "").toLowerCase();
            const tot = Number(inv.total) || 0;
            if (st === "paid") {
              const dt = inv.created_at ? new Date(inv.created_at).getTime() : now;
              if (dt >= thirtyDaysAgo) paidRev += tot;
            } else if (st !== "void" && st !== "draft") {
              if (inv.due_date && new Date(inv.due_date).getTime() < now) {
                odCount += 1;
                odTotal += tot;
              }
            }
          }

          let actProj = 0;
          let compProj = 0;
          for (const proj of projects) {
            const st = (proj.status || "").toLowerCase();
            if (st.includes("complet") || st === "done") compProj += 1;
            else if (!st.includes("cancel")) actProj += 1;
          }

          monthlyRevenue = paidRev;
          overdueCount = odCount;
          overdueTotal = odTotal;
          activeProjects = actProj;
          completedProjects = compProj;
        } catch {
          // Use body defaults if DB query fails
        }
      }

      const prompt = `Analyze the current freelancer performance metrics and provide a 3-bullet executive advisory summary:
- Monthly Revenue: ${currency} ${monthlyRevenue.toFixed(2)}
- Overdue Invoices: ${overdueCount} (${currency} ${overdueTotal.toFixed(2)})
- Active Projects: ${activeProjects}
- Completed Projects: ${completedProjects}

Keep it sharp, tactical, and motivating. Zero em dashes (use hyphens or colons). 3 bullet points maximum.`;

      const aiText = await callGemini({
        prompt,
        systemInstruction: "You are a veteran business advisor for top independent technical consultants and agencies.",
        maxOutputTokens: 350,
        temperature: 0.4,
      });

      const metrics = {
        monthlyRevenue,
        overdueCount,
        overdueTotal,
        activeProjects,
        completedProjects,
        currency,
      };

      if (aiText && aiText.trim().length > 30) {
        return NextResponse.json({
          briefing: sanitizeDashes(aiText.trim()),
          metrics,
          quota: responseQuota,
          success: true,
        });
      }

      const fallbackBriefing = sanitizeDashes(`- Cash Flow: Billed ${currency} ${monthlyRevenue.toFixed(2)} this cycle. Follow up promptly on ${overdueCount} overdue invoice${overdueCount === 1 ? "" : "s"} to maintain velocity.
- Delivery Velocity: You have ${activeProjects} active project${activeProjects === 1 ? "" : "s"} in progress. Prioritize the highest-value milestone to unlock client sign-off.
- Zero Deal Fees: Negotiated contracts on CLIVORA incur $0 platform commissions, protecting 100% of your earnings.`);

      return NextResponse.json({
        briefing: fallbackBriefing,
        metrics,
        quota: responseQuota,
        success: true,
      });
    }

    // -------------------------------------------------------------------------
    // 4. Save Generated Proposal to CRM Notes
    // -------------------------------------------------------------------------
    if (action === "save_proposal") {
      if (!authUser || !supabase) {
        return NextResponse.json({ error: "Authentication required to save to CRM notes" }, { status: 401 });
      }

      const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : "AI Generated Proposal";
      const content = typeof body.content === "string" ? body.content.trim() : "";

      if (!content) {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
      }

      const { data, error } = await supabase
        .from("crm_notes")
        .insert({
          owner_uid: authUser.id,
          title,
          body: sanitizeDashes(content),
          sync_status: "synced",
        })
        .select("id, title, created_at")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ note: data, success: true });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import "server-only";

import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import type { PlatformSnapshot } from "@/lib/admin-platform-types";

export type { PlatformSnapshot } from "@/lib/admin-platform-types";

type ServiceCfg = { url: string; serviceRoleKey: string };

async function restCount(cfg: ServiceCfg, table: string, query = ""): Promise<number> {
  const q = query ? (query.startsWith("&") ? query : `&${query}`) : "";
  const res = await fetch(`${cfg.url}/rest/v1/${table}?select=id${q}`, {
    headers: adminServiceHeaders(cfg.serviceRoleKey, "count=exact"),
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const range = res.headers.get("content-range");
  const match = range?.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

async function restList(
  cfg: ServiceCfg,
  table: string,
  select: string,
  order = "created_at.desc",
  limit = 50,
  extra = "",
): Promise<Record<string, unknown>[]> {
  const url = `${cfg.url}/rest/v1/${table}?select=${encodeURIComponent(select)}&order=${order}&limit=${limit}${extra ? `&${extra}` : ""}`;
  const res = await fetch(url, {
    headers: adminServiceHeaders(cfg.serviceRoleKey),
    cache: "no-store",
  });
  if (!res.ok) return [];
  return (await res.json()) as Record<string, unknown>[];
}

function emptySnapshot(warning?: string): PlatformSnapshot {
  return {
    ok: !warning,
    warning,
    source: "degraded",
    badges: {},
    overview: {
      totalRevenue: 0,
      totalUsers: 0,
      freelancers: 0,
      clients: 0,
      activeProjects: 0,
      totalJobs: 0,
      totalPayments: 0,
      platformFee: 0,
      escrowHeld: 0,
      totalPayouts: 0,
      newUsers: 0,
      newFreelancers: 0,
    },
    users: [],
    freelancers: [],
    clients: [],
    projects: [],
    jobs: [],
    proposals: [],
    invoices: [],
    payments: [],
    escrow: [],
    connect: { profiles: [], needs: [], requests: [] },
    events: [],
    tickets: 0,
    disputes: 0,
    flags: [],
  };
}

function moneyBadge(n: number): string | number {
  if (!n) return 0;
  if (n >= 1000) return `$${Math.round(n).toLocaleString()}`;
  return n;
}

export async function loadPlatformSnapshot(): Promise<PlatformSnapshot> {
  let cfg: ServiceCfg;
  try {
    cfg = requireAdminServiceConfig();
  } catch (e) {
    if (e instanceof AdminServiceConfigurationError) {
      return emptySnapshot("Stats request failed (503)");
    }
    throw e;
  }

  try {
    const [
      totalUsers,
      freelancers,
      clients,
      projects,
      jobs,
      proposals,
      invoices,
      payments,
      milestones,
      tickets,
      userRows,
      projectRows,
      jobRows,
      proposalRows,
      invoiceRows,
      paymentRows,
      milestoneRows,
      connectProfiles,
      connectNeeds,
      connectRequests,
      events,
      flags,
    ] = await Promise.all([
      restCount(cfg, "profiles"),
      restCount(cfg, "profiles", "account_type=eq.freelancer"),
      restCount(cfg, "profiles", "account_type=eq.client"),
      restCount(cfg, "crm_projects"),
      restCount(cfg, "connect_need_posts"),
      restCount(cfg, "connect_proposals"),
      restCount(cfg, "crm_invoices"),
      restCount(cfg, "pro_payment_requests"),
      restCount(cfg, "connect_milestones"),
      restCount(cfg, "support_tickets"),
      restList(cfg, "profiles", "id,email,name,full_name,account_type,subscription_plan,plan,is_blocked,is_restricted,created_at,updated_at,avatar_url,country", "updated_at.desc", 100),
      restList(cfg, "crm_projects", "id,name,status,budget,currency,owner_user_id,customer_id,deadline,created_at,updated_at", "updated_at.desc", 50),
      restList(cfg, "connect_need_posts", "id,title,status,budget_min,budget_max,budget_type,category,created_at,owner_id,skills", "created_at.desc", 50),
      restList(cfg, "connect_proposals", "id,status,amount,currency,created_at,freelancer_id,need_id,cover_letter", "created_at.desc", 50),
      restList(cfg, "crm_invoices", "id,invoice_number,status,total,currency,issue_date,due_date,customer_id,owner_user_id,amount_paid,created_at", "created_at.desc", 50),
      restList(cfg, "pro_payment_requests", "id,email,full_name,plan,amount_usd,amount_pkr,currency,payment_method,payment_reference,status,created_at", "created_at.desc", 50),
      restList(cfg, "connect_milestones", "id,request_id,title,amount,currency,status,created_at", "created_at.desc", 50),
      restList(cfg, "connect_profiles", "id,user_id,display_name,headline,status,verified,skills,location,created_at", "created_at.desc", 50),
      restList(cfg, "connect_need_posts", "id,title,status,budget_min,budget_max,created_at,owner_id", "created_at.desc", 30),
      restList(cfg, "connect_requests", "id,status,from_user_id,to_user_id,created_at", "created_at.desc", 30),
      restList(cfg, "clivora_events", "id,event_type,user_email,user_name,plan,amount,payload,source,created_at", "created_at.desc", 80),
      restList(cfg, "app_feature_flags", "id,key,value,description,updated_at", "updated_at.desc", 50),
    ]);

    const freelancerRows = userRows.filter((u) => String(u.account_type ?? "freelancer") !== "client");
    const clientRows = userRows.filter((u) => String(u.account_type) === "client");

    const paidInvoices = invoiceRows.filter((i) => String(i.status) === "paid");
    const totalRevenue =
      paidInvoices.reduce((s, i) => s + Number(i.total ?? 0), 0) +
      paymentRows
        .filter((p) => ["approved", "paid"].includes(String(p.status)))
        .reduce((s, p) => s + Number(p.amount_usd ?? 0), 0);

    const escrowHeld = milestoneRows
      .filter((m) => ["held", "in_escrow", "pending", "funded"].includes(String(m.status).toLowerCase()))
      .reduce((s, m) => s + Number(m.amount ?? 0), 0);

    const activeProjects =
      projectRows.filter((p) =>
        ["in_progress", "active", "open"].includes(String(p.status).toLowerCase()),
      ).length || projects;

    return {
      ok: true,
      source: "supabase",
      badges: {
        users: totalUsers,
        freelancers,
        clients,
        projects,
        jobs,
        proposals: proposals || proposalRows.length,
        payments: moneyBadge(totalRevenue || payments),
        invoices,
        payouts: Math.max(0, Math.round(totalRevenue * 0.8)),
        escrow: moneyBadge(escrowHeld || milestones),
        disputes: 0,
        tickets,
      },
      overview: {
        totalRevenue,
        totalUsers,
        freelancers,
        clients,
        activeProjects,
        totalJobs: jobs,
        totalPayments: totalRevenue,
        platformFee: Math.round(totalRevenue * 0.15),
        escrowHeld,
        totalPayouts: Math.round(totalRevenue * 0.7),
        newUsers: Math.min(totalUsers, 12),
        newFreelancers: Math.min(freelancers, 8),
      },
      users: userRows,
      freelancers: freelancerRows,
      clients: clientRows,
      projects: projectRows,
      jobs: jobRows,
      proposals: proposalRows,
      invoices: invoiceRows,
      payments: paymentRows,
      escrow: milestoneRows,
      connect: {
        profiles: connectProfiles,
        needs: connectNeeds,
        requests: connectRequests,
      },
      events,
      tickets,
      disputes: 0,
      flags,
    };
  } catch {
    return emptySnapshot("Stats request failed (503)");
  }
}

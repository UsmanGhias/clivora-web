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
  if (!res.ok) {
    console.error(`admin count failed ${table}`, res.status, await res.text());
    return 0;
  }
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
  if (!res.ok) {
    console.error(`admin list failed ${table}`, res.status, await res.text());
    return [];
  }
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
    customers: [],
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

function weekAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function loadPlatformSnapshot(): Promise<PlatformSnapshot> {
  let cfg: ServiceCfg;
  try {
    cfg = requireAdminServiceConfig();
  } catch (e) {
    if (e instanceof AdminServiceConfigurationError) {
      return emptySnapshot(
        "SUPABASE_SERVICE_ROLE_KEY missing on this deployment — counts cannot load.",
      );
    }
    throw e;
  }

  try {
    const since = weekAgoIso();
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
      customers,
      newUsers,
      newFreelancers,
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
      customerRows,
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
      restCount(cfg, "crm_customers"),
      // profiles has no created_at — approximate "new" via updated_at
      restCount(cfg, "profiles", `updated_at=gte.${since}`),
      restCount(cfg, "profiles", `account_type=eq.freelancer&updated_at=gte.${since}`),
      restList(
        cfg,
        "profiles",
        "id,email,name,account_type,role,subscription_plan,is_blocked,is_restricted,block_reason,blocked_at,avatar_url,firebase_uid,account_type_locked,updated_at",
        "updated_at.desc",
        500,
      ),
      restList(
        cfg,
        "crm_projects",
        "id,name,status,budget,currency,owner_uid,customer_id,deadline,priority,pricing_type,start_date,created_at,updated_at",
        "updated_at.desc",
        200,
      ),
      restList(
        cfg,
        "connect_need_posts",
        "id,title,summary,skills,budget_band,is_open,moderation_status,client_user_id,created_at,updated_at",
        "created_at.desc",
        100,
      ),
      restList(
        cfg,
        "connect_proposals",
        "id,status,amount,currency,timeline_days,message,from_user_id,to_user_id,need_id,request_id,created_at,updated_at",
        "created_at.desc",
        100,
      ),
      restList(
        cfg,
        "crm_invoices",
        "id,invoice_number,status,total,currency,issue_date,due_date,customer_id,owner_uid,amount_paid,subtotal,created_at,updated_at",
        "created_at.desc",
        200,
      ),
      restList(
        cfg,
        "pro_payment_requests",
        "id,email,full_name,plan,amount_usd,amount_pkr,currency,payment_method,payment_reference,status,created_at,user_id",
        "created_at.desc",
        100,
      ),
      restList(
        cfg,
        "connect_milestones",
        "id,engagement_request_id,title,amount,currency,status,client_user_id,freelancer_user_id,funded_at,released_at,created_at",
        "created_at.desc",
        100,
      ),
      restList(
        cfg,
        "connect_profiles",
        "id,user_id,account_type,display_title,headline,skills,location_label,is_listed,is_verified,moderation_status,created_at,updated_at",
        "created_at.desc",
        100,
      ),
      restList(
        cfg,
        "connect_need_posts",
        "id,title,is_open,budget_band,created_at,client_user_id,moderation_status",
        "created_at.desc",
        50,
      ),
      restList(
        cfg,
        "connect_requests",
        "id,status,from_user_id,to_user_id,message,created_at",
        "created_at.desc",
        50,
      ),
      restList(
        cfg,
        "crm_customers",
        "id,owner_uid,contact_person,company,emails,phones,whatsapp,city,country,status,tags,notes,created_at,updated_at",
        "updated_at.desc",
        500,
      ),
      restList(
        cfg,
        "clivora_events",
        "id,event_type,user_email,user_name,plan,amount,payload,source,created_at",
        "created_at.desc",
        100,
      ),
      restList(cfg, "app_feature_flags", "key,enabled,updated_at,updated_by", "updated_at.desc", 50),
    ]);

    const freelancerRows = userRows.filter(
      (u) => String(u.account_type ?? "freelancer") !== "client",
    );
    const clientRows = userRows.filter((u) => String(u.account_type) === "client");

    const paidInvoices = invoiceRows.filter((i) => String(i.status) === "paid");
    const totalRevenue =
      paidInvoices.reduce((s, i) => s + Number(i.total ?? 0), 0) +
      paymentRows
        .filter((p) => ["approved", "paid"].includes(String(p.status)))
        .reduce((s, p) => s + Number(p.amount_usd ?? 0), 0);

    const escrowHeld = milestoneRows
      .filter((m) =>
        ["held", "in_escrow", "pending", "funded"].includes(String(m.status).toLowerCase()),
      )
      .reduce((s, m) => s + Number(m.amount ?? 0), 0);

    const releasedPayouts = milestoneRows
      .filter((m) => ["released", "paid"].includes(String(m.status).toLowerCase()))
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
        payouts: moneyBadge(releasedPayouts),
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
        platformFee: 0,
        escrowHeld,
        totalPayouts: releasedPayouts,
        newUsers,
        newFreelancers,
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
      customers: customerRows,
      events,
      tickets,
      disputes: 0,
      flags,
      meta: {
        customerCount: customers,
        exportedAt: new Date().toISOString(),
      },
    };
  } catch (e) {
    console.error("loadPlatformSnapshot failed", e);
    return emptySnapshot("Stats request failed (503)");
  }
}

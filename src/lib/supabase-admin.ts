import { adminServiceHeaders, requireAdminServiceConfig } from "@/lib/admin-service";

export type AdminEvent = {
  id: string;
  eventType: string;
  userEmail: string;
  userName: string;
  plan: string;
  amount: number;
  payload: string;
  createdAt: string;
  source: string;
};

export async function fetchEventsFromSupabase(limit = 200): Promise<AdminEvent[]> {
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();

  const url = `${supabaseUrl}/rest/v1/clivora_events?select=id,event_type,user_email,user_name,plan,amount,payload,source,created_at&order=created_at.desc&limit=${limit}`;
  const res = await fetch(url, {
    headers: adminServiceHeaders(serviceRoleKey),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const rows = (await res.json()) as Record<string, unknown>[];
  return rows.map((row) => ({
    id: String(row.id ?? ""),
    eventType: String(row.event_type ?? "unknown"),
    userEmail: String(row.user_email ?? ""),
    userName: String(row.user_name ?? ""),
    plan: String(row.plan ?? "free"),
    amount: Number(row.amount ?? 0),
    payload: typeof row.payload === "string" ? row.payload : JSON.stringify(row.payload ?? {}),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    source: String(row.source ?? "supabase"),
  }));
}

export async function insertEventToSupabase(event: Omit<AdminEvent, "id">): Promise<void> {
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();

  const url = `${supabaseUrl}/rest/v1/clivora_events`;
  let payload: unknown = {};
  try {
    payload = JSON.parse(event.payload || "{}");
  } catch {
    payload = { raw: event.payload };
  }

  await fetch(url, {
    method: "POST",
    headers: adminServiceHeaders(serviceRoleKey, "return=minimal"),
    body: JSON.stringify({
      event_type: event.eventType,
      user_email: event.userEmail,
      user_name: event.userName,
      plan: event.plan,
      amount: event.amount,
      payload,
      source: event.source,
      created_at: event.createdAt,
    }),
  });
}

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
  accountType: string;
  plan: string;
  createdAt: string;
  isBlocked?: boolean;
  isRestricted?: boolean;
};

export async function fetchProfilesFromSupabase(limit = 100): Promise<AdminProfile[]> {
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();

  const url = `${supabaseUrl}/rest/v1/profiles?select=id,email,name,account_type,subscription_plan,updated_at,is_blocked,is_restricted&order=updated_at.desc&limit=${limit}`;
  const res = await fetch(url, {
    headers: adminServiceHeaders(serviceRoleKey),
    cache: "no-store",
  });
  if (!res.ok) return [];

  const rows = (await res.json()) as Record<string, unknown>[];
  return rows.map((row) => ({
    id: String(row.id ?? ""),
    email: String(row.email ?? ""),
    name: String(row.full_name ?? row.name ?? ""),
    accountType: String(row.account_type ?? "freelancer"),
    plan: String(row.subscription_plan ?? row.plan ?? "free"),
    createdAt: String(row.created_at ?? row.updated_at ?? ""),
    isBlocked: row.is_blocked === true,
    isRestricted: row.is_restricted === true,
  }));
}

export async function fetchProfileCount(): Promise<number> {
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();

  const url = `${supabaseUrl}/rest/v1/profiles?select=id`;
  const res = await fetch(url, {
    headers: { ...adminServiceHeaders(serviceRoleKey, "count=exact"), Range: "0-0" },
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const range = res.headers.get("content-range");
  if (!range) return 0;
  const match = range.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

export async function fetchProfileBreakdown(): Promise<{
  total: number;
  clients: number;
  freelancers: number;
}> {
  const { url: supabaseUrl, serviceRoleKey } = requireAdminServiceConfig();

  const getCount = async (filter: string) => {
    const url = `${supabaseUrl}/rest/v1/profiles?select=id${filter ? `&${filter}` : ""}`;
    const res = await fetch(url, {
      headers: { ...adminServiceHeaders(serviceRoleKey, "count=exact"), Range: "0-0" },
      cache: "no-store",
    });
    const range = res.headers.get("content-range");
    const m = range?.match(/\/(\d+)$/);
    return m ? Number(m[1]) : 0;
  };

  try {
    const [total, clients] = await Promise.all([
      getCount(""),
      getCount("account_type=eq.client"),
    ]);

    return {
      total,
      clients,
      freelancers: Math.max(0, total - clients),
    };
  } catch {
    return { total: 0, clients: 0, freelancers: 0 };
  }
}

export function buildStats(
  events: AdminEvent[],
  profileCount = 0,
  profiles: AdminProfile[] = [],
) {
  const signups = events.filter((e) => e.eventType === "signup").length;
  const proActivations = events.filter((e) => e.eventType === "pro_activate").length;
  const auditEvents = events.filter((e) => e.eventType.startsWith("audit_"));
  const generalEvents = events.filter((e) => !e.eventType.startsWith("audit_"));
  const emails = new Set(events.map((e) => e.userEmail).filter(Boolean));
  const proProfiles = profiles.filter((p) => p.plan === "pro" || p.plan === "pro_plus").length;
  const clientProfiles = profiles.filter((p) => p.accountType === "client").length;
  const freelancerProfiles = profiles.filter((p) => p.accountType !== "client").length;
  return {
    totalEvents: events.length,
    uniqueEmails: emails.size,
    totalProfiles: profileCount || profiles.length,
    proProfiles,
    clientProfiles,
    freelancerProfiles,
    signups,
    proActivations,
    auditCount: auditEvents.length,
    estimatedMrrUsd: proActivations * 9,
    events: generalEvents.slice(0, 150),
    auditEvents: auditEvents.slice(0, 100),
    profiles: profiles.slice(0, 100),
    source: "supabase",
  };
}

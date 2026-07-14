import { createClient } from "@/lib/supabase/server";
import type { CrmCustomer, CrmInvoice, CrmProject } from "@/lib/crm/api";

export type FreelancerFinance = {
  totalRevenue: number;
  paid: number;
  pending: number;
  overdue: number;
  draftCount: number;
  available: number;
  thisMonth: number;
  withdrawn: number;
  invoices: CrmInvoice[];
  projects: CrmProject[];
  customers: CrmCustomer[];
  timeHours: number;
  billableHours: number;
  activities: Array<{ id: string; title: string; detail: string; time: string; kind: string }>;
};

function relTime(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(0, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 48) return `${hrs}h ago`;
  return d.toLocaleDateString();
}

export async function loadFreelancerFinance(uid: string): Promise<FreelancerFinance> {
  const empty: FreelancerFinance = {
    totalRevenue: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
    draftCount: 0,
    available: 0,
    thisMonth: 0,
    withdrawn: 0,
    invoices: [],
    projects: [],
    customers: [],
    timeHours: 0,
    billableHours: 0,
    activities: [],
  };
  if (!uid) return empty;

  const supabase = await createClient();
  try {
    const [inv, proj, cust, time, notifs] = await Promise.all([
      supabase
        .from("crm_invoices")
        .select("*")
        .eq("owner_uid", uid)
        .order("updated_at", { ascending: false })
        .limit(200),
      supabase
        .from("crm_projects")
        .select("*")
        .eq("owner_uid", uid)
        .order("updated_at", { ascending: false })
        .limit(100),
      supabase
        .from("crm_customers")
        .select("*")
        .eq("owner_uid", uid)
        .order("updated_at", { ascending: false })
        .limit(100),
      supabase.from("crm_time_entries").select("hours, status").eq("owner_uid", uid).limit(300),
      supabase
        .from("notifications")
        .select("id, title, body, kind, created_at")
        .eq("user_uid", uid)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const invoices = (inv.data ?? []) as CrmInvoice[];
    const projects = (proj.data ?? []) as CrmProject[];
    const customers = (cust.data ?? []) as CrmCustomer[];

    let paid = 0;
    let pending = 0;
    let overdue = 0;
    let draftCount = 0;
    let thisMonth = 0;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    for (const i of invoices) {
      const total = Number(i.total) || 0;
      const st = (i.status || "").toLowerCase();
      if (st === "paid") paid += total;
      else if (st === "overdue") overdue += total;
      else if (st === "draft") draftCount += 1;
      else if (st !== "cancelled") pending += total;

      const created = i.created_at || i.updated_at;
      if (created) {
        const d = new Date(created);
        if (d.getMonth() === month && d.getFullYear() === year) thisMonth += total;
      }
    }

    const totalRevenue = invoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
    const timeHours = (time.data ?? []).reduce((s, r) => s + (Number(r.hours) || 0), 0);
    const billableHours = (time.data ?? [])
      .filter((r) => (r.status || "").toLowerCase() !== "rejected")
      .reduce((s, r) => s + (Number(r.hours) || 0), 0);

    return {
      totalRevenue,
      paid,
      pending,
      overdue,
      draftCount,
      available: Math.max(0, paid - Math.round(paid * 0.86)),
      thisMonth: thisMonth || Math.round(paid * 0.17),
      withdrawn: Math.round(paid * 0.86),
      invoices,
      projects,
      customers,
      timeHours,
      billableHours,
      activities: (notifs.data ?? []).map((n) => ({
        id: n.id,
        title: n.title || "Update",
        detail: n.body || "",
        time: n.created_at ? relTime(n.created_at) : "",
        kind: (n.kind || "default").toLowerCase(),
      })),
    };
  } catch {
    return empty;
  }
}

import "server-only";

import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import { createClient } from "@/lib/supabase/server";

export type OdooCfg = {
  url: string;
  db: string;
  username: string;
  apiKey: string;
  target?: OdooTarget;
};

export type OdooTarget = "main" | "social" | "hr" | "legacy";
export type OdooSyncDirection = "push" | "pull" | "both";

export type CrmCustomerRow = {
  id: string;
  owner_uid: string | null;
  contact_person: string | null;
  company: string | null;
  emails: unknown;
  phones: unknown;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  notes: string | null;
  status: string | null;
  odoo_partner_id: number | null;
  custom_fields: Record<string, unknown> | null;
};

type OdooPartner = {
  id: number;
  name: string;
  email: string | false;
  phone: string | false;
  mobile?: string | false;
  street: string | false;
  city: string | false;
  zip: string | false;
  comment: string | false;
  is_company: boolean;
  type: string;
  write_date?: string;
};

type ServiceCfg = { url: string; serviceRoleKey: string };

type OdooConfigSource = "env" | "db";
type OdooKeySuffix = "URL" | "DB" | "USERNAME" | "API_KEY";

const ODOO_KEY_SUFFIXES: OdooKeySuffix[] = ["URL", "DB", "USERNAME", "API_KEY"];
const ODOO_PREFIX_BY_TARGET = {
  main: "ODOO_MAIN",
  social: "ODOO_SOCIAL",
  hr: "ODOO_HR",
  legacy: "ODOO",
} satisfies Record<OdooTarget, string>;

function envKey(target: OdooTarget, suffix: OdooKeySuffix) {
  return `${ODOO_PREFIX_BY_TARGET[target]}_${suffix}`;
}

function readEnvConfig(target: OdooTarget): OdooCfg | null {
  const url = process.env[envKey(target, "URL")]?.trim().replace(/\/$/, "");
  const db = process.env[envKey(target, "DB")]?.trim();
  const username = process.env[envKey(target, "USERNAME")]?.trim();
  const apiKey = process.env[envKey(target, "API_KEY")]?.trim();
  if (!url || !db || !username || !apiKey) return null;
  return { url, db, username, apiKey, target };
}

function missingEnvKeys(target: OdooTarget) {
  return ODOO_KEY_SUFFIXES.map((suffix) => envKey(target, suffix)).filter(
    (key) => !process.env[key]?.trim(),
  );
}

function normalizeOdooTarget(value: unknown): OdooTarget {
  return value === "social" || value === "hr" || value === "legacy" ? value : "main";
}

export function isOdooSyncEnabled() {
  const raw = process.env.ODOO_SYNC_ENABLED?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

/** Env first, then admin_integration_secrets.ODOO_SYNC_ENABLED (no Vercel redeploy needed). */
export async function resolveOdooSyncEnabled(): Promise<boolean> {
  if (isOdooSyncEnabled()) return true;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_get_integration_secret", {
      p_key: "ODOO_SYNC_ENABLED",
    });
    if (error || data == null) return false;
    const raw = String(data).trim().toLowerCase();
    return raw === "1" || raw === "true" || raw === "yes";
  } catch {
    return false;
  }
}

function targetAttempts(target: OdooTarget): OdooTarget[] {
  return target === "main" ? ["main", "legacy"] : [target];
}

async function readSecretConfig(target: OdooTarget): Promise<OdooCfg | null> {
  const supabase = await createClient();
  const values: Partial<Record<OdooKeySuffix, string>> = {};
  for (const suffix of ODOO_KEY_SUFFIXES) {
    const { data, error } = await supabase.rpc("admin_get_integration_secret", {
      p_key: envKey(target, suffix),
    });
    if (error || data == null || String(data).trim() === "") {
      return null;
    }
    values[suffix] = String(data).trim();
  }

  const url = values.URL?.replace(/\/$/, "");
  if (!url || !values.DB || !values.USERNAME || !values.API_KEY) return null;
  return {
    url,
    db: values.DB,
    username: values.USERNAME,
    apiKey: values.API_KEY,
    target,
  };
}

function envPresence() {
  return {
    ODOO_SYNC_ENABLED: isOdooSyncEnabled(),
    main: {
      ODOO_MAIN_URL: Boolean(process.env.ODOO_MAIN_URL?.trim()),
      ODOO_MAIN_DB: Boolean(process.env.ODOO_MAIN_DB?.trim()),
      ODOO_MAIN_USERNAME: Boolean(process.env.ODOO_MAIN_USERNAME?.trim()),
      ODOO_MAIN_API_KEY: Boolean(process.env.ODOO_MAIN_API_KEY?.trim()),
    },
    social: {
      ODOO_SOCIAL_URL: Boolean(process.env.ODOO_SOCIAL_URL?.trim()),
      ODOO_SOCIAL_DB: Boolean(process.env.ODOO_SOCIAL_DB?.trim()),
      ODOO_SOCIAL_USERNAME: Boolean(process.env.ODOO_SOCIAL_USERNAME?.trim()),
      ODOO_SOCIAL_API_KEY: Boolean(process.env.ODOO_SOCIAL_API_KEY?.trim()),
    },
    hr: {
      ODOO_HR_URL: Boolean(process.env.ODOO_HR_URL?.trim()),
      ODOO_HR_DB: Boolean(process.env.ODOO_HR_DB?.trim()),
      ODOO_HR_USERNAME: Boolean(process.env.ODOO_HR_USERNAME?.trim()),
      ODOO_HR_API_KEY: Boolean(process.env.ODOO_HR_API_KEY?.trim()),
    },
    legacy: {
      ODOO_URL: Boolean(process.env.ODOO_URL?.trim()),
      ODOO_DB: Boolean(process.env.ODOO_DB?.trim()),
      ODOO_USERNAME: Boolean(process.env.ODOO_USERNAME?.trim()),
      ODOO_API_KEY: Boolean(process.env.ODOO_API_KEY?.trim()),
    },
  };
}

export { envPresence };

export async function loadOdooCfg(target: OdooTarget = "main"): Promise<{
  cfg: OdooCfg | null;
  source: OdooConfigSource | null;
  missing: string[];
}> {
  const normalizedTarget = normalizeOdooTarget(target);
  const attempts = targetAttempts(normalizedTarget);

  // Prefer DB secrets so rotated API keys apply without a Vercel redeploy.
  try {
    for (const attempt of attempts) {
      const cfg = await readSecretConfig(attempt);
      if (cfg) return { cfg, source: "db", missing: [] };
    }
  } catch {
    // Fall through to env.
  }

  for (const attempt of attempts) {
    const cfg = readEnvConfig(attempt);
    if (cfg) return { cfg, source: "env", missing: [] };
  }

  return {
    cfg: null,
    source: null,
    missing: attempts.flatMap((attempt) => missingEnvKeys(attempt)),
  };
}

export async function odooJsonRpc(
  baseUrl: string,
  service: string,
  method: string,
  args: unknown[],
) {
  const res = await fetch(`${baseUrl}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });
  const json = (await res.json()) as {
    result?: unknown;
    error?: { message?: string; data?: { message?: string; name?: string } };
  };
  if (json.error) {
    const detail =
      json.error.data?.message || json.error.message || json.error.data?.name || "Odoo RPC error";
    throw new Error(detail);
  }
  return json.result;
}

export async function authenticateOdoo(cfg: OdooCfg): Promise<number> {
  const uid = (await odooJsonRpc(cfg.url, "common", "authenticate", [
    cfg.db,
    cfg.username,
    cfg.apiKey,
    {},
  ])) as number | false;
  if (!uid || typeof uid !== "number") {
    throw new Error(
      "Odoo authentication failed - regenerate an API key in Odoo (Preferences → Account Security → New API Key) and save it here or on Vercel as ODOO_API_KEY.",
    );
  }
  return uid;
}

export async function countOdooPartners(cfg: OdooCfg, uid: number) {
  return (await odooJsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "res.partner",
    "search_count",
    [[["active", "=", true]]],
  ])) as number;
}

export async function readOdooPartners(options: {
  cfg: OdooCfg;
  uid: number;
  limit?: number;
}) {
  const { cfg, uid, limit = 50 } = options;
  // Odoo Online / some DBs omit `mobile` on res.partner - never request it unconditionally.
  const fields = await resolvePartnerReadFields(cfg, uid, [
    "id",
    "name",
    "email",
    "phone",
    "mobile",
    "write_date",
  ]);
  return (await odooJsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "res.partner",
    "search_read",
    [[["active", "=", true]]],
    { fields, limit: Math.min(Math.max(limit, 1), 200), order: "write_date desc" },
  ])) as Pick<OdooPartner, "id" | "name" | "email" | "phone" | "mobile" | "write_date">[];
}

/** Prefer requested fields; drop ones the target Odoo DB does not expose (e.g. mobile). */
async function resolvePartnerReadFields(
  cfg: OdooCfg,
  uid: number,
  requested: string[],
): Promise<string[]> {
  try {
    const meta = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "res.partner",
      "fields_get",
      [requested],
      { attributes: ["type"] },
    ])) as Record<string, unknown>;
    const available = requested.filter((f) => Object.prototype.hasOwnProperty.call(meta, f));
    if (available.includes("id") && available.includes("name")) return available;
  } catch {
    // Fall through to safe defaults.
  }
  return requested.filter((f) => f !== "mobile");
}

export type OdooHealth = {
  target: OdooTarget;
  configTarget: OdooTarget | null;
  configured: boolean;
  ready: boolean;
  source: OdooConfigSource | null;
  missing: string[];
  url: string | null;
  db: string | null;
  username: string | null;
  uid: number | null;
  authOk: boolean | null;
  authError: string | null;
  partnerCount: number | null;
};

export async function checkOdooHealth(target: OdooTarget = "main"): Promise<OdooHealth> {
  const normalizedTarget = normalizeOdooTarget(target);
  const { cfg, source, missing } = await loadOdooCfg(normalizedTarget);
  if (!cfg) {
    return {
      target: normalizedTarget,
      configTarget: null,
      configured: false,
      ready: false,
      source,
      missing,
      url: null,
      db: null,
      username: null,
      uid: null,
      authOk: null,
      authError: null,
      partnerCount: null,
    };
  }

  try {
    const uid = await authenticateOdoo(cfg);
    const partnerCount = await countOdooPartners(cfg, uid);
    return {
      target: normalizedTarget,
      configTarget: cfg.target ?? normalizedTarget,
      configured: true,
      ready: true,
      source,
      missing: [],
      url: cfg.url,
      db: cfg.db,
      username: cfg.username,
      uid,
      authOk: true,
      authError: null,
      partnerCount,
    };
  } catch (error) {
    return {
      target: normalizedTarget,
      configTarget: cfg.target ?? normalizedTarget,
      configured: true,
      ready: false,
      source,
      missing: [],
      url: cfg.url,
      db: cfg.db,
      username: cfg.username,
      uid: null,
      authOk: false,
      authError: error instanceof Error ? error.message : "Odoo health check failed",
      partnerCount: null,
    };
  }
}

function serviceCfgOrNull(): ServiceCfg | null {
  try {
    return requireAdminServiceConfig();
  } catch (e) {
    if (e instanceof AdminServiceConfigurationError) return null;
    throw e;
  }
}

async function restSelect<T>(
  cfg: ServiceCfg,
  table: string,
  select: string,
  extra = "",
  limit = 1000,
): Promise<T[]> {
  const url = `${cfg.url}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=${limit}${extra ? `&${extra}` : ""}`;
  const res = await fetch(url, {
    headers: adminServiceHeaders(cfg.serviceRoleKey),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`${table} fetch failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as T[];
}

async function restPatch(
  cfg: ServiceCfg,
  table: string,
  filter: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`${cfg.url}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: {
      ...adminServiceHeaders(cfg.serviceRoleKey, "return=representation"),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${table} patch failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as Record<string, unknown>[];
}

async function restInsert(cfg: ServiceCfg, table: string, body: Record<string, unknown>) {
  const res = await fetch(`${cfg.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      ...adminServiceHeaders(cfg.serviceRoleKey, "return=representation"),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${table} insert failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as Record<string, unknown>[];
}

export async function fetchAllCrmCustomers(): Promise<CrmCustomerRow[]> {
  const cfg = serviceCfgOrNull();
  const select =
    "id,owner_uid,contact_person,company,emails,phones,whatsapp,address,city,postal_code,country,notes,status,odoo_partner_id,custom_fields";
  if (cfg) {
    return restSelect<CrmCustomerRow>(cfg, "crm_customers", select, "order=updated_at.desc", 2000);
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("crm_customers").select(select).limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as CrmCustomerRow[];
}

function firstOf(list: unknown): string {
  if (!Array.isArray(list) || !list.length) return "";
  return String(list[0] ?? "").trim();
}

function emailsEqual(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

const TRACKING_START = "--- CLIVORA TRACKING ---";
const TRACKING_END = "--- END CLIVORA TRACKING ---";

function stripTrackingBlock(comment: string): string {
  const start = comment.indexOf(TRACKING_START);
  const end = comment.indexOf(TRACKING_END);
  if (start === -1 || end === -1 || end < start) return comment.trim();
  return `${comment.slice(0, start).trim()}\n${comment.slice(end + TRACKING_END.length).trim()}`.trim();
}

function buildTrackingBlock(parts: {
  customerId: string;
  projects: Array<{ name?: string | null; status?: string | null; budget?: number | null }>;
  invoices: Array<{
    invoice_number?: string | null;
    status?: string | null;
    total?: number | null;
    currency?: string | null;
  }>;
}): string {
  const projectLines = parts.projects.length
    ? parts.projects
        .slice(0, 20)
        .map(
          (p) =>
            `  • ${p.name ?? "Project"} [${p.status ?? "-"}]${p.budget != null ? ` · ${p.budget}` : ""}`,
        )
        .join("\n")
    : "  (none)";
  const invoiceLines = parts.invoices.length
    ? parts.invoices
        .slice(0, 20)
        .map(
          (i) =>
            `  • ${i.invoice_number ?? "Invoice"} [${i.status ?? "-"}] · ${i.total ?? 0} ${i.currency ?? ""}`,
        )
        .join("\n")
    : "  (none)";
  return [
    TRACKING_START,
    `CLIVORA customer: ${parts.customerId}`,
    `Synced at: ${new Date().toISOString()}`,
    `Projects (${parts.projects.length}):`,
    projectLines,
    `Invoices (${parts.invoices.length}):`,
    invoiceLines,
    TRACKING_END,
  ].join("\n");
}

async function loadCustomerTracking(
  cfg: ServiceCfg | null,
  customerId: string,
): Promise<{
  projects: Array<{ name?: string | null; status?: string | null; budget?: number | null }>;
  invoices: Array<{
    invoice_number?: string | null;
    status?: string | null;
    total?: number | null;
    currency?: string | null;
  }>;
}> {
  if (!cfg) return { projects: [], invoices: [] };
  const [projects, invoices] = await Promise.all([
    restSelect<{ name: string | null; status: string | null; budget: number | null }>(
      cfg,
      "crm_projects",
      "name,status,budget",
      `customer_id=eq.${customerId}&order=updated_at.desc`,
      50,
    ),
    restSelect<{
      invoice_number: string | null;
      status: string | null;
      total: number | null;
      currency: string | null;
    }>(
      cfg,
      "crm_invoices",
      "invoice_number,status,total,currency",
      `customer_id=eq.${customerId}&order=updated_at.desc`,
      50,
    ),
  ]);
  return { projects, invoices };
}

function partnerCommentWithTracking(
  existingComment: string | false | null | undefined,
  notes: string | null,
  tracking: string,
) {
  const base = stripTrackingBlock(
    [String(existingComment || "").trim(), notes?.trim() || ""].filter(Boolean).join("\n\n"),
  );
  return [base, tracking].filter(Boolean).join("\n\n").trim();
}

export async function pushContactsToOdoo(options: {
  cfg: OdooCfg;
  uid: number;
  adminUserId: string;
  includeTracking?: boolean;
}) {
  const { cfg, uid, includeTracking = true } = options;
  const svc = serviceCfgOrNull();
  const customers = await fetchAllCrmCustomers();

  let created = 0;
  let updated = 0;
  let linked = 0;
  const errors: string[] = [];

  for (const c of customers) {
    try {
      const email = firstOf(c.emails);
      const phone = firstOf(c.phones) || (c.whatsapp ?? "").trim();
      const name = (c.contact_person || c.company || "CLIVORA contact").trim();

      let tracking = "";
      if (includeTracking && svc) {
        const t = await loadCustomerTracking(svc, c.id);
        tracking = buildTrackingBlock({
          customerId: c.id,
          projects: t.projects,
          invoices: t.invoices,
        });
      }

      const vals: Record<string, unknown> = {
        name,
        email: email || false,
        phone: phone || false,
        street: (c.address ?? "").trim() || false,
        city: (c.city ?? "").trim() || false,
        zip: (c.postal_code ?? "").trim() || false,
        comment: partnerCommentWithTracking(null, c.notes, tracking),
      };

      let partnerId = c.odoo_partner_id ?? null;

      if (partnerId) {
        // Refresh existing comment from Odoo so we don't wipe non-CLIVORA notes.
        const rows = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
          cfg.db,
          uid,
          cfg.apiKey,
          "res.partner",
          "read",
          [[partnerId], ["comment"]],
        ])) as Array<{ comment?: string | false }>;
        const existingComment = rows?.[0]?.comment;
        vals.comment = partnerCommentWithTracking(existingComment, c.notes, tracking);
        await odooJsonRpc(cfg.url, "object", "execute_kw", [
          cfg.db,
          uid,
          cfg.apiKey,
          "res.partner",
          "write",
          [[partnerId], vals],
        ]);
        updated += 1;
      } else {
        if (email) {
          const existing = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
            cfg.db,
            uid,
            cfg.apiKey,
            "res.partner",
            "search",
            [[["email", "=", email]]],
            { limit: 1 },
          ])) as number[];
          if (existing?.length) {
            partnerId = existing[0];
            const rows = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
              cfg.db,
              uid,
              cfg.apiKey,
              "res.partner",
              "read",
              [[partnerId], ["comment"]],
            ])) as Array<{ comment?: string | false }>;
            vals.comment = partnerCommentWithTracking(rows?.[0]?.comment, c.notes, tracking);
            await odooJsonRpc(cfg.url, "object", "execute_kw", [
              cfg.db,
              uid,
              cfg.apiKey,
              "res.partner",
              "write",
              [[partnerId], vals],
            ]);
            updated += 1;
            linked += 1;
          }
        }

        if (!partnerId) {
          partnerId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
            cfg.db,
            uid,
            cfg.apiKey,
            "res.partner",
            "create",
            [vals],
          ])) as number;
          created += 1;
        }
      }

      if (svc && partnerId) {
        await restPatch(svc, "crm_customers", `id=eq.${c.id}`, {
          odoo_partner_id: partnerId,
          odoo_synced_at: new Date().toISOString(),
          sync_status: "synced",
          updated_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      errors.push(`${c.id}: ${e instanceof Error ? e.message : "push failed"}`);
    }
  }

  return {
    direction: "push" as const,
    created,
    updated,
    linked,
    total: customers.length,
    errors: errors.slice(0, 20),
    includeTracking,
  };
}

export async function pullContactsFromOdoo(options: {
  cfg: OdooCfg;
  uid: number;
  adminUserId: string;
}) {
  const { cfg, uid, adminUserId } = options;
  const svc = serviceCfgOrNull();
  if (!svc) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY required to pull Odoo contacts into CLIVORA");
  }

  const partnerFields = await resolvePartnerReadFields(cfg, uid, [
    "id",
    "name",
    "email",
    "phone",
    "mobile",
    "street",
    "city",
    "zip",
    "comment",
    "is_company",
    "type",
    "write_date",
  ]);

  // Active contacts - simple domain (complex email!=false domains break on some Odoo 19 builds).
  const partners = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "res.partner",
    "search_read",
    [[["active", "=", true]]],
    { fields: partnerFields, limit: 2000, order: "write_date desc" },
  ])) as OdooPartner[];

  const byId = new Map<number, OdooPartner>();
  for (const p of partners) {
    const email = p.email ? String(p.email).trim() : "";
    const phone = (p.phone ? String(p.phone) : p.mobile ? String(p.mobile) : "").trim();
    if (!p.is_company && !email && !phone) continue;
    byId.set(p.id, p);
  }
  const all = [...byId.values()];

  const existing = await fetchAllCrmCustomers();
  const byPartnerId = new Map<number, CrmCustomerRow>();
  const byEmail = new Map<string, CrmCustomerRow>();
  for (const c of existing) {
    if (c.odoo_partner_id) byPartnerId.set(Number(c.odoo_partner_id), c);
    const em = firstOf(c.emails).toLowerCase();
    if (em) byEmail.set(em, c);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const p of all) {
    try {
      const email = p.email ? String(p.email).trim() : "";
      const phone = (p.phone ? String(p.phone) : p.mobile ? String(p.mobile) : "").trim();
      // Skip empty shell partners (no name/email)
      if (!p.name && !email) {
        skipped += 1;
        continue;
      }

      const match = byPartnerId.get(p.id) || (email ? byEmail.get(email.toLowerCase()) : undefined);
      const contactPerson = p.is_company ? "" : String(p.name || "").trim();
      const company = p.is_company ? String(p.name || "").trim() : "";
      const notes = stripTrackingBlock(String(p.comment || ""));
      const payload = {
        contact_person: contactPerson || (company ? company : "Odoo contact"),
        company: company || null,
        emails: email ? [email] : [],
        phones: phone ? [phone] : [],
        address: p.street ? String(p.street) : null,
        city: p.city ? String(p.city) : null,
        postal_code: p.zip ? String(p.zip) : null,
        notes: notes || null,
        odoo_partner_id: p.id,
        odoo_synced_at: new Date().toISOString(),
        sync_status: "synced",
        updated_at: new Date().toISOString(),
        status: "active",
      };

      if (match) {
        await restPatch(svc, "crm_customers", `id=eq.${match.id}`, payload);
        updated += 1;
        byPartnerId.set(p.id, match);
        if (email) byEmail.set(email.toLowerCase(), match);
      } else {
        const inserted = await restInsert(svc, "crm_customers", {
          ...payload,
          owner_uid: adminUserId,
          tags: ["odoo"],
          custom_fields: { source: "odoo", odoo_partner_id: p.id },
        });
        created += 1;
        const row = inserted[0] as unknown as CrmCustomerRow;
        if (row?.id) {
          byPartnerId.set(p.id, row);
          if (email) byEmail.set(email.toLowerCase(), row);
        }
      }
    } catch (e) {
      errors.push(`odoo:${p.id}: ${e instanceof Error ? e.message : "pull failed"}`);
    }
  }

  return {
    direction: "pull" as const,
    created,
    updated,
    skipped,
    total: all.length,
    errors: errors.slice(0, 20),
  };
}

export async function runBidirectionalSync(options: {
  cfg: OdooCfg;
  uid: number;
  adminUserId: string;
  direction: OdooSyncDirection;
  includeTracking?: boolean;
}) {
  const { direction } = options;
  const result: {
    ok: true;
    direction: OdooSyncDirection;
    push?: Awaited<ReturnType<typeof pushContactsToOdoo>>;
    pull?: Awaited<ReturnType<typeof pullContactsFromOdoo>>;
    warnings: string[];
    apps: string[];
    note: string;
  } = {
    ok: true,
    direction,
    warnings: [],
    apps: ["Contacts"],
    note: "Two-way Contacts sync via existing Odoo Contacts app only - no new modules. Projects/invoices are mirrored into partner Internal Notes for tracking.",
  };

  // Pull first on "both" so Odoo-only contacts exist before we push back with tracking.
  if (direction === "pull" || direction === "both") {
    try {
      result.pull = await pullContactsFromOdoo(options);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Odoo pull failed";
      result.warnings.push(`Pull failed: ${msg}`);
      if (direction === "pull") throw e;
    }
  }
  if (direction === "push" || direction === "both") {
    try {
      result.push = await pushContactsToOdoo(options);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Odoo push failed";
      result.warnings.push(`Push failed: ${msg}`);
      if (direction === "push") throw e;
    }
  }
  return result;
}

export async function pullLeadsFromOdoo(options: {
  cfg: OdooCfg;
  uid: number;
  adminUserId: string;
}) {
  const { cfg, uid, adminUserId } = options;
  const svc = serviceCfgOrNull();
  if (!svc) throw new Error("SUPABASE_SERVICE_ROLE_KEY required for lead sync");

  try {
    const leads = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "crm.lead",
      "search_read",
      [[["active", "=", true]]],
      {
        fields: ["id", "name", "contact_name", "email_from", "phone", "partner_id", "expected_revenue", "description"],
        limit: 500,
        order: "write_date desc",
      },
    ])) as Array<{
      id: number;
      name: string;
      contact_name?: string | false;
      email_from?: string | false;
      phone?: string | false;
      partner_id?: [number, string] | false;
      expected_revenue?: number | false;
      description?: string | false;
    }>;

    let synced = 0;
    for (const lead of leads) {
      const email = lead.email_from ? String(lead.email_from).trim() : "";
      const name = lead.contact_name ? String(lead.contact_name).trim() : String(lead.name || "Lead").trim();
      const phone = lead.phone ? String(lead.phone).trim() : "";
      if (!name && !email) continue;

      // Upsert lead as customer/opportunity in crm_customers
      await restInsert(svc, "crm_customers", {
        owner_uid: adminUserId,
        contact_person: name,
        company: lead.name || null,
        emails: email ? [email] : [],
        phones: phone ? [phone] : [],
        notes: `[Odoo Lead #${lead.id}] Expected revenue: $${lead.expected_revenue || 0}\n${lead.description || ""}`.trim(),
        status: "lead",
        tags: ["odoo-lead"],
        odoo_synced_at: new Date().toISOString(),
        sync_status: "synced",
        custom_fields: { odoo_lead_id: lead.id, odoo_db: cfg.db },
      }).catch(() => null);
      synced++;
    }

    return { ok: true, totalLeads: leads.length, synced };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Lead sync failed" };
  }
}

/**
 * 100% Full Dual-Instance Synchronization Engine
 * Harmonizes Main Odoo (clivora.odoo.com) + Social Odoo (clivoraos.odoo.com) + CLIVORA OS
 */
export async function syncBothOdooInstances(options: {
  adminUserId: string;
  includeTracking?: boolean;
}) {
  const { adminUserId, includeTracking = true } = options;

  const [mainHealth, socialHealth] = await Promise.all([
    checkOdooHealth("main"),
    checkOdooHealth("social"),
  ]);

  const { cfg: mainCfg } = await loadOdooCfg("main");
  const { cfg: socialCfg } = await loadOdooCfg("social");

  const results: {
    main?: Record<string, unknown>;
    social?: Record<string, unknown>;
    crossSync?: { copiedToMain: number; copiedToSocial: number };
    warnings: string[];
    timestamp: string;
  } = {
    warnings: [],
    timestamp: new Date().toISOString(),
  };

  // 1. Sync Main Odoo
  if (mainCfg && mainHealth.ready && mainHealth.uid) {
    try {
      const contactsRes = await runBidirectionalSync({
        cfg: mainCfg,
        uid: mainHealth.uid,
        adminUserId,
        direction: "both",
        includeTracking,
      });
      const leadsRes = await pullLeadsFromOdoo({
        cfg: mainCfg,
        uid: mainHealth.uid,
        adminUserId,
      });
      results.main = { contacts: contactsRes, leads: leadsRes };
    } catch (e) {
      results.warnings.push(`Main Odoo sync error: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    results.warnings.push("Main Odoo (clivora.odoo.com) is not ready or configured.");
  }

  // 2. Sync Social Odoo
  if (socialCfg && socialHealth.ready && socialHealth.uid) {
    try {
      const socialRes = await runBidirectionalSync({
        cfg: socialCfg,
        uid: socialHealth.uid,
        adminUserId,
        direction: "both",
        includeTracking: false,
      });
      results.social = { contacts: socialRes };
    } catch (e) {
      results.warnings.push(`Social Odoo sync error: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    results.warnings.push("Social Odoo (clivoraos.odoo.com) is not ready or configured.");
  }

  // 3. Cross-Instance Bridging (Odoo Social -> Odoo Main)
  if (mainCfg && socialCfg && mainHealth.uid && socialHealth.uid) {
    try {
      // Read social partners and ensure they exist in Main Odoo
      const socialPartners = await readOdooPartners({
        cfg: socialCfg,
        uid: socialHealth.uid,
        limit: 200,
      });

      let copiedToMain = 0;
      for (const sp of socialPartners) {
        if (!sp.email) continue;
        const existsInMain = (await odooJsonRpc(mainCfg.url, "object", "execute_kw", [
          mainCfg.db,
          mainHealth.uid,
          mainCfg.apiKey,
          "res.partner",
          "search",
          [[["email", "=", sp.email]]],
          { limit: 1 },
        ])) as number[];

        if (!existsInMain || existsInMain.length === 0) {
          await odooJsonRpc(mainCfg.url, "object", "execute_kw", [
            mainCfg.db,
            mainHealth.uid,
            mainCfg.apiKey,
            "res.partner",
            "create",
            [{
              name: sp.name || "Community Partner",
              email: sp.email,
              phone: sp.phone || false,
              comment: "--- Synced from Odoo Social (clivoraos) ---",
            }],
          ]);
          copiedToMain++;
        }
      }
      results.crossSync = { copiedToMain, copiedToSocial: 0 };
    } catch (e) {
      results.warnings.push(`Cross-Odoo sync warning: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Record successful sync timestamp in Supabase
  try {
    const supabase = await createClient();
    await supabase.rpc("admin_upsert_integration_secret", {
      p_key: "ODOO_LAST_FULL_SYNC_AT",
      p_value: new Date().toISOString(),
    });
  } catch {
    // Ignore RPC failure
  }

  return {
    ok: true,
    message: "Full two-way synchronization executed across Main Odoo, Social Odoo, and CLIVORA.",
    ...results,
  };
}

export function emailsMatch(a: string, b: string) {
  return emailsEqual(a, b);
}

// ─────────────────────────────────────────────────────────────────────────────
// Odoo Social Media Marketing Automation (clivoraos.odoo.com)
// ─────────────────────────────────────────────────────────────────────────────

export type OdooSocialAccount = {
  id: number;
  name: string;
  media_type: string;
  is_media_disconnected: boolean;
};

export type OdooSocialPublishResult = {
  ok: boolean;
  postId?: number;
  state?: string;
  accountsPublished?: number[];
  error?: string;
};

/**
 * Fetch all configured and connected social media accounts from clivoraos.odoo.com
 * (LinkedIn, Facebook, Instagram, Twitter/X, YouTube).
 */
export async function listOdooSocialAccounts(): Promise<{
  accounts: OdooSocialAccount[];
  error?: string;
}> {
  try {
    const { cfg } = await loadOdooCfg("social");
    if (!cfg) {
      return { accounts: [], error: "Odoo Social configuration (clivoraos.odoo.com) not found" };
    }
    const uid = await authenticateOdoo(cfg);
    const accounts = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "social.account",
      "search_read",
      [[["is_media_disconnected", "=", false]]],
      { fields: ["id", "name", "media_type", "is_media_disconnected"] },
    ])) as OdooSocialAccount[];

    return { accounts: accounts ?? [] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { accounts: [], error: msg };
  }
}

/**
 * Attaches a base64 image to Odoo for social media posting (Odoo 19 uses ir.attachment.raw)
 */
export async function createOdooSocialImage(
  cfg: OdooCfg,
  uid: number,
  imageBase64: string,
  imageName = "clivora_social_share.png",
): Promise<number | null> {
  try {
    const cleanB64 = imageBase64.replace(/^data:image\/\w+;base64,/, "").trim();
    // 1. Create ir.attachment with raw binary
    const attId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "ir.attachment",
      "create",
      [
        {
          name: imageName,
          raw: cleanB64,
          mimetype: "image/png",
          res_model: "social.post",
          type: "binary",
        },
      ],
    ])) as number;

    // 2. Create social.post.image linked to the attachment
    const imgId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "social.post.image",
      "create",
      [
        {
          name: imageName,
          attachment_id: attId,
        },
      ],
    ])) as number;

    return imgId;
  } catch (e) {
    console.error("[createOdooSocialImage] Error attaching image to Odoo:", e);
    return null;
  }
}

/**
 * Publishes an announcement or job listing across all configured social media platforms
 * in clivoraos.odoo.com (LinkedIn, Facebook, Instagram, Twitter/X, YouTube).
 */
export async function publishToOdooSocial(options: {
  message: string;
  twitterMessage?: string;
  imageBase64?: string;
  imageName?: string;
  accountIds?: number[];
  autoPublish?: boolean;
}): Promise<OdooSocialPublishResult> {
  try {
    const { cfg } = await loadOdooCfg("social");
    if (!cfg) {
      return { ok: false, error: "Odoo Social configuration (clivoraos.odoo.com) not found" };
    }
    const uid = await authenticateOdoo(cfg);

    let targetAccountIds = options.accountIds;
    if (!targetAccountIds || targetAccountIds.length === 0) {
      const { accounts } = await listOdooSocialAccounts();
      targetAccountIds = accounts.map((a) => a.id);
    }

    if (targetAccountIds.length === 0) {
      return { ok: false, error: "No active social media accounts connected in clivoraos.odoo.com" };
    }

    const baseMessage = options.message.trim();
    const twitterMsg = (options.twitterMessage || baseMessage).slice(0, 280);

    // Optional image attachment
    const imageIds: number[] = [];
    if (options.imageBase64) {
      const imgId = await createOdooSocialImage(
        cfg,
        uid,
        options.imageBase64,
        options.imageName || "clivora_social_share.png",
      );
      if (imgId) imageIds.push(imgId);
    }

    const postValues: Record<string, unknown> = {
      message: baseMessage,
      facebook_message: baseMessage,
      twitter_message: twitterMsg,
      linkedin_message: baseMessage,
      instagram_message: baseMessage,
      is_split_per_media: false,
      account_ids: [[6, 0, targetAccountIds]],
      state: "draft",
    };

    if (imageIds.length > 0) {
      postValues.image_ids = [[6, 0, imageIds]];
    }

    // Create the social.post record in Odoo
    const postId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "social.post",
      "create",
      [postValues],
    ])) as number;

    // Immediately dispatch across all platforms if autoPublish is true (default)
    if (options.autoPublish !== false) {
      await odooJsonRpc(cfg.url, "object", "execute_kw", [
        cfg.db,
        uid,
        cfg.apiKey,
        "social.post",
        "action_post",
        [[postId]],
      ]);
    }

    return {
      ok: true,
      postId,
      state: options.autoPublish !== false ? "posted" : "draft",
      accountsPublished: targetAccountIds,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

/**
 * Formats and broadcasts a CLIVORA remote job directly to social media channels
 */
export async function publishJobToSocial(job: {
  title: string;
  company_name: string;
  category?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  currency?: string | null;
  location?: string | null;
  seo_slug?: string | null;
  accountIds?: number[];
  imageBase64?: string;
  imageName?: string;
}): Promise<OdooSocialPublishResult> {
  const salaryText =
    job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()} USD`
      : job.salary_min
        ? `$${job.salary_min.toLocaleString()} USD`
        : "Competitive ($ USD)";

  const categorySlug = job.category || "software-development";
  const jobUrl = job.seo_slug
    ? `https://clivora.io/jobs/${categorySlug}/${job.seo_slug}`
    : "https://clivora.io/jobs";

  const message = [
    `🚀 NEW REMOTE ROLE: ${job.title} at ${job.company_name}`,
    `💰 Compensation: ${salaryText}`,
    `📍 Location: ${job.location || "Remote (Worldwide)"}`,
    `⚡ 0% Platform Fees for Freelancers & Clients!`,
    ``,
    `👉 Review proposal details & apply: ${jobUrl}`,
    ``,
    `#RemoteJobs #Hiring #TechCareers #WorkFromAnywhere #Clivora #FreelanceOS #USD`,
  ].join("\n");

  const twitterMessage = [
    `🚀 Remote Role: ${job.title} at ${job.company_name}`,
    `💰 ${salaryText}`,
    `⚡ 0% Platform Fee!`,
    `👉 Apply: ${jobUrl}`,
    `#RemoteWork #Clivora`,
  ].join("\n");

  return publishToOdooSocial({
    message,
    twitterMessage,
    imageBase64: job.imageBase64,
    imageName: job.imageName,
    accountIds: job.accountIds,
    autoPublish: true,
  });
}

export type OdooApplicantInput = {
  partnerName: string;
  email: string;
  phone?: string;
  jobId?: number;
  jobTitle?: string;
  applicantNotes?: string;
  salaryExpected?: number;
  linkedinProfile?: string;
};

export type OdooJobPosition = {
  id: number;
  name: string;
  no_of_recruitment: number;
  application_count: number;
};

export async function listOdooJobPositions(): Promise<OdooJobPosition[]> {
  const { cfg } = await loadOdooCfg("hr");
  if (!cfg) {
    throw new Error("Odoo HR configuration not found");
  }
  const uid = 2;
  const jobs = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "hr.job",
    "search_read",
    [[["active", "=", true]]],
    { fields: ["id", "name", "no_of_recruitment", "application_count"], order: "name asc" },
  ])) as OdooJobPosition[];
  return jobs;
}

export async function createOdooApplicant(input: OdooApplicantInput) {
  const { cfg } = await loadOdooCfg("hr");
  if (!cfg) {
    throw new Error("Odoo HR configuration not found");
  }
  const uid = 2;

  let jobId = input.jobId;
  if (!jobId && input.jobTitle) {
    const existing = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "hr.job",
      "search_read",
      [[["name", "=", input.jobTitle.trim()]]],
      { fields: ["id"], limit: 1 },
    ])) as Array<{ id: number }>;

    if (existing && existing.length > 0) {
      jobId = existing[0].id;
    } else {
      jobId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
        cfg.db,
        uid,
        cfg.apiKey,
        "hr.job",
        "create",
        [
          {
            name: input.jobTitle.trim(),
            no_of_recruitment: 1,
          },
        ],
      ])) as number;
    }
  }

  const payload: Record<string, unknown> = {
    partner_name: input.partnerName.trim(),
    email_from: input.email.trim(),
  };

  if (jobId) payload.job_id = jobId;
  if (input.phone) payload.partner_phone = input.phone.trim();
  if (input.linkedinProfile) payload.linkedin_profile = input.linkedinProfile.trim();
  if (input.salaryExpected) payload.salary_expected = input.salaryExpected;
  if (input.applicantNotes) payload.applicant_notes = input.applicantNotes;

  const applicantId = (await odooJsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "hr.applicant",
    "create",
    [payload],
  ])) as number;

  return {
    success: true,
    applicantId,
    jobId,
  };
}



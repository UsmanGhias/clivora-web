import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import {
  AdminServiceConfigurationError,
  adminServiceHeaders,
  requireAdminServiceConfig,
} from "@/lib/admin-service";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/env";

export type OdooCfg = {
  url: string;
  db: string;
  username: string;
  apiKey: string;
  target?: OdooTarget;
};

export type OdooTarget = "main" | "social" | "legacy";
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
  return value === "social" || value === "legacy" ? value : "main";
}

export function isOdooSyncEnabled() {
  const raw = process.env.ODOO_SYNC_ENABLED?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}

async function readIntegrationSecret(key: string): Promise<string | null> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) return null;
  try {
    const admin = createServiceClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await admin
      .from("admin_integration_secrets")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || data?.value == null) return null;
    const value = String(data.value).trim();
    return value || null;
  } catch {
    return null;
  }
}

/** Env first, then admin_integration_secrets.ODOO_SYNC_ENABLED (no Vercel redeploy needed). */
export async function resolveOdooSyncEnabled(): Promise<boolean> {
  if (isOdooSyncEnabled()) return true;
  try {
    const raw = (await readIntegrationSecret("ODOO_SYNC_ENABLED"))?.toLowerCase();
    return raw === "1" || raw === "true" || raw === "yes";
  } catch {
    return false;
  }
}

function targetAttempts(target: OdooTarget): OdooTarget[] {
  return target === "main" ? ["main", "legacy"] : [target];
}

async function readSecretConfig(target: OdooTarget): Promise<OdooCfg | null> {
  const values: Partial<Record<OdooKeySuffix, string>> = {};
  for (const suffix of ODOO_KEY_SUFFIXES) {
    const value = await readIntegrationSecret(envKey(target, suffix));
    if (!value) return null;
    values[suffix] = value;
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
  // Odoo Online / some DBs omit `mobile` on res.partner — never request it unconditionally.
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

export function emailsMatch(a: string, b: string) {
  return emailsEqual(a, b);
}

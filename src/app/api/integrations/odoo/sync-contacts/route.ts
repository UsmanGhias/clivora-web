import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import {
  authenticateOdoo,
  envPresence,
  loadOdooCfg,
  odooJsonRpc,
  runBidirectionalSync,
  type OdooSyncDirection,
} from "@/lib/odoo-sync";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only two-way Odoo Contacts sync (existing free Contacts app only).
 * POST body: { direction?: "push"|"pull"|"both", action?: "test", includeTracking?: boolean }
 */
export async function POST(request: Request) {
  let admin;
  try {
    admin = await requireAdmin({ requireAal2: false });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    direction?: OdooSyncDirection;
    includeTracking?: boolean;
  };

  if (body.action === "test") {
    const { cfg: odoo, source, missing } = await loadOdooCfg();
    if (!odoo) {
      return adminJson(
        { ok: false, configured: false, missing, error: "Odoo is not configured" },
        { status: 503 },
      );
    }
    try {
      const uid = await authenticateOdoo(odoo);
      const partnerCount = (await odooJsonRpc(odoo.url, "object", "execute_kw", [
        odoo.db,
        uid,
        odoo.apiKey,
        "res.partner",
        "search_count",
        [[["active", "=", true]]],
      ])) as number;
      return adminJson({
        ok: true,
        configured: true,
        source,
        url: odoo.url,
        db: odoo.db,
        username: odoo.username,
        uid,
        partnerCount,
      });
    } catch (e) {
      return adminJson(
        {
          ok: false,
          configured: true,
          source,
          url: odoo.url,
          error: e instanceof Error ? e.message : "Odoo test failed",
        },
        { status: 502 },
      );
    }
  }

  const { cfg: odoo, missing } = await loadOdooCfg();
  if (!odoo) {
    return adminJson(
      {
        error: "Odoo is not configured",
        missing,
        hint: "Set ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY on Vercel and redeploy, or save them in Admin → Integrations.",
      },
      { status: 503 },
    );
  }

  const direction: OdooSyncDirection =
    body.direction === "push" || body.direction === "pull" || body.direction === "both"
      ? body.direction
      : "both";

  try {
    const uid = await authenticateOdoo(odoo);
    const result = await runBidirectionalSync({
      cfg: odoo,
      uid,
      adminUserId: admin.id,
      direction,
      includeTracking: body.includeTracking !== false,
    });
    return adminJson(result);
  } catch (e) {
    return adminJson(
      { error: e instanceof Error ? e.message : "Odoo sync failed" },
      { status: 502 },
    );
  }
}

export async function GET() {
  try {
    await requireAdmin({ requireAal2: false });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const { cfg: odoo, source, missing } = await loadOdooCfg();
  let authOk: boolean | null = null;
  let authError: string | null = null;
  let partnerCount: number | null = null;
  if (odoo) {
    try {
      const uid = await authenticateOdoo(odoo);
      authOk = true;
      partnerCount = (await odooJsonRpc(odoo.url, "object", "execute_kw", [
        odoo.db,
        uid,
        odoo.apiKey,
        "res.partner",
        "search_count",
        [[["active", "=", true]]],
      ])) as number;
    } catch (e) {
      authOk = false;
      authError = e instanceof Error ? e.message : "Odoo auth failed";
    }
  }

  return adminJson({
    configured: !!odoo,
    ready: !!odoo && authOk === true,
    source,
    missing,
    envPresence: envPresence(),
    url: odoo?.url ?? null,
    db: odoo?.db ?? null,
    username: odoo?.username ?? null,
    authOk,
    authError,
    partnerCount,
    allowedApps: ["Contacts"],
    modes: ["push", "pull", "both"],
    surface: "admin-only",
    note: "Two-way Contacts sync. Projects/invoices are written into Odoo partner Internal Notes for tracking — no new Odoo modules.",
  });
}

/** Save / refresh Odoo secrets into admin_integration_secrets (admin session). */
export async function PUT(request: Request) {
  try {
    await requireAdmin({ requireAal2: false });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const body = (await request.json().catch(() => ({}))) as {
    url?: string;
    db?: string;
    username?: string;
    apiKey?: string;
  };

  const url = (body.url ?? "https://clivora.odoo.com").trim().replace(/\/$/, "");
  const db = (body.db ?? "clivora").trim();
  const username = (body.username ?? "").trim();
  const apiKey = (body.apiKey ?? "").trim();

  if (!username || !apiKey) {
    return adminJson({ error: "username and apiKey are required" }, { status: 400 });
  }

  try {
    await authenticateOdoo({ url, db, username, apiKey });
  } catch (e) {
    return adminJson(
      {
        error: e instanceof Error ? e.message : "Odoo authentication failed",
        saved: false,
      },
      { status: 401 },
    );
  }

  const supabase = await createClient();
  const pairs: Array<[string, string]> = [
    ["ODOO_URL", url],
    ["ODOO_DB", db],
    ["ODOO_USERNAME", username],
    ["ODOO_API_KEY", apiKey],
  ];
  for (const [key, value] of pairs) {
    const { error } = await supabase.rpc("admin_upsert_integration_secret", {
      p_key: key,
      p_value: value,
    });
    if (error) {
      return adminJson(
        { error: `Could not save ${key}: ${error.message}`, saved: false },
        { status: 500 },
      );
    }
  }

  return adminJson({
    ok: true,
    saved: true,
    url,
    db,
    username,
    note: "Secrets stored in admin_integration_secrets. Prefer also setting the same ODOO_* keys on Vercel for env-first loads.",
  });
}

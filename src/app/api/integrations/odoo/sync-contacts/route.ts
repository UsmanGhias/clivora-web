import { adminErrorResponse, adminJson, requireAdmin } from "@/lib/admin-auth";
import {
  authenticateOdoo,
  checkOdooHealth,
  envPresence,
  loadOdooCfg,
  resolveOdooSyncEnabled,
  runBidirectionalSync,
  type OdooTarget,
  type OdooSyncDirection,
} from "@/lib/odoo-sync";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Admin-only Odoo Contacts status + bidirectional write sync (Main + Social).
 * POST body: { direction?: "push"|"pull"|"both", action?: "test", includeTracking?: boolean, force?: boolean, target?: "main"|"social"|"legacy" }
 */
export async function POST(request: Request) {
  // Sensitive writes (force sync / contact write) require AAL2; health "test" allows AAL1.
  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    direction?: OdooSyncDirection;
    includeTracking?: boolean;
    force?: boolean;
    target?: OdooTarget;
  };

  const isReadProbe = body.action === "test";
  try {
    await requireAdmin({ requireAal2: !isReadProbe });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const syncEnabled = await resolveOdooSyncEnabled();

  if (isReadProbe) {
    const [main, social] = await Promise.all([checkOdooHealth("main"), checkOdooHealth("social")]);
    return adminJson({
      ok: main.ready || social.ready,
      syncEnabled,
      envPresence: envPresence(),
      targets: { main, social },
    });
  }

  if (!syncEnabled && !body.force) {
    return adminJson(
      {
        error: "Odoo write sync is disabled.",
        syncEnabled: false,
        hint: "Set ODOO_SYNC_ENABLED=true in Admin secrets or Vercel, or use the explicit admin force action.",
      },
      { status: 403 },
    );
  }

  let admin;
  try {
    admin = await requireAdmin({ requireAal2: true });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const target: OdooTarget =
    body.target === "social" || body.target === "legacy" ? body.target : "main";

  const { cfg: odoo, missing } = await loadOdooCfg(target);
  if (!odoo) {
    return adminJson(
      {
        error: "Odoo is not configured",
        missing,
        hint: "Save credentials in Admin -> Integrations, or set ODOO_MAIN_* / ODOO_SOCIAL_* secrets.",
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
    return adminJson({
      ...result,
      target: odoo.target ?? target,
      syncEnabled,
      warnings: [
        ...(!syncEnabled
          ? ["ODOO_SYNC_ENABLED is false; sync was run only because an admin explicitly forced it."]
          : []),
        ...result.warnings,
      ],
    });
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

  const syncEnabled = await resolveOdooSyncEnabled();
  const [main, social] = await Promise.all([checkOdooHealth("main"), checkOdooHealth("social")]);

  return adminJson({
    configured: main.configured || social.configured,
    ready: main.ready || social.ready,
    syncEnabled,
    envPresence: envPresence(),
    targets: { main, social },
    allowedApps: ["Contacts"],
    modes: ["push", "pull", "both"],
    surface: "admin-only",
    note: syncEnabled
      ? "Write sync is enabled. Health checks are live for Main and Social. Use sync controls to push/pull Contacts."
      : "Write sync is disabled. Health checks authenticate and count partners. Enable ODOO_SYNC_ENABLED to allow write sync.",
  });
}

/** Save / refresh Odoo secrets into admin_integration_secrets (admin session). */
export async function PUT(request: Request) {
  try {
    await requireAdmin({ requireAal2: true });
  } catch (e) {
    return adminErrorResponse(e);
  }

  const body = (await request.json().catch(() => ({}))) as {
    url?: string;
    db?: string;
    username?: string;
    apiKey?: string;
    target?: OdooTarget;
  };

  const target: OdooTarget =
    body.target === "social" || body.target === "legacy" ? body.target : "main";
  const url = (body.url ?? "").trim().replace(/\/$/, "");
  const db = (body.db ?? "").trim();
  const username = (body.username ?? "").trim();
  const apiKey = (body.apiKey ?? "").trim();

  if (!url || !db || !username || !apiKey) {
    return adminJson({ error: "url, db, username, and apiKey are required" }, { status: 400 });
  }

  try {
    await authenticateOdoo({ url, db, username, apiKey, target });
  } catch (e) {
    return adminJson(
      {
        error: e instanceof Error ? e.message : "Odoo authentication failed",
        saved: false,
      },
      { status: 401 },
    );
  }

  let service;
  try {
    const cfg = requireAdminServiceConfig();
    service = createServiceClient(cfg.url || SUPABASE_URL, cfg.serviceRoleKey, {
      auth: { persistSession: false },
    });
  } catch {
    return adminJson({ error: "Admin service configuration is unavailable", saved: false }, { status: 503 });
  }

  const prefix =
    target === "social" ? "ODOO_SOCIAL" : target === "legacy" ? "ODOO" : "ODOO_MAIN";
  const pairs: Array<[string, string]> = [
    [`${prefix}_URL`, url],
    [`${prefix}_DB`, db],
    [`${prefix}_USERNAME`, username],
    [`${prefix}_API_KEY`, apiKey],
  ];
  for (const [key, value] of pairs) {
    const { error } = await service.from("admin_integration_secrets").upsert(
      {
        key,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );
    if (error) {
      console.error("[odoo/sync-contacts] secret upsert failed", key, error.message);
      return adminJson({ error: `Could not save ${key}`, saved: false }, { status: 500 });
    }
  }

  return adminJson({
    ok: true,
    saved: true,
    target,
    url,
    db,
    username,
    note: `Secrets stored in admin_integration_secrets as ${prefix}_*. Runtime prefers DB secrets over env so rotated keys apply immediately.`,
  });
}

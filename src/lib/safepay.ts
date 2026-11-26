import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { createClient } from "@/lib/supabase/server";
import { isSafepayPaidState } from "@/lib/security-utils";

export type SafepayEnv = "sandbox" | "production";

function envName(rawValue?: string | null): SafepayEnv {
  const raw = (rawValue || "production").trim().toLowerCase();
  return raw === "sandbox" || raw === "development" ? "sandbox" : "production";
}

function apiHost(env: SafepayEnv) {
  return env === "sandbox" ? "https://sandbox.api.getsafepay.com" : "https://api.getsafepay.com";
}

async function readDbSecret(key: string): Promise<string | null> {
  try {
    try {
      const { url, serviceRoleKey } = requireAdminServiceConfig();
      const admin = createServiceClient(url, serviceRoleKey, {
        auth: { persistSession: false },
      });
      const { data, error } = await admin
        .from("admin_integration_secrets")
        .select("value")
        .eq("key", key)
        .maybeSingle();
      if (!error && data?.value) {
        const value = String(data.value).trim();
        if (value) return value;
      }
    } catch {
      // Fall back to admin cookie RPC if service role key is absent in local dev.
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("admin_get_integration_secret", { p_key: key });
    if (error || data == null) return null;
    const value = String(data).trim();
    return value || null;
  } catch {
    return null;
  }
}

export async function loadSafepayConfig(): Promise<{
  secretKey: string | null;
  apiKey: string | null;
  webhookSecret: string | null;
  env: SafepayEnv;
  configured: boolean;
  missing: string[];
}> {
  // Prefer DB env so sandbox/production can be flipped without a Vercel redeploy.
  let safepayEnv = await readDbSecret("SAFEPAY_ENV");
  if (!safepayEnv) safepayEnv = process.env.SAFEPAY_ENV?.trim() || null;
  let secretKey = process.env.SAFEPAY_SECRET_KEY?.trim() || null;
  let apiKey =
    process.env.SAFEPAY_API_KEY?.trim() ||
    process.env.SAFEPAY_PUBLIC_KEY?.trim() ||
    process.env.SAFEPAY_MERCHANT_API_KEY?.trim() ||
    null;
  let webhookSecret = process.env.SAFEPAY_WEBHOOK_SECRET?.trim() || null;

  if (!secretKey) secretKey = await readDbSecret("SAFEPAY_SECRET_KEY");
  if (!apiKey) apiKey = await readDbSecret("SAFEPAY_API_KEY");
  if (!apiKey) apiKey = await readDbSecret("SAFEPAY_PUBLIC_KEY");
  if (!webhookSecret) webhookSecret = await readDbSecret("SAFEPAY_WEBHOOK_SECRET");
  const env = envName(safepayEnv || "sandbox");

  if (!apiKey && secretKey?.startsWith("sec_")) {
    apiKey = secretKey;
  }

  const missing: string[] = [];
  if (!secretKey) missing.push("SAFEPAY_SECRET_KEY");
  if (!apiKey) missing.push("SAFEPAY_API_KEY");
  else if (!/^sec_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(apiKey)) {
    missing.push("SAFEPAY_API_KEY(must look like sec_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)");
  }

  return {
    secretKey,
    apiKey,
    webhookSecret,
    env,
    configured: Boolean(
      secretKey &&
        apiKey &&
        /^sec_[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          apiKey,
        ),
    ),
    missing,
  };
}

async function safepayFetch(
  path: string,
  opts: { secretKey: string; env: SafepayEnv; method?: string; body?: unknown },
) {
  const method = opts.method ?? "POST";
  const res = await fetch(`${apiHost(opts.env)}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${opts.secretKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: method === "GET" || opts.body == null ? undefined : JSON.stringify(opts.body),
    cache: "no-store",
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const message =
      typeof json === "object" && json && "message" in json
        ? String((json as { message?: string }).message)
        : text.slice(0, 240) || `Safepay HTTP ${res.status}`;
    throw new Error(message);
  }
  return json as Record<string, unknown>;
}

function digTracker(payload: Record<string, unknown>): string | null {
  const data = (payload.data ?? payload) as Record<string, unknown>;
  const nested = data.tracker;
  if (typeof nested === "string" && nested.trim()) return nested.trim();
  if (nested && typeof nested === "object") {
    const token = (nested as { token?: unknown }).token;
    if (typeof token === "string" && token.trim()) return token.trim();
  }
  if (typeof data.token === "string" && data.token.trim()) return data.token.trim();
  if (typeof payload.tracker === "string" && payload.tracker.trim()) return payload.tracker.trim();
  return null;
}

export async function createSafepayCheckout(input: {
  amountUsd: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  customerName: string;
  plan: string;
  accountType: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ checkoutUrl: string; tracker: string; env: SafepayEnv }> {
  const cfg = await loadSafepayConfig();
  if (!cfg.configured || !cfg.secretKey || !cfg.apiKey) {
    throw new Error(
      `Safepay is not configured. Missing/invalid: ${cfg.missing.join(", ") || "keys"}. Public key must be exactly sec_ + UUID (with hyphens).`,
    );
  }

  const currency = (input.currency || process.env.SAFEPAY_CURRENCY || "USD").toUpperCase();
  const amountMinor = Math.max(1, Math.round(input.amountUsd * 100));

  const session = await safepayFetch("/order/payments/v3/", {
    secretKey: cfg.secretKey,
    env: cfg.env,
    body: {
      merchant_api_key: cfg.apiKey,
      intent: "CYBERSOURCE",
      mode: "payment",
      currency,
      amount: amountMinor,
      metadata: {
        order_id: input.orderId,
        plan: input.plan,
        account_type: input.accountType,
        email: input.customerEmail,
        name: input.customerName,
        product: "clivora_pro",
      },
    },
  });

  const tracker = digTracker(session);
  if (!tracker) throw new Error("Safepay did not return a payment tracker");

  const passport = await safepayFetch("/client/passport/v1/token", {
    secretKey: cfg.secretKey,
    env: cfg.env,
    body: {},
  });
  const tbt = String(
    (passport.data as string | undefined) ||
      (passport as { token?: string }).token ||
      "",
  ).trim();
  if (!tbt) throw new Error("Safepay passport token missing");

  const base =
    cfg.env === "sandbox"
      ? "https://sandbox.api.getsafepay.com/embedded/"
      : "https://getsafepay.com/embedded/";
  const params = new URLSearchParams({
    environment: cfg.env,
    tbt,
    tracker,
    source: "hosted",
    order_id: input.orderId,
    redirect_url: input.successUrl,
    cancel_url: input.cancelUrl,
  });

  return {
    checkoutUrl: `${base}?${params.toString()}`,
    tracker,
    env: cfg.env,
  };
}

/** Parse minor-unit integer amount if reporter/webhook returns one. */
export function parseSafepayAmountMinor(rawObj: Record<string, unknown>): number | null {
  const candidates = [
    rawObj.amount,
    rawObj.amount_minor,
    rawObj.total,
    (rawObj.tracker as Record<string, unknown> | undefined)?.amount,
  ];
  for (const val of candidates) {
    if (typeof val === "number" && Number.isFinite(val) && val > 0) {
      return Math.round(val);
    }
    if (typeof val === "string" && /^\d+(\.\d+)?$/.test(val.trim())) {
      const parsed = Number(val.trim());
      if (Number.isFinite(parsed) && parsed > 0) {
        return val.includes(".") ? Math.round(parsed * 100) : Math.round(parsed);
      }
    }
  }
  return null;
}

/** Poll Safepay reporter API for tracker state (redirect success + webhook backup). */
export async function fetchSafepayTracker(tracker: string): Promise<{
  state: string | null;
  paid: boolean;
  amountMinor: number | null;
  currency: string | null;
  raw: Record<string, unknown>;
}> {
  const cfg = await loadSafepayConfig();
  if (!cfg.secretKey) throw new Error("Safepay secret key missing");
  const token = tracker.trim();
  if (!token) throw new Error("Missing tracker");

  const payload = await safepayFetch(`/reporter/api/v1/payments/${encodeURIComponent(token)}`, {
    secretKey: cfg.secretKey,
    env: cfg.env,
    method: "GET",
  });
  const data = (payload.data ?? payload) as Record<string, unknown>;
  const trackerObj = (data.tracker ?? data) as Record<string, unknown>;
  const rawState = String(trackerObj.state ?? trackerObj.status ?? "").trim();
  const state = rawState ? rawState.toUpperCase() : null;
  const paid = state ? isSafepayPaidState(state) : trackerObj.success === true;
  const currencyRaw = String(trackerObj.currency ?? data.currency ?? "").trim().toUpperCase();

  return {
    state,
    paid,
    amountMinor: parseSafepayAmountMinor(trackerObj) ?? parseSafepayAmountMinor(data),
    currency: currencyRaw || null,
    raw: payload,
  };
}

export async function activateSafepaySubscription(params: {
  tracker: string;
  requestId: string | null;
  userId: string | null;
  email: string | null;
  plan: "pro" | "pro_plus";
  source: "webhook" | "confirm";
  state?: string | null;
}): Promise<{ ok: true; deduplicated: boolean; userId: string | null }> {
  const { url, serviceRoleKey } = requireAdminServiceConfig();
  const admin = createServiceClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const nowIso = new Date().toISOString();
  const cleanTracker = params.tracker.trim();

  const { data: existingEvent, error: eventReadErr } = await admin
    .from("clivora_events")
    .select("id")
    .eq("event_type", "safepay_webhook")
    .contains("payload", { tracker: cleanTracker })
    .limit(1)
    .maybeSingle();

  if (eventReadErr) {
    throw new Error(`Idempotency lookup failed: ${eventReadErr.message}`);
  }
  if (existingEvent) {
    return { ok: true, deduplicated: true, userId: params.userId };
  }

  let resolvedUserId = params.userId;
  const cleanEmail = params.email?.trim().toLowerCase() || null;

  if (!resolvedUserId && cleanEmail) {
    const { data: profile, error: lookupErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", cleanEmail)
      .limit(1)
      .maybeSingle();
    if (lookupErr) {
      throw new Error(`Profile lookup failed: ${lookupErr.message}`);
    }
    resolvedUserId = profile?.id ? String(profile.id) : null;
  }

  if (params.requestId) {
    const { error: reqUpdateErr } = await admin
      .from("pro_payment_requests")
      .update({
        status: "approved",
        reviewed_at: nowIso,
        payment_reference: cleanTracker,
      })
      .eq("id", params.requestId);
    if (reqUpdateErr) {
      throw new Error(`Payment request approval failed: ${reqUpdateErr.message}`);
    }
  }

  if (resolvedUserId) {
    const { error: profileErr } = await admin
      .from("profiles")
      .update({ subscription_plan: params.plan, updated_at: nowIso })
      .eq("id", resolvedUserId);
    if (profileErr) {
      throw new Error(`Profile upgrade failed: ${profileErr.message}`);
    }

    const expiresAt = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
    const { error: subErr } = await admin.from("subscriptions").upsert(
      {
        user_id: resolvedUserId,
        product_id: `safepay_${params.plan}`,
        purchase_token: cleanTracker,
        package_name: "org.codcrafters.clivora",
        status: "active",
        expires_at: expiresAt,
        verified_at: nowIso,
        updated_at: nowIso,
      },
      { onConflict: "purchase_token" },
    );
    if (subErr) {
      throw new Error(`Subscription upsert failed: ${subErr.message}`);
    }
  }

  const { error: logErr } = await admin.from("clivora_events").insert({
    event_type: "safepay_webhook",
    user_email: cleanEmail ?? "",
    plan: params.plan,
    source: `safepay_${params.source}`,
    payload: {
      tracker: cleanTracker,
      request_id: params.requestId,
      user_id: resolvedUserId,
      state: params.state ?? null,
      processed_at: nowIso,
    },
  });
  if (logErr) {
    throw new Error(`SafePay ledger write failed: ${logErr.message}`);
  }

  return { ok: true, deduplicated: false, userId: resolvedUserId };
}

async function hmacHex(
  secretBytes: BufferSource,
  payload: string,
  hash: "SHA-256" | "SHA-512",
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let ok = 0;
  for (let i = 0; i < a.length; i++) {
    ok |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return ok === 0;
}

/**
 * Classic SafePay webhooks (sfpy-php): HMAC-SHA512(raw_body, webhook_secret) → hex.
 * Newer Raastwire-style: HMAC-SHA256(timestamp + '.' + raw_body, base64-decoded secret),
 * header often prefixed with `sha256=`.
 */
export async function verifySafepayWebhook(
  rawBody: string,
  signatureHeader: string | null,
  timestampHeader?: string | null,
): Promise<boolean> {
  const cfg = await loadSafepayConfig();
  const secret = cfg.webhookSecret || cfg.secretKey;
  if (!secret || !signatureHeader) return false;

  const providedRaw = signatureHeader.trim();
  const provided = providedRaw.replace(/^sha(256|512)=/i, "").trim().toLowerCase();
  const secretBytes = new TextEncoder().encode(secret) as BufferSource;

  // Primary: classic payment webhook (SHA-512 over raw body).
  const sha512 = await hmacHex(secretBytes, rawBody, "SHA-512");
  if (timingSafeEqualHex(provided, sha512) || timingSafeEqualHex(providedRaw.toLowerCase(), sha512)) {
    return true;
  }

  // Fallback: SHA-256 over raw body.
  const sha256Body = await hmacHex(secretBytes, rawBody, "SHA-256");
  if (timingSafeEqualHex(provided, sha256Body)) return true;

  // Raastwire-style: timestamp + '.' + body, secret may be base64-encoded.
  if (timestampHeader?.trim()) {
    const signed = `${timestampHeader.trim()}.${rawBody}`;
    const sha256Ts = await hmacHex(secretBytes, signed, "SHA-256");
    if (timingSafeEqualHex(provided, sha256Ts)) return true;
    try {
      const bin = Uint8Array.from(atob(secret), (c) => c.charCodeAt(0));
      const sha256Decoded = await hmacHex(bin.buffer as ArrayBuffer, signed, "SHA-256");
      if (timingSafeEqualHex(provided, sha256Decoded)) return true;
    } catch {
      /* secret was not base64 */
    }
  }

  return false;
}

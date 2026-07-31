import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";

export type SafepayEnv = "sandbox" | "production";

const SUPABASE_URL =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://jtzjwgovqczlccyeujhq.supabase.co";

function envName(rawValue?: string | null): SafepayEnv {
  const raw = (rawValue || "production").trim().toLowerCase();
  return raw === "sandbox" || raw === "development" ? "sandbox" : "production";
}

function apiHost(env: SafepayEnv) {
  return env === "sandbox" ? "https://sandbox.api.getsafepay.com" : "https://api.getsafepay.com";
}

async function readDbSecret(key: string): Promise<string | null> {
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

/** Poll Safepay reporter API for tracker state (redirect success + webhook backup). */
export async function fetchSafepayTracker(tracker: string): Promise<{
  state: string | null;
  paid: boolean;
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
  const state = String(trackerObj.state ?? trackerObj.status ?? "").toUpperCase();
  const paid =
    state.includes("ENDED") ||
    state.includes("PAID") ||
    state.includes("SUCCESS") ||
    state.includes("CAPTURED") ||
    trackerObj.success === true;
  return { state: state || null, paid, raw: payload };
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

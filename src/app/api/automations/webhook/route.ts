import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHmac } from "crypto";

// AUTO hardening (AUTO-001..005):
// - header-only auth (no query-string secret); constant-time compare
// - optional HMAC signature with timestamp + replay tolerance when signing secret is set
// - strict body-size cap and JSON validation
// - queue-first durability: only return 202 after a durable queue insert
// - no best-effort downstream forwarding before durable acceptance

const AUTOMATION_WEBHOOK_SECRET = process.env.AUTOMATION_WEBHOOK_SECRET;
const AUTOMATION_WEBHOOK_SIGNING_SECRET = process.env.AUTOMATION_WEBHOOK_SIGNING_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://jtzjwgovqczlccyeujhq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const MAX_BODY_BYTES = 64 * 1024; // 64 KB
const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
const ALLOWED_SOURCES = new Set(["api", "n8n", "connect", "crm", "automation_rule"]);

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

async function enqueue(rawBody: string, source: string, idempotencyKey: string): Promise<boolean> {
  if (!SUPABASE_SERVICE_ROLE_KEY) return false;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/automation_webhook_queue`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      event_type: source,
      payload: { source, raw: rawBody.slice(0, MAX_BODY_BYTES) },
      status: "pending",
      idempotency_key: idempotencyKey,
      next_attempt_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`queue insert ${res.status} ${text}`);
  }
  return true;
}

export async function POST(req: NextRequest) {
  if (!AUTOMATION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  // Header-only auth. No query-string secret is accepted.
  const provided = req.headers.get("x-webhook-secret") ?? "";
  if (!safeEqual(provided, AUTOMATION_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rawBody = await req.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  // Optional HMAC signature + timestamp replay protection.
  if (AUTOMATION_WEBHOOK_SIGNING_SECRET) {
    const ts = req.headers.get("x-webhook-timestamp") ?? "";
    const sig = req.headers.get("x-webhook-signature") ?? "";
    const tsMs = Number(ts);
    if (!Number.isFinite(tsMs) || Math.abs(Date.now() - tsMs) > SIGNATURE_TOLERANCE_MS) {
      return NextResponse.json({ error: "stale_or_missing_timestamp" }, { status: 401 });
    }
    const expected = createHmac("sha256", AUTOMATION_WEBHOOK_SIGNING_SECRET)
      .update(`${ts}.${rawBody}`)
      .digest("hex");
    if (!safeEqual(sig, expected)) {
      return NextResponse.json({ error: "bad_signature" }, { status: 401 });
    }
  }

  try {
    JSON.parse(rawBody || "{}");
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const sourceHeader = req.headers.get("x-webhook-source") ?? "api";
  const source = ALLOWED_SOURCES.has(sourceHeader) ? sourceHeader : "api";

  // Idempotency: caller may supply a key, else derive one from timestamp header.
  const idempotencyKey =
    req.headers.get("x-webhook-idempotency-key") ??
    `${source}:${req.headers.get("x-webhook-timestamp") ?? Date.now()}`;

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    // Cannot durably accept work - tell the caller to retry rather than lie.
    return NextResponse.json({ error: "queue_unavailable" }, { status: 503 });
  }

  try {
    const queued = await enqueue(rawBody, source, idempotencyKey);
    if (!queued) {
      return NextResponse.json({ error: "queue_unavailable" }, { status: 503 });
    }
    // 202: durably accepted. A separate worker forwards to downstreams.
    return NextResponse.json({ accepted: true, source }, { status: 202 });
  } catch (e) {
    console.error("[automations/webhook] enqueue failed", e);
    return NextResponse.json({ error: "queue_failed" }, { status: 502 });
  }
}

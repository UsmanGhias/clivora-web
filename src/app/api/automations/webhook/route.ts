import { NextRequest, NextResponse } from "next/server";

const AUTOMATION_WEBHOOK_SECRET = process.env.AUTOMATION_WEBHOOK_SECRET;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const SUPABASE_URL =
  process.env.SUPABASE_URL ?? "https://jtzjwgovqczlccyeujhq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function insertToQueue(payload: unknown, source: string) {
  if (!SUPABASE_SERVICE_ROLE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/automation_webhook_queue`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      payload,
      source,
      received_at: new Date().toISOString(),
      status: "pending",
    }),
  });
}

async function forwardToN8n(payload: unknown) {
  if (!N8N_WEBHOOK_URL) return;
  await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("x-webhook-secret");
  const querySecret = req.nextUrl.searchParams.get("secret");
  const providedSecret = authHeader ?? querySecret;

  if (!AUTOMATION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Automation webhook is not configured" }, { status: 503 });
  }
  if (providedSecret !== AUTOMATION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const source =
    req.headers.get("x-webhook-source") ?? req.nextUrl.searchParams.get("source") ?? "api";

  // Insert into queue (best-effort)
  await insertToQueue(payload, source).catch(() => {});

  // Forward to n8n if configured (best-effort)
  await forwardToN8n(payload).catch(() => {});

  return NextResponse.json({ received: true, source, queued: !!SUPABASE_SERVICE_ROLE_KEY });
}

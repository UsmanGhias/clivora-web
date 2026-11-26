import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdminServiceConfig } from "@/lib/admin-service";
import { consumeIpRateLimit, getClientIp } from "@/lib/security-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rate = consumeIpRateLimit("contact_form", getClientIp(request), 6, 10 * 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many messages submitted. Please wait before trying again." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, category, subject, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 150);
    const cleanCategory = typeof category === "string" ? category.trim().slice(0, 50) : "support";
    const cleanSubject = typeof subject === "string" ? subject.trim().slice(0, 200) : "General Inquiry";
    const cleanMessage = message.trim().slice(0, 5000);

    const { url, serviceRoleKey } = requireAdminServiceConfig();
    const supabase = createServiceClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { error: insertErr } = await supabase.from("clivora_events").insert({
      event_type: "contact_form_submission",
      user_email: cleanEmail,
      user_name: cleanName,
      source: "web_contact_form",
      payload: {
        category: cleanCategory,
        subject: cleanSubject,
        message: cleanMessage,
        submitted_at: new Date().toISOString(),
      },
    });

    if (insertErr) {
      console.error("[Contact API] Supabase insert error:", insertErr.message);
      return NextResponse.json(
        { error: "Failed to save message. Please try again or email us directly at contact@clivora.io." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Thank you for contacting us. Your message has been received.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Contact API] Error:", msg);
    return NextResponse.json({ error: "Failed to process contact inquiry" }, { status: 500 });
  }
}

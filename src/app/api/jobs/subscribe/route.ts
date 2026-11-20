import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, category, tech } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase().slice(0, 150);
    const cleanCategory = typeof category === "string" ? category.trim().slice(0, 50) : "all";
    const cleanTech = typeof tech === "string" ? tech.trim().slice(0, 100) : "all";

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jtzjwgovqczlccyeujhq.supabase.co";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";

    const supabase = createServiceClient(supabaseUrl, supabaseKey);

    const { error: insertErr } = await supabase.from("clivora_events").insert({
      event_type: "job_alert_subscription",
      user_email: cleanEmail,
      source: "web_jobs_feed",
      payload: {
        category: cleanCategory,
        tech: cleanTech,
        subscribed_at: new Date().toISOString(),
      },
    });

    if (insertErr) {
      console.error("[Job Alert Subscribe] Supabase insert error:", insertErr.message);
      return NextResponse.json(
        { error: "Could not save subscription. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You are subscribed to daily remote job alerts with $0 platform fees.",
    });
  } catch (err: unknown) {
    console.error("[Job Alert Subscribe] Uncaught error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

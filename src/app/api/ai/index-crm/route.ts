import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  customerIndexText,
  invoiceIndexText,
  projectIndexText,
} from "@/lib/crm-rag";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function embedText(text: string): Promise<number[] | null> {
  if (!OPENAI_API_KEY || !text.trim()) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small",
        input: text.slice(0, 8000),
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Array<{ embedding?: number[] }> };
    return json.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

/**
 * Opt-in indexer. Does not run on CRM save, so live create/update paths stay unchanged.
 * Failures are counted, never thrown into the freelancer workspace.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .maybeSingle();
    const plan = (profile?.subscription_plan ?? "free").toLowerCase();
    if (plan !== "pro" && plan !== "pro_plus" && plan !== "plus" && plan !== "proplus") {
      return NextResponse.json({ error: "Pro required", code: "pro_required" }, { status: 403 });
    }

    const [customers, projects, invoices] = await Promise.all([
      supabase.from("crm_customers").select("id, contact_person, company, notes, status").eq("owner_uid", user.id).limit(40),
      supabase.from("crm_projects").select("id, name, description, status, budget").eq("owner_uid", user.id).limit(40),
      supabase.from("crm_invoices").select("id, invoice_number, status, total, due_date").eq("owner_uid", user.id).limit(40),
    ]);

    const jobs: Array<{ entity_type: string; entity_id: string; content: string }> = [];
    for (const row of customers.data ?? []) {
      jobs.push({
        entity_type: "customer",
        entity_id: row.id,
        content: customerIndexText(row),
      });
    }
    for (const row of projects.data ?? []) {
      jobs.push({
        entity_type: "project",
        entity_id: row.id,
        content: projectIndexText(row),
      });
    }
    for (const row of invoices.data ?? []) {
      jobs.push({
        entity_type: "invoice",
        entity_id: row.id,
        content: invoiceIndexText(row),
      });
    }

    let indexed = 0;
    let skipped = 0;
    for (const job of jobs) {
      if (!job.content) {
        skipped += 1;
        continue;
      }
      const embedding = await embedText(job.content);
      const payload: Record<string, unknown> = {
        owner_uid: user.id,
        entity_type: job.entity_type,
        entity_id: job.entity_id,
        content: job.content,
        updated_at: new Date().toISOString(),
      };
      if (embedding) payload.embedding = embedding;
      const { error } = await supabase.from("crm_embeddings").upsert(payload, {
        onConflict: "owner_uid,entity_type,entity_id",
      });
      if (error) skipped += 1;
      else indexed += 1;
    }

    return NextResponse.json({
      ok: true,
      indexed,
      skipped,
      vectors: Boolean(OPENAI_API_KEY),
    });
  } catch {
    return NextResponse.json({ ok: false, indexed: 0, skipped: 0 }, { status: 200 });
  }
}

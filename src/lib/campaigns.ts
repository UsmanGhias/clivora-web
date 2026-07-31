import { createClient } from "@/lib/supabase/client";

export type Campaign = {
  id: string;
  owner_uid: string;
  title: string;
  status: string;
  platform: string;
  preview_html: string;
  ab_variant?: string | null;
  fail_reason?: string | null;
  published_at?: string | null;
  updated_at: string;
};

export type CampaignBlock = {
  id: string;
  campaign_id: string;
  sort_order: number;
  block_type: string;
  content: Record<string, unknown>;
};

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");
  return { supabase, user };
}

/** Server-side publish validation: draft → publishing → published|failed */
export async function publishCampaign(campaignId: string): Promise<Campaign> {
  const { supabase } = await requireUser();
  const { data: campaign, error: loadErr } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();
  if (loadErr) throw loadErr;

  const { data: blockRows, error: blockErr } = await supabase
    .from("campaign_blocks")
    .select("id")
    .eq("campaign_id", campaignId);
  if (blockErr) throw blockErr;
  const blocks = blockRows ?? [];
  if (!campaign.title?.trim()) {
    await supabase
      .from("campaigns")
      .update({ status: "failed", fail_reason: "Title required", updated_at: new Date().toISOString() })
      .eq("id", campaignId);
    throw new Error("Title required");
  }
  if (blocks.length === 0) {
    await supabase
      .from("campaigns")
      .update({
        status: "failed",
        fail_reason: "At least one block required",
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaignId);
    throw new Error("At least one block required");
  }

  await supabase
    .from("campaigns")
    .update({ status: "publishing", updated_at: new Date().toISOString() })
    .eq("id", campaignId);

  const { data, error } = await supabase
    .from("campaigns")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      fail_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", campaignId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function listCampaigns(): Promise<Campaign[]> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("owner_uid", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Campaign[];
}

export async function upsertCampaign(input: {
  id?: string;
  title: string;
  platform?: string;
  preview_html?: string;
  ab_variant?: string | null;
  status?: string;
}): Promise<string> {
  const { supabase, user } = await requireUser();
  const row = {
    owner_uid: user.id,
    title: input.title.trim(),
    platform: input.platform ?? "connect",
    preview_html: input.preview_html ?? "",
    ab_variant: input.ab_variant ?? null,
    status: input.status ?? "draft",
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from("campaigns").update(row).eq("id", input.id);
    if (error) throw error;
    return input.id;
  }
  const { data, error } = await supabase.from("campaigns").insert(row).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function addCampaignBlock(input: {
  campaign_id: string;
  block_type?: string;
  content?: Record<string, unknown>;
  sort_order?: number;
}): Promise<string> {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("campaign_blocks")
    .insert({
      campaign_id: input.campaign_id,
      block_type: input.block_type ?? "text",
      content: input.content ?? {},
      sort_order: input.sort_order ?? 0,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

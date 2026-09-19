import { createClient } from "@/lib/supabase/client";

export type AiSuggestion = {
  id: string;
  owner_uid: string;
  entity_type: string;
  entity_id?: string | null;
  suggestion_type: string;
  payload: Record<string, unknown>;
  status: "pending_review" | "accepted" | "rejected";
  created_at: string;
};

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");
  return { supabase, user };
}

const FORBIDDEN = new Set(["auto_pay", "auto_publish"]);

export async function createAiSuggestion(input: {
  entity_type: string;
  entity_id?: string | null;
  suggestion_type?: string;
  payload: Record<string, unknown>;
}): Promise<string> {
  const type = input.suggestion_type ?? "summary";
  if (FORBIDDEN.has(type)) {
    throw new Error("Restricted suggestion types are not allowed");
  }
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("ai_suggestions")
    .insert({
      owner_uid: user.id,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      suggestion_type: type,
      payload: input.payload,
      status: "pending_review",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function listPendingAiSuggestions(): Promise<AiSuggestion[]> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("ai_suggestions")
    .select("*")
    .eq("owner_uid", user.id)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AiSuggestion[];
}

export async function reviewAiSuggestion(id: string, accept: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("ai_suggestions")
    .update({
      status: accept ? "accepted" : "rejected",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

import { createClient } from "@/lib/supabase/client";

export type AutomationRule = {
  id: string;
  owner_uid: string;
  name: string;
  enabled: boolean;
  trigger_type: string;
  trigger_config: Record<string, unknown>;
  action_type: string;
  action_config: Record<string, unknown>;
};

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required");
  return { supabase, user };
}

export async function listAutomationRules(): Promise<AutomationRule[]> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("automation_rules")
    .select("*")
    .eq("owner_uid", user.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AutomationRule[];
}

export async function upsertAutomationRule(input: {
  id?: string;
  name: string;
  enabled?: boolean;
  trigger_type: string;
  trigger_config?: Record<string, unknown>;
  action_type: string;
  action_config?: Record<string, unknown>;
}): Promise<string> {
  const { supabase, user } = await requireUser();
  const row = {
    owner_uid: user.id,
    name: input.name.trim(),
    enabled: input.enabled ?? false,
    trigger_type: input.trigger_type,
    trigger_config: input.trigger_config ?? {},
    action_type: input.action_type,
    action_config: input.action_config ?? {},
    updated_at: new Date().toISOString(),
  };
  if (input.id) {
    const { error } = await supabase.from("automation_rules").update(row).eq("id", input.id);
    if (error) throw error;
    return input.id;
  }
  const { data, error } = await supabase.from("automation_rules").insert(row).select("id").single();
  if (error) throw error;
  return data.id as string;
}

/** Enqueue durable job — never silently discard */
export async function enqueueAutomationJob(input: {
  rule_id?: string;
  payload?: Record<string, unknown>;
  idempotency_key?: string;
}): Promise<string> {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("automation_webhook_queue")
    .insert({
      owner_uid: user.id,
      event_type: "automation_rule",
      status: "pending",
      payload: {
        rule_id: input.rule_id ?? null,
        ...(input.payload ?? {}),
      },
      idempotency_key: input.idempotency_key ?? null,
      next_attempt_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

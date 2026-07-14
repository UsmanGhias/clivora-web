import { createClient } from "@/lib/supabase/server";
import { getProfile, isClientAccount } from "@/lib/profile";
import { TasksClient, type TaskRow } from "./TasksClient";

export const metadata = { title: "Tasks" };

export default async function TasksPage() {
  const profile = await getProfile();
  const client = isClientAccount(profile);
  const supabase = await createClient();
  let rows: TaskRow[] = [];

  try {
    const col = client ? "client_uid" : "freelancer_uid";
    const { data, error } = await supabase
      .from("client_tasks")
      .select("id, title, status, description, created_at, is_read")
      .eq(col, profile?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(40);
    if (!error && data) {
      rows = data;
    } else if (error?.message?.includes("is_read")) {
      const { data: fallback } = await supabase
        .from("client_tasks")
        .select("id, title, status, description, created_at")
        .eq(col, profile?.id ?? "")
        .order("created_at", { ascending: false })
        .limit(40);
      if (fallback) rows = fallback;
    }
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Tasks</h1>
        <p className="text-sm text-text-secondary">
          Shared client tasks from your freelancer/client workspace.
        </p>
      </div>
      <TasksClient initial={rows} isClient={!!client} />
    </div>
  );
}

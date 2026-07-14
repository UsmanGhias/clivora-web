import { createClient } from "@/lib/supabase/server";
import { getProfile, isClientAccount } from "@/lib/profile";

export default async function TasksPage() {
  const profile = await getProfile();
  const client = isClientAccount(profile);
  const supabase = await createClient();
  let rows: Array<{
    id: string;
    title?: string | null;
    status?: string | null;
    description?: string | null;
  }> = [];

  try {
    const col = client ? "client_uid" : "freelancer_uid";
    const { data, error } = await supabase
      .from("client_tasks")
      .select("id, title, status, description, created_at")
      .eq(col, profile?.id ?? "")
      .order("created_at", { ascending: false })
      .limit(40);
    if (!error && data) rows = data;
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
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <p className="font-semibold">No shared tasks yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="font-semibold">{r.title || "Task"}</p>
              <p className="text-sm text-text-secondary">{r.status || "open"}</p>
              {r.description && (
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">{r.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

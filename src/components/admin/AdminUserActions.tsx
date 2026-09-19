"use client";

import { useCallback, useState } from "react";
import { RowActions, fmtDate, relative } from "@/components/admin/ui";

export type AdminUserRow = Record<string, unknown>;

function nameOf(u: AdminUserRow) {
  return String(u.full_name || u.name || u.display_name || u.email || "-");
}

async function adminApi(path: string, body: Record<string, unknown>) {
  const { assertClientUser, getVerifiedAccessToken } = await import(
    "@/lib/supabase/access-token"
  );
  await assertClientUser();
  const token = await getVerifiedAccessToken();
  const res = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
  if (!res.ok) {
    const err = json.error || "Request failed";
    if (json.code === "MFA_REQUIRED" || /two-factor|mfa|aal2/i.test(err)) {
      throw new Error("Complete admin 2FA (MFA) first, then retry this action.");
    }
    throw new Error(err);
  }
  return json;
}

async function moderate(userId: string, action: "block" | "unblock") {
  await adminApi("/api/admin/moderation", {
    action,
    userId,
    reason: action === "block" ? "Blocked by admin" : undefined,
  });
}

export function AdminUserActions({
  user,
  onRefresh,
}: {
  user: AdminUserRow;
  onRefresh?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<"view" | "edit" | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [name, setName] = useState(nameOf(user));
  const [plan, setPlan] = useState(String(user.subscription_plan || user.plan || "free"));
  const blocked = Boolean(user.is_blocked || user.is_restricted);
  const userId = String(user.id || "");

  const run = useCallback(
    async (fn: () => Promise<void>) => {
      setBusy(true);
      setMsg(null);
      try {
        await fn();
        onRefresh?.();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : "Action failed");
      } finally {
        setBusy(false);
      }
    },
    [onRefresh],
  );

  async function saveEdit() {
    const email = String(user.email || "").trim().toLowerCase();
    await adminApi("/api/admin/moderation", {
      action: "update_user",
      userId,
      name: name.trim(),
      subscription_plan: plan,
    });
    if (email && ["free", "pro", "pro_plus"].includes(plan)) {
      await adminApi("/api/admin/grant-pro", {
        email,
        plan: plan === "free" ? "pro" : plan,
        revoke: plan === "free",
      });
    }
    setModal(null);
    setMsg("Saved.");
    onRefresh?.();
  }

  return (
    <>
      <RowActions
        busy={busy}
        blocked={blocked}
        onView={() => {
          setModal("view");
          setMsg(null);
        }}
        onEdit={() => {
          setName(nameOf(user));
          setPlan(String(user.subscription_plan || user.plan || "free"));
          setModal("edit");
          setMsg(null);
        }}
        onBlock={() => {
          if (!confirm(`Block ${nameOf(user)}? They will lose access.`)) return;
          void run(() => moderate(userId, "block"));
        }}
        onUnblock={() => {
          void run(() => moderate(userId, "unblock"));
        }}
      />
      {msg && !modal && <p className="mt-1 text-[10px] font-semibold text-rose-600">{msg}</p>}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {modal === "view" ? "User details" : "Edit user"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {modal === "view" ? (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Name</dt>
                  <dd className="font-semibold text-slate-900">{nameOf(user)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="font-semibold text-slate-900">{String(user.email || "-")}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="font-semibold capitalize text-slate-900">
                    {String(user.account_type || "freelancer")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Plan</dt>
                  <dd className="font-semibold text-slate-900">
                    {String(user.subscription_plan || user.plan || "free")}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-semibold text-slate-900">{blocked ? "Suspended" : "Active"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Joined</dt>
                  <dd className="font-semibold text-slate-900">
                    {fmtDate(String(user.created_at || user.updated_at || ""))}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Last active</dt>
                  <dd className="font-semibold text-slate-900">
                    {relative(String(user.updated_at || "")) || "-"}
                  </dd>
                </div>
                {user.block_reason ? (
                  <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-800">
                    Reason: {String(user.block_reason)}
                  </div>
                ) : null}
              </dl>
            ) : (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-600">
                  Display name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-600">
                  Plan
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="pro_plus">Pro Plus</option>
                  </select>
                </label>
                {msg && <p className="text-xs font-semibold text-rose-600">{msg}</p>}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void run(saveEdit)}
                  className="w-full rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save changes"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function joinedDate(u: AdminUserRow) {
  return fmtDate(String(u.created_at || u.updated_at || u.blocked_at || ""));
}

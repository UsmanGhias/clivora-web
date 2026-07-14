"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function TeamInviteForm({
  ownerUid,
  isClient,
}: {
  ownerUid: string;
  isClient: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const supabase = createClient();
      const inviteeEmail = email.trim().toLowerCase();
      if (!inviteeEmail) throw new Error("Email is required");
      const { data: prof } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteeEmail)
        .maybeSingle();
      const { error: err } = await supabase.from("team_invites").insert({
        owner_uid: ownerUid,
        invitee_email: inviteeEmail,
        invitee_name: name.trim(),
        invitee_uid: prof?.id ?? null,
        role: role || "member",
        status: "pending",
      });
      if (err) throw err;
      setEmail("");
      setName("");
      setOk(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-text-secondary">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-semibold text-text-secondary">
          Name (optional)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-xs font-semibold text-text-secondary">
        Role
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      {ok && <p className="text-sm text-green-700">Invite sent.</p>}
      <button
        type="submit"
        disabled={busy}
        className={`rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 ${
          isClient ? "bg-client-accent hover:bg-client-header" : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {busy ? "Sending…" : "Send invite"}
      </button>
    </form>
  );
}

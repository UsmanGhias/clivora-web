"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Video, Copy, ExternalLink } from "lucide-react";

type MeetingLink = {
  id: string;
  owner_uid: string;
  room_url: string;
  title: string | null;
  created_at: string | null;
};

function randomRoomId() {
  return Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 10);
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function MeetingsClient({
  initial,
  ownerUid,
}: {
  initial: MeetingLink[];
  ownerUid: string;
}) {
  const router = useRouter();
  const [links, setLinks] = useState(initial);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function createRoom(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const roomId = `clivora-${randomRoomId()}`;
      const roomUrl = `https://meet.jit.si/${roomId}`;
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("meeting_links")
        .insert({
          owner_uid: ownerUid,
          room_url: roomUrl,
          title: title.trim() || null,
        })
        .select()
        .single();
      if (err) throw err;
      setLinks((prev) => [data as MeetingLink, ...prev]);
      setTitle("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create room");
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={createRoom}
        className="rounded-2xl border border-border bg-surface p-4 space-y-3"
      >
        <p className="text-sm font-semibold text-navy">New meeting room</p>
        <input
          placeholder="Meeting title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Video className="h-4 w-4" />
          {busy ? "Creating…" : "Create Jitsi room"}
        </button>
      </form>

      {links.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-secondary">
          No rooms yet. Create one above and share the link with your client.
        </div>
      ) : (
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-navy truncate">
                  {link.title || "Untitled meeting"}
                </p>
                <p className="mt-0.5 text-xs text-text-muted truncate">{link.room_url}</p>
                {link.created_at && (
                  <p className="text-xs text-text-muted">{formatDate(link.created_at)}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyUrl(link.room_url)}
                  title="Copy link"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-background"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied === link.room_url ? "Copied!" : "Copy"}
                </button>
                <a
                  href={link.room_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Join
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

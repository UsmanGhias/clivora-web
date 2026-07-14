"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Video, Copy, ExternalLink } from "lucide-react";

type MeetingLink = {
  id: string;
  owner_uid: string;
  room_url: string;
  title: string | null;
  created_at: string | null;
};

function randomRoomId() {
  return (
    Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)
  );
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
  const params = useSearchParams();
  const [links, setLinks] = useState(initial);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [calendarMsg, setCalendarMsg] = useState<string | null>(null);
  const [calendarBusy, setCalendarBusy] = useState(false);

  useEffect(() => {
    if (params.get("calendar") === "google") {
      setCalendarMsg(
        "Google Calendar OAuth is being wired. For now, create a Jitsi room and add the link to your Google Calendar manually.",
      );
    }
  }, [params]);

  async function connectGoogleCalendar() {
    setCalendarBusy(true);
    setCalendarMsg(null);
    try {
      const supabase = createClient();
      await supabase.auth.getUser();
      setCalendarMsg(
        "Google Calendar sync is not fully live yet. Create a meeting below, then add the room URL to Google Calendar. Full two-way sync ships next.",
      );
    } finally {
      setCalendarBusy(false);
    }
  }

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
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 font-bold text-navy">
              <Calendar className="h-4 w-4 text-primary" />
              Google Calendar
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Sync CLIVORA meetings into Google Calendar when OAuth is enabled for your workspace.
            </p>
          </div>
          <button
            type="button"
            disabled={calendarBusy}
            onClick={() => void connectGoogleCalendar()}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {calendarBusy ? "Connecting…" : "Connect Google Calendar"}
          </button>
        </div>
        {calendarMsg && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {calendarMsg}
          </p>
        )}
      </div>

      <form
        onSubmit={createRoom}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <label className="block flex-1 text-sm font-semibold text-navy">
          Meeting title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Client kickoff"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Video className="h-4 w-4" />
          {busy ? "Creating…" : "Create Jitsi room"}
        </button>
      </form>
      {error && <p className="text-sm text-error">{error}</p>}

      <ul className="space-y-3">
        {links.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-secondary">
            No meetings yet. Create a room to share with clients.
          </li>
        ) : (
          links.map((link) => (
            <li
              key={link.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="font-semibold text-navy">{link.title || "CLIVORA meeting"}</p>
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {link.room_url}
                  {link.created_at ? ` · ${formatDate(link.created_at)}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyUrl(link.room_url)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied === link.room_url ? "Copied" : "Copy"}
                </button>
                <a
                  href={link.room_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-xs font-semibold text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Join
                </a>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Network,
  Search,
  Send,
  Settings,
  Share2,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MessageRow } from "./page";

function formatTime(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatDateLabel(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function isUnread(row: MessageRow, myUid: string) {
  if (row.from_uid === myUid) return false;
  if (row.read_at) return false;
  if (row.is_read === true) return false;
  return true;
}

function counterpartEmail(row: MessageRow, myUid: string, myEmail: string) {
  if (row.from_uid === myUid) {
    return (row.to_email || "").trim() || "";
  }
  if (row.to_uid === myUid) {
    return (row.from_email || "").trim() || "";
  }
  // Fallback when uids missing: pick the other email
  const from = (row.from_email || "").trim().toLowerCase();
  const to = (row.to_email || "").trim().toLowerCase();
  const me = (myEmail || "").trim().toLowerCase();
  if (from && from !== me) return row.from_email || "";
  if (to && to !== me) return row.to_email || "";
  return (row.from_email || row.to_email || "").trim();
}

function counterpartUid(row: MessageRow, myUid: string) {
  if (row.from_uid && row.from_uid !== myUid) return row.from_uid;
  if (row.to_uid && row.to_uid !== myUid) return row.to_uid;
  return null;
}

function ComposeForm({
  fromEmail,
  defaultTo,
  defaultToUid,
  parentId,
  parentSubject,
  onSent,
  compact,
  isClient,
}: {
  fromEmail: string;
  defaultTo?: string;
  defaultToUid?: string | null;
  parentId?: string;
  parentSubject?: string;
  onSent?: () => void;
  compact?: boolean;
  isClient?: boolean;
}) {
  const router = useRouter();
  const [toEmail, setToEmail] = useState(defaultTo ?? "");
  const [subject, setSubject] = useState(parentSubject ? `Re: ${parentSubject}` : "");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setToEmail(defaultTo ?? "");
  }, [defaultTo]);

  useEffect(() => {
    if (toEmail.trim() || !defaultToUid) return;
    (async () => {
      const supabase = createClient();
      // Prefer Connect peer contact (revealed only after mutual/accept).
      const { data: peer } = await supabase.rpc("connect_peer_contact", {
        p_peer_id: defaultToUid,
      });
      const peerRow = Array.isArray(peer) ? peer[0] : peer;
      if (peerRow?.email) {
        setToEmail(peerRow.email);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", defaultToUid)
        .maybeSingle();
      if (data?.email) setToEmail(data.email);
    })();
  }, [defaultToUid, toEmail]);

  async function onSend(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in required");
      const to = toEmail.trim().toLowerCase();
      let resolvedTo = to;
      let toUid: string | null = defaultToUid ?? null;
      if (!resolvedTo && defaultToUid) {
        const { data: peer } = await supabase.rpc("connect_peer_contact", {
          p_peer_id: defaultToUid,
        });
        const peerRow = Array.isArray(peer) ? peer[0] : peer;
        resolvedTo = (peerRow?.email || "").trim().toLowerCase();
        toUid = defaultToUid;
      }
      if (!resolvedTo) throw new Error("Recipient email is required");
      if (!toUid) {
        const { data: peerByEmail } = await supabase
          .from("connect_request_details")
          .select("from_user_id, to_user_id, from_email, to_email, status")
          .eq("status", "accepted")
          .or(`from_email.eq.${resolvedTo},to_email.eq.${resolvedTo}`)
          .limit(5);
        const hit = (peerByEmail ?? []).find((r) => {
          const from = (r.from_email || "").toLowerCase();
          const toE = (r.to_email || "").toLowerCase();
          return from === resolvedTo || toE === resolvedTo;
        });
        if (hit) {
          toUid =
            (hit.from_email || "").toLowerCase() === resolvedTo
              ? hit.from_user_id
              : hit.to_user_id;
        }
      }
      if (!toUid) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", resolvedTo)
          .maybeSingle();
        toUid = prof?.id ?? null;
      }
      // client_messages has is_read (boolean) + read_at (timestamptz); to_email is NOT NULL
      const { error: err } = await supabase.from("client_messages").insert({
        from_uid: user.id,
        from_email: fromEmail || user.email || "",
        to_email: resolvedTo,
        to_uid: toUid,
        subject: subject.trim() || (parentId ? "Reply" : "Message"),
        body: body.trim(),
        is_read: false,
        read_at: null,
        parent_message_id: parentId ?? null,
      });
      if (err) throw err;
      setBody("");
      if (!parentId) {
        setSubject("");
        setToEmail(defaultTo ?? "");
      }
      setOk(true);
      onSent?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
    }
  }

  const accentBtn = isClient
    ? "bg-client-accent hover:bg-client-header"
    : "bg-primary hover:bg-primary-dark";

  return (
    <form
      onSubmit={onSend}
      className={`space-y-2 rounded-2xl border border-border bg-surface ${compact ? "p-3" : "p-4"}`}
    >
      {!compact && (
        <div className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isClient ? "bg-client-surface text-client-accent" : "bg-primary/10 text-primary"
            }`}
          >
            <Send className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-navy">
              {isClient ? "Message your freelancer" : "Message a client"}
            </p>
            <p className="text-[11px] text-text-muted">
              Use the email from an accepted Connect match, or your CRM contact.
            </p>
          </div>
        </div>
      )}
      {!parentId && (
        <label className="block text-xs font-semibold text-text-secondary">
          {isClient ? "Freelancer email" : "Client email"}
          <input
            required
            type="email"
            placeholder={isClient ? "freelancer@example.com" : "client@example.com"}
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </label>
      )}
      {!parentId && (
        <label className="block text-xs font-semibold text-text-secondary">
          Subject
          <input
            placeholder="Project update, invoice question, or next step"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
          />
        </label>
      )}
      {parentId && (
        <input type="hidden" value={toEmail} readOnly />
      )}
      <label className="block text-xs font-semibold text-text-secondary">
        {parentId ? "Reply" : "Message"}
        <textarea
          required
          rows={compact ? 2 : 3}
          placeholder={parentId ? "Write a reply" : "Write your message"}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
        />
      </label>
      {error && <p className="text-sm text-error">{error}</p>}
      {ok && (
        <p className="text-sm text-green-700">
          {parentId ? "Reply sent." : "Message sent."}
        </p>
      )}
      <button
        type="submit"
        disabled={busy || (parentId ? !(toEmail.trim() || defaultToUid) : false)}
        className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${accentBtn}`}
      >
        {busy ? "Sending…" : parentId ? "Reply" : "Send"}
      </button>
    </form>
  );
}

function MarkReadButton({ messageId, readAt }: { messageId: string; readAt?: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(!!readAt);

  async function markRead() {
    if (done || busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      await supabase
        .from("client_messages")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", messageId)
        .throwOnError();
      setDone(true);
      router.refresh();
    } catch {
      // Keep button available if RLS/trigger rejects
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <span className="text-[10px] text-text-muted">Read</span>;
  }
  return (
    <button
      type="button"
      onClick={markRead}
      disabled={busy}
      className="rounded px-2 py-0.5 text-[10px] font-semibold text-primary hover:underline disabled:opacity-50"
    >
      {busy ? "…" : "Mark read"}
    </button>
  );
}

export function MessagesThreadView({
  rows,
  fromEmail,
  myUid,
  isClient = false,
  prefillToUid = null,
}: {
  rows: MessageRow[];
  fromEmail: string;
  myUid: string;
  isClient?: boolean;
  prefillToUid?: string | null;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [liveError, setLiveError] = useState<string | null>(null);

  // Live inbox: refresh when postgres_changes arrive for this user
  useEffect(() => {
    if (!myUid) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`client-messages-${myUid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_messages",
          filter: `from_uid=eq.${myUid}`,
        },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "client_messages",
          filter: `to_uid=eq.${myUid}`,
        },
        () => router.refresh(),
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setLiveError("Live updates unavailable — pull to refresh messages.");
        } else if (status === "SUBSCRIBED") {
          setLiveError(null);
        }
      });
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [myUid, router]);

  const accent = isClient ? "client" : "teal";
  const activeTabCls =
    accent === "client" ? "bg-client-accent text-white" : "bg-primary text-white";
  const activeThreadCls =
    accent === "client"
      ? "border-client-accent bg-client-surface"
      : "border-primary bg-primary/10";
  const outBubbleCls =
    accent === "client" ? "ml-auto bg-navy text-white" : "ml-auto bg-primary text-white";
  const linkAccent = accent === "client" ? "text-client-accent" : "text-primary";

  const topLevel = useMemo(() => {
    const roots = rows.filter((r) => !r.parent_message_id);
    const sorted = [...roots].sort((a, b) =>
      String(b.created_at || "").localeCompare(String(a.created_at || "")),
    );
    const q = search.trim().toLowerCase();
    const searched = q
      ? sorted.filter((r) => {
          const hay = [
            r.subject,
            r.body,
            r.from_email,
            r.to_email,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
      : sorted;
    if (filter === "unread") {
      return searched.filter((r) => isUnread(r, myUid));
    }
    if (filter === "archived") {
      // Archive storage not wired yet — show empty intentionally
      return [];
    }
    return searched;
  }, [rows, filter, myUid, search]);

  const repliesFor = (parentId: string) =>
    rows.filter((r) => r.parent_message_id === parentId);

  const unreadCount = rows.filter(
    (r) => !r.parent_message_id && isUnread(r, myUid),
  ).length;
  const selectedThread = topLevel.find((r) => r.id === selectedId) ?? topLevel[0] ?? null;

  useEffect(() => {
    if (selectedId && !topLevel.some((r) => r.id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, topLevel]);

  const overviewEmail = selectedThread
    ? counterpartEmail(selectedThread, myUid, fromEmail)
    : "";
  const overviewName = (overviewEmail || "Contact").split("@")[0];

  if (rows.length === 0) {
    return (
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_240px]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-3 shadow-sm">
            <p className="mb-3 px-1 text-xs font-bold uppercase tracking-wide text-text-muted">
              Inbox
            </p>
            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-secondary">
              No conversations yet
            </p>
          </div>
        </aside>
        <section className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center shadow-sm">
          <MessageSquare className="mx-auto h-8 w-8 text-text-muted" />
          <p className="mt-3 font-semibold text-navy">No messages yet</p>
          <p className="mt-2 text-sm text-text-secondary">
            {isClient
              ? "Message freelancers after you accept a Connect request, or start from a shared project."
              : "Message clients from your CRM email, or continue after a Connect match."}
          </p>
          <div className="mx-auto mt-4 max-w-md">
            <ComposeForm fromEmail={fromEmail} isClient={isClient} defaultToUid={prefillToUid} />
          </div>
          <Link
            href="/connect"
            className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white ${
              isClient ? "bg-client-accent" : "bg-primary"
            }`}
          >
            <Network className="h-4 w-4" />
            Open Connect
          </Link>
        </section>
        <aside className="hidden space-y-4 xl:block">
          <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <p className="mb-3 text-sm font-bold text-navy">Quick actions</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/app/connect" className={`font-semibold ${linkAccent}`}>
                  Invite →
                </Link>
              </li>
              <li>
                <Link href="/app/projects" className={`font-semibold ${linkAccent}`}>
                  Share project →
                </Link>
              </li>
              <li>
                <Link href="/app/settings" className={`font-semibold ${linkAccent}`}>
                  Settings →
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {liveError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {liveError}
        </div>
      )}
    <div className="grid h-full min-h-[32rem] gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm xl:grid-cols-[300px_minmax(0,1fr)_240px]">
      <aside className="flex max-h-[70vh] flex-col border-b border-border xl:max-h-none xl:border-b-0 xl:border-r">
        <div className="shrink-0 space-y-3 border-b border-border p-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-wide text-text-muted">Inbox</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {unreadCount} unread
            </span>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 py-1 font-semibold ${
                filter === "all" ? activeTabCls : "bg-background text-text-secondary"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-2.5 py-1 font-semibold ${
                filter === "unread" ? activeTabCls : "bg-background text-text-secondary"
              }`}
            >
              Unread {unreadCount}
            </button>
            <button
              type="button"
              onClick={() => setFilter("archived")}
              className={`rounded-lg px-2.5 py-1 font-semibold ${
                filter === "archived" ? activeTabCls : "bg-background text-text-secondary"
              }`}
            >
              Archived
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {topLevel.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-text-secondary">
              {filter === "archived"
                ? "No archived conversations."
                : filter === "unread"
                  ? "No unread messages."
                  : "No matching messages."}
            </p>
          ) : (
            <ul className="space-y-1.5">
              {topLevel.map((r) => {
                const incoming = isUnread(r, myUid) || r.from_uid !== myUid;
                const active = selectedThread?.id === r.id;
                const label = counterpartEmail(r, myUid, fromEmail) || r.from_email || "CLIVORA";
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(r.id)}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                        active ? activeThreadCls : "border-transparent bg-transparent hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                            isClient ? "bg-navy" : "bg-primary"
                          }`}
                        >
                          {label.charAt(0).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-bold text-navy">
                              {label.split("@")[0]}
                            </span>
                            {incoming && isUnread(r, myUid) && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white">
                                1
                              </span>
                            )}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-text-muted">
                            {r.subject || "Conversation"}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-text-muted">
                            {(r.body || "").slice(0, 48)}
                            {r.created_at ? ` · ${formatTime(r.created_at)}` : ""}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <section className="flex min-h-[28rem] flex-col xl:min-h-0">
        {selectedThread ? (
          (() => {
            const replies = repliesFor(selectedThread.id);
            const isIncoming = selectedThread.from_uid !== myUid;
            const replyTo = counterpartEmail(selectedThread, myUid, fromEmail);
            const threadMessages = [selectedThread, ...replies];
            let lastDate = "";
            return (
              <div className="flex h-full min-h-[28rem] flex-col">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="font-bold text-navy">
                        {(replyTo || selectedThread.from_email || "CLIVORA").split("@")[0]}
                      </h2>
                      <p className="text-xs text-text-muted">
                        {selectedThread.subject || "Conversation"}
                        {selectedThread.created_at
                          ? ` · ${formatTime(selectedThread.created_at)}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/app/projects"
                        className="rounded-lg border border-border px-2.5 py-1 text-[11px] font-semibold text-navy"
                      >
                        View project
                      </Link>
                      {isIncoming && isUnread(selectedThread, myUid) && (
                        <MarkReadButton
                          messageId={selectedThread.id}
                          readAt={selectedThread.read_at}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className={`mt-3 rounded-xl border border-border px-3 py-2 text-xs ${
                      isClient ? "bg-client-surface/50" : "bg-primary/5"
                    }`}
                  >
                    <span className="font-semibold text-navy">
                      {selectedThread.subject || "Shared project"}
                    </span>
                    <span className="mx-2 text-text-muted">·</span>
                    <span className="text-text-secondary">Fixed Price</span>
                    <span className="mx-2 inline-flex items-center gap-1 font-semibold text-sky-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      In Progress
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {threadMessages.map((msg) => {
                    const incoming = msg.from_uid !== myUid;
                    const dateLabel = formatDateLabel(msg.created_at);
                    const showDate = dateLabel && dateLabel !== lastDate;
                    if (showDate) lastDate = dateLabel;
                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                            {dateLabel}
                          </p>
                        )}
                        <div
                          className={`flex ${incoming ? "justify-start" : "justify-end"}`}
                        >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                            incoming ? "bg-slate-100 text-navy" : outBubbleCls
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.body || "(empty)"}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <p
                              className={`text-[10px] ${
                                incoming ? "text-text-muted" : "text-white/60"
                              }`}
                            >
                              {formatTime(msg.created_at)}
                            </p>
                            {incoming && isUnread(msg, myUid) && (
                              <MarkReadButton messageId={msg.id} readAt={msg.read_at} />
                            )}
                          </div>
                        </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border p-3">
                  <ComposeForm
                    fromEmail={fromEmail}
                    parentId={selectedThread.id}
                    parentSubject={selectedThread.subject ?? undefined}
                    compact
                    isClient={isClient}
                    defaultTo={replyTo || undefined}
                    defaultToUid={counterpartUid(selectedThread, myUid)}
                  />
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-8 w-8 text-text-muted" />
            <p className="mt-3 font-semibold text-navy">No thread selected</p>
            <p className="mt-2 text-sm text-text-secondary">
              Choose a thread from the inbox or start a new message.
            </p>
          </div>
        )}
      </section>

      <aside className="hidden space-y-4 xl:block">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm font-bold text-navy">
            {isClient ? "Freelancer overview" : "Client overview"}
          </p>
          {selectedThread ? (
            <div className="mt-3 flex items-center gap-3">
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${
                  isClient ? "bg-navy" : "bg-primary"
                }`}
              >
                {overviewName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{overviewName}</p>
                <p className="truncate text-xs text-text-muted">
                  {overviewEmail || "No email on file"}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-text-secondary">Select a conversation.</p>
          )}
          <p className="mt-3 text-xs text-text-secondary">
            {selectedThread?.subject || "Project conversation"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-navy">Quick actions</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href={isClient ? "/app/connect" : "/app/team"}
                className={`inline-flex items-center gap-1.5 font-semibold ${linkAccent}`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Invite →
              </Link>
            </li>
            <li>
              <Link
                href="/app/projects"
                className={`inline-flex items-center gap-1.5 font-semibold ${linkAccent}`}
              >
                <Share2 className="h-3.5 w-3.5" />
                Share project →
              </Link>
            </li>
            <li>
              <Link
                href="/app/settings"
                className={`inline-flex items-center gap-1.5 font-semibold ${linkAccent}`}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings →
              </Link>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-navy">New message</p>
          <ComposeForm
            fromEmail={fromEmail}
            isClient={isClient}
            compact
            defaultToUid={prefillToUid}
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-navy">Recent contacts</p>
          <ul className="space-y-3">
            {rows
              .filter((r) => !r.parent_message_id)
              .slice(0, 4)
              .map((r) => {
                const email = counterpartEmail(r, myUid, fromEmail) || r.from_email || "?";
                return (
                  <li key={r.id} className="flex items-center gap-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                        isClient ? "bg-navy" : "bg-primary"
                      }`}
                    >
                      {email.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy">
                        {email.split("@")[0]}
                      </p>
                      <p className="truncate text-[11px] text-text-muted">
                        {r.subject || (isClient ? "Freelancer" : "Client")}
                      </p>
                    </div>
                  </li>
                );
              })}
          </ul>
          <Link
            href={isClient ? "/app/team" : "/app/clients"}
            className={`mt-3 inline-block text-xs font-semibold ${linkAccent}`}
          >
            View all contacts →
          </Link>
        </div>
      </aside>
    </div>
    </div>
  );
}

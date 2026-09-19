import fs from "fs";
import path from "path";

export type AdminEvent = {
  id: string;
  eventType: string;
  userEmail: string;
  userName: string;
  plan: string;
  amount: number;
  payload: string;
  createdAt: string;
  source: string;
};

const LOCAL_FILE = path.join(process.cwd(), "data", "admin-events.json");
const VERCEL_TMP_FILE = path.join("/tmp", "clivora-admin-events.json");

function dataFiles(): string[] {
  // Prefer cwd data/ when writable (Hostinger Node apps); fall back to /tmp
  // on ephemeral filesystems (Vercel / restricted hosts).
  return [LOCAL_FILE, VERCEL_TMP_FILE];
}

function readFileEvents(filePath: string): AdminEvent[] {
  try {
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return Array.isArray(parsed) ? (parsed as AdminEvent[]) : [];
    }
  } catch {
    /* ignore corrupt file */
  }
  return [];
}

let memoryCache: AdminEvent[] | null = null;

function mergeEvents(lists: AdminEvent[][]): AdminEvent[] {
  const byId = new Map<string, AdminEvent>();
  for (const list of lists) {
    for (const event of list) {
      if (event?.id) byId.set(event.id, event);
    }
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function loadEvents(): AdminEvent[] {
  if (memoryCache) return memoryCache;
  const merged = mergeEvents(dataFiles().map(readFileEvents));
  memoryCache = merged;
  return memoryCache;
}

function persistEvents(events: AdminEvent[]) {
  memoryCache = events;
  for (const filePath of dataFiles()) {
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(events, null, 2));
    } catch {
      /* read-only FS on some hosts - memory cache still works per instance */
    }
  }
}

export function appendEvent(event: Omit<AdminEvent, "id">): AdminEvent {
  const entry: AdminEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  const events = [entry, ...loadEvents()].slice(0, 2000);
  persistEvents(events);
  return entry;
}

export function adminStats() {
  const events = loadEvents();
  const signups = events.filter((e) => e.eventType === "signup").length;
  const proActivations = events.filter((e) => e.eventType === "pro_activate").length;
  const auditEvents = events.filter((e) => e.eventType.startsWith("audit_"));
  const emails = new Set(events.map((e) => e.userEmail).filter(Boolean));
  const generalEvents = events.filter((e) => !e.eventType.startsWith("audit_"));
  return {
    totalEvents: events.length,
    uniqueEmails: emails.size,
    signups,
    proActivations,
    auditCount: auditEvents.length,
    estimatedMrrUsd: proActivations * 9,
    events: generalEvents.slice(0, 100),
    auditEvents: auditEvents.slice(0, 50),
  };
}

export function formatAuditAction(eventType: string): string {
  return eventType.replace(/^audit_/, "").replace(/_/g, " ");
}

export function formatAuditDetail(payload: string): string {
  if (!payload || payload === "{}") return "N/A";
  try {
    const data = JSON.parse(payload) as Record<string, unknown>;
    if (typeof data.detail === "string" && data.detail) return data.detail;
    const parts: string[] = [];
    if (data.action) parts.push(String(data.action));
    if (data.entityType) parts.push(String(data.entityType));
    if (data.fromStatus && data.toStatus) parts.push(`${data.fromStatus} → ${data.toStatus}`);
    return parts.length ? parts.join(" · ") : payload.slice(0, 120);
  } catch {
    return payload.slice(0, 120);
  }
}

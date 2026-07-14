import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Bookmark,
  Building2,
  Filter,
  FolderKanban,
  Plus,
  ShoppingBag,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { getProfile, isClientAccount } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { listCustomersServer, listProjectsServer } from "@/lib/crm/server";
import { listPublicConnectNeeds, listPublicConnectProfiles } from "@/lib/connect";
import {
  FreelancerCard,
  FreelancerPageHeader,
  OutlineButton,
  PrimaryButton,
  StatusPill,
} from "@/components/freelancer/ui";
import {
  ClientCard,
  ClientPageHeader,
  ClientPrimaryButton,
  ClientStatCard,
} from "@/components/client/ui";

export const metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const isClient = isClientAccount(profile);
  const supabase = await createClient();

  type BookmarkRow = {
    id: string;
    target_id: string;
    target_type: string;
    title: string | null;
    meta: Record<string, unknown> | null;
    created_at: string | null;
  };

  let bookmarks: BookmarkRow[] = [];
  try {
    const { data } = await supabase
      .from("freelancer_bookmarks")
      .select("id, target_id, target_type, title, meta, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(50);
    bookmarks = (data ?? []) as BookmarkRow[];
  } catch {
    bookmarks = [];
  }

  if (isClient) {
    const freelancerBookmarks = bookmarks.filter(
      (b) => b.target_type === "freelancer" || b.target_type === "job",
    );
    let talent: Awaited<ReturnType<typeof listPublicConnectProfiles>> = [];
    try {
      talent = await listPublicConnectProfiles();
    } catch {
      talent = [];
    }
    const byUserId = new Map(talent.map((t) => [t.user_id, t]));
    const byId = new Map(talent.map((t) => [t.id, t]));
    const savedTalent = freelancerBookmarks
      .map((b) => {
        const profileRow = byUserId.get(b.target_id) || byId.get(b.target_id);
        return {
          bookmark: b,
          profile: profileRow,
        };
      })
      .filter((x) => x.profile || x.bookmark.title);

    return (
      <div className="space-y-6 pb-10">
        <ClientPageHeader
          title="Bookmarks"
          subtitle="Save freelancers and Connect profiles you want to hire later."
          icon={Bookmark}
          actions={
            <ClientPrimaryButton href="/app/connect">
              <Plus className="h-4 w-4" />
              Browse talent
            </ClientPrimaryButton>
          }
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <ClientStatCard label="Saved freelancers" value={savedTalent.length} icon={Users} />
          <ClientStatCard
            label="Total bookmarks"
            value={bookmarks.length}
            icon={Bookmark}
          />
          <ClientStatCard
            label="Connect pool"
            value={talent.length}
            icon={Star}
            href="/app/connect"
          />
        </div>

        <ClientCard title="Saved freelancers">
          {savedTalent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="font-semibold text-navy">No saved freelancers yet</p>
              <p className="mt-2 text-sm text-text-secondary">
                Bookmark Connect profiles from the marketplace to find them here.
              </p>
              <Link
                href="/app/connect"
                className="mt-4 inline-block text-sm font-semibold text-client-accent"
              >
                Open Connect →
              </Link>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {savedTalent.map(({ bookmark, profile: cp }) => (
                <li
                  key={bookmark.id}
                  className="rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-client-surface text-sm font-bold text-client-accent">
                      {(cp?.display_title || bookmark.title || "F").charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-navy">
                        {cp?.display_title || bookmark.title || "Freelancer"}
                      </p>
                      <p className="truncate text-xs text-text-secondary">
                        {cp?.headline || "Saved Connect profile"}
                      </p>
                      {cp?.avg_rating != null && (
                        <p className="mt-1 text-xs text-amber-600">
                          ★ {Number(cp.avg_rating).toFixed(1)}
                          {cp.review_count != null ? ` · ${cp.review_count} reviews` : ""}
                        </p>
                      )}
                      <Link
                        href="/app/messages"
                        className="mt-2 inline-block text-xs font-semibold text-client-accent"
                      >
                        Message →
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ClientCard>
      </div>
    );
  }

  let projects: Awaited<ReturnType<typeof listProjectsServer>> = [];
  let customers: Awaited<ReturnType<typeof listCustomersServer>> = [];
  let talent: Awaited<ReturnType<typeof listPublicConnectProfiles>> = [];
  let jobs: Awaited<ReturnType<typeof listPublicConnectNeeds>> = [];

  try {
    [projects, customers, talent, jobs] = await Promise.all([
      listProjectsServer(),
      listCustomersServer(),
      listPublicConnectProfiles(),
      listPublicConnectNeeds(),
    ]);
  } catch {
    /* ignore */
  }

  const savedIds = bookmarks.map((d) => d.target_id);

  const savedProjects = projects.slice(0, 4);
  const savedClients = customers.slice(0, 4);
  const savedTalent = talent.slice(0, 4);
  const savedJobs = jobs.slice(0, 2);
  const total =
    savedProjects.length + savedClients.length + savedTalent.length + savedJobs.length || 0;

  return (
    <div className="space-y-6 pb-10">
      <FreelancerPageHeader
        title="Bookmarks"
        subtitle="Save and organize your favorite items to access them anytime."
        icon={Bookmark}
        actions={
          <>
            <OutlineButton>
              <Filter className="h-4 w-4" />
              Filters
            </OutlineButton>
            <PrimaryButton href="/app/connect">
              <Plus className="h-4 w-4" />
              Add New
            </PrimaryButton>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {[
          { label: `All Items (${total || 24})`, active: true },
          { label: `Projects (${savedProjects.length || 12})`, active: false },
          { label: `Clients (${savedClients.length || 6})`, active: false },
          { label: `Freelancers (${savedTalent.length || 4})`, active: false },
          { label: `Jobs (${savedJobs.length || 2})`, active: false },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            className={`rounded-full px-4 py-2 text-xs font-bold ${
              t.active ? "bg-navy text-white" : "bg-surface text-text-secondary border border-border"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-navy">Saved projects</h2>
            <div className="space-y-3">
              {(savedProjects.length ? savedProjects : [
                { id: "demo1", name: "E-commerce Website Redesign", description: "FinTech Solutions", budget: 2500, status: "active" },
                { id: "demo2", name: "Mobile Banking App", description: "Nova Startup", budget: 4000, status: "active" },
              ]).map((p, i) => (
                <article
                  key={p.id}
                  className="relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <span className="absolute left-3 top-0 text-violet-500">
                    <Bookmark className="h-4 w-4 fill-violet-500" />
                  </span>
                  <span
                    className={`mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${
                      i % 2 === 0 ? "bg-primary" : "bg-violet-500"
                    }`}
                  >
                    {i % 2 === 0 ? <ShoppingBag className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-navy">{p.name}</p>
                    <p className="text-xs text-text-secondary">
                      {(p as { description?: string }).description || "CRM project"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusPill tone="violet">Web Development</StatusPill>
                      <StatusPill tone="blue">React</StatusPill>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy">
                      ${Number(p.budget || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted">Budget</p>
                  </div>
                </article>
              ))}
            </div>
            <Link
              href="/app/projects"
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-navy hover:border-primary/40"
            >
              View all Projects →
            </Link>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-navy">Saved clients</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(savedClients.length ? savedClients : []).slice(0, 4).map((c) => (
                <article
                  key={c.id}
                  className="relative rounded-2xl border border-border bg-surface p-4 shadow-sm"
                >
                  <Bookmark className="absolute right-3 top-3 h-4 w-4 fill-violet-500 text-violet-500" />
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-bold text-navy">{c.company || c.contact_person}</p>
                  <p className="truncate text-xs text-text-secondary">
                    {Array.isArray(c.emails) ? String(c.emails[0] || "") : c.city || "Client"}
                  </p>
                  <p className="mt-2 text-xs text-amber-600">★ 4.9 · Projects</p>
                </article>
              ))}
              {savedClients.length === 0 && (
                <p className="col-span-full text-sm text-text-secondary">
                  Bookmark clients from your CRM to see them here.{" "}
                  <Link href="/app/clients" className="font-semibold text-primary">
                    Open clients →
                  </Link>
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <FreelancerCard title="Collections">
            <ul className="space-y-2">
              {[
                { name: "High Priority Projects", color: "bg-violet-500", count: savedProjects.length || 5 },
                { name: "Potential Clients", color: "bg-primary", count: savedClients.length || 3 },
                { name: "Connect Talent", color: "bg-sky-500", count: savedTalent.length || 2 },
              ].map((c) => (
                <li
                  key={c.name}
                  className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <span className={`h-3 w-3 rounded-full ${c.color}`} />
                  <span className="flex-1 text-sm font-semibold text-navy">{c.name}</span>
                  <span className="text-xs text-text-muted">{c.count}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 text-sm font-semibold text-primary">
              + New Collection
            </button>
          </FreelancerCard>

          <FreelancerCard title="Recent bookmarks">
            <ul className="space-y-3 text-sm">
              {savedProjects.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate font-medium text-navy">{p.name}</span>
                  <span className="text-[10px] text-text-muted">Project</span>
                </li>
              ))}
              {savedJobs.slice(0, 2).map((j) => (
                <li key={j.id} className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600" />
                  <span className="flex-1 truncate font-medium text-navy">{j.title}</span>
                  <span className="text-[10px] text-text-muted">Job</span>
                </li>
              ))}
              {savedProjects.length === 0 && savedJobs.length === 0 && (
                <li className="text-text-secondary">No recent bookmarks yet.</li>
              )}
            </ul>
          </FreelancerCard>

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-white p-5">
            <p className="font-display font-bold text-navy">Sync across devices</p>
            <p className="mt-1 text-sm text-text-secondary">
              Bookmarks stay available on web and the Android app.
            </p>
            <Link href="/app/account" className="mt-3 inline-block text-sm font-semibold text-primary">
              Learn more →
            </Link>
          </div>
          {savedIds.length > 0 && (
            <p className="text-[10px] text-text-muted">{savedIds.length} synced bookmarks</p>
          )}
        </aside>
      </div>
    </div>
  );
}

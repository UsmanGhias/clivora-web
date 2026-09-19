import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { DOC_CATALOG } from "@/lib/docs";
import { site } from "@/lib/site";

export function DocsShell({
  currentSlug,
  children,
}: {
  currentSlug: string;
  children: React.ReactNode;
}) {
  const sorted = [...DOC_CATALOG].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary">
      <MarketingNav variant="light" />

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-20 space-y-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            {sorted.map((doc) => (
              <Link
                key={doc.slug}
                href={doc.slug === "index" ? "/docs" : `/docs/${doc.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  currentSlug === doc.slug
                    ? "bg-primary/10 text-primary-dark"
                    : "text-text-secondary hover:bg-slate-50 hover:text-navy"
                }`}
              >
                {doc.title}
              </Link>
            ))}
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="px-3 text-xs font-bold uppercase tracking-wide text-text-muted">
                Resources
              </p>
              <Link
                href="/for-freelancers"
                className="mt-2 block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-slate-50"
              >
                For freelancers
              </Link>
              <Link
                href="/for-clients"
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-slate-50"
              >
                For clients
              </Link>
              <Link
                href="/support"
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-slate-50"
              >
                Contact support
              </Link>
              <Link
                href={site.playStoreUrl}
                className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-slate-50"
              >
                Android app
              </Link>
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

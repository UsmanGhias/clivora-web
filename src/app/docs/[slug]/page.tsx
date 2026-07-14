import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocsShell } from "@/components/docs/DocsShell";
import { Markdown } from "@/components/docs/Markdown";
import { getDocBySlug, stripLeadingH1 } from "@/lib/docs";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Old public URLs that exposed internal research, permanent redirect. */
const REMOVED_SLUGS = new Set(["ai-research-brief", "architecture"]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (REMOVED_SLUGS.has(slug)) {
    return { title: "Redirecting", robots: { index: false, follow: false } };
  }
  const doc = getDocBySlug(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: `${doc.meta.title} | Docs`,
    description: `CLIVORA documentation: ${doc.meta.title}`,
    openGraph: {
      title: `${doc.meta.title} | ${site.name} Docs`,
      url: `${site.url}/docs/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: "product-overview" },
    { slug: "user-guide" },
    { slug: "connect" },
    { slug: "plans-and-billing" },
    { slug: "web-and-android" },
    { slug: "changelog" },
    { slug: "faq" },
  ];
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  if (REMOVED_SLUGS.has(slug)) {
    redirect("/docs");
  }
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  return (
    <DocsShell currentSlug={slug}>
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <Markdown content={stripLeadingH1(doc.content)} />
      </div>
    </DocsShell>
  );
}

import type { Metadata } from "next";
import { DocsShell } from "@/components/docs/DocsShell";
import { Markdown } from "@/components/docs/Markdown";
import { getDocBySlug, stripLeadingH1 } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Official CLIVORA documentation, user guide, Connect marketplace, plans, architecture, and AI research brief.",
  openGraph: {
    title: `Documentation | ${site.name}`,
    url: `${site.url}/docs`,
  },
};

export default function DocsIndexPage() {
  const doc = getDocBySlug("index");
  if (!doc) {
    return (
      <DocsShell currentSlug="index">
        <p>Documentation is being updated.</p>
      </DocsShell>
    );
  }

  return (
    <DocsShell currentSlug="index">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          CLIVORA Documentation
        </h1>
        <div className="mt-6">
          <Markdown content={stripLeadingH1(doc.content)} />
        </div>
      </div>
    </DocsShell>
  );
}

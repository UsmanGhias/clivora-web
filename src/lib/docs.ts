import fs from "fs";
import path from "path";

export type DocMeta = {
  slug: string;
  title: string;
  description?: string;
  order: number;
};

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

/** Public user-facing docs only, no internal research or architecture. */
export const DOC_CATALOG: DocMeta[] = [
  { slug: "index", title: "Introduction", order: 0 },
  { slug: "product-overview", title: "Product overview", order: 1 },
  { slug: "user-guide", title: "User guide", order: 2 },
  { slug: "connect", title: "Connect marketplace", order: 3 },
  { slug: "plans-and-billing", title: "Plans & billing", order: 4 },
  { slug: "web-and-android", title: "Web vs Android", order: 5 },
  { slug: "changelog", title: "Changelog", order: 6 },
  { slug: "faq", title: "FAQ", order: 7 },
];

export function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getDocBySlug(slug: string): { meta: DocMeta; content: string } | null {
  const file = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const content = fs.readFileSync(file, "utf8");
  const meta = DOC_CATALOG.find((d) => d.slug === slug) ?? {
    slug,
    title: slug.replace(/-/g, " "),
    order: 99,
  };
  return { meta, content };
}

export function getAllDocs() {
  return DOC_CATALOG.map((meta) => {
    const doc = getDocBySlug(meta.slug);
    return doc ? { ...meta, content: doc.content } : null;
  }).filter(Boolean) as Array<DocMeta & { content: string }>;
}

export function stripLeadingH1(md: string): string {
  return md.replace(/^#\s+.+\n+/, "");
}

import fs from "fs";
import path from "path";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const BLOG_AUTHOR = {
  name: "Usman Ghias",
  jobTitle: "Founder & Lead Architect",
  worksFor: "Clivora & CODCrafters",
  url: "https://usmanghias.co.uk",
  path: "/blog/authors/usman-ghias",
  sameAs: ["https://usmanghias.co.uk", "https://codcrafters.org"],
} as const;

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  keywords: string[];
  readingMinutes: number;
  wordCount: number;
};

export type Post = PostMeta & { content: string };

/** Minimal frontmatter parser: `key: value` lines between two `---` fences. */
function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = value;
  }
  return { data, body: match[2] };
}

function toPost(slug: string, raw: string): Post | null {
  const { data, body } = parseFrontmatter(raw);
  // Posts must opt in to publication; drafts and generator templates stay hidden.
  if (!data.title || !data.description || !data.date || data.published === "false") return null;
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || undefined,
    keywords: (data.keywords ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    readingMinutes: Math.max(1, Math.round(wordCount / 230)),
    wordCount,
    content: body.trim(),
  };
}

export function getPostBySlug(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return toPost(slug, fs.readFileSync(file, "utf8"));
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => getPostBySlug(f.replace(/\.md$/, "")))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Markdown } from "@/components/docs/Markdown";
import { BLOG_AUTHOR, formatPostDate, getAllPosts, getPostBySlug } from "@/lib/blog";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  const url = `${site.url}/blog/${slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: BLOG_AUTHOR.name, url: BLOG_AUTHOR.url }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [BLOG_AUTHOR.url],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${slug}`;
  const person = {
    "@type": "Person",
    name: BLOG_AUTHOR.name,
    url: BLOG_AUTHOR.url,
    jobTitle: BLOG_AUTHOR.jobTitle,
    worksFor: { "@type": "Organization", name: BLOG_AUTHOR.worksFor },
    sameAs: [...BLOG_AUTHOR.sameAs],
  };
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      wordCount: post.wordCount,
      keywords: post.keywords.join(", "),
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: person,
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary">
      <MarketingNav variant="light" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:underline">Guides</Link>
        </nav>

        <header className="mb-8">
          <h1 className="font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-text-secondary">{post.description}</p>
          <p className="mt-4 text-sm text-text-secondary">
            By{" "}
            <Link href={BLOG_AUTHOR.path} className="font-semibold text-navy underline" rel="author">
              {BLOG_AUTHOR.name}
            </Link>
            , {BLOG_AUTHOR.jobTitle} at {BLOG_AUTHOR.worksFor} · Published {formatPostDate(post.date)}
            {post.updated && post.updated !== post.date ? ` · Updated ${formatPostDate(post.updated)}` : ""} ·{" "}
            {post.readingMinutes} min read
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <Markdown content={post.content} />
        </div>

        <aside className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">About the author</p>
          <p className="mt-2 text-text-secondary">
            <Link href={BLOG_AUTHOR.path} className="font-semibold text-navy underline">
              {BLOG_AUTHOR.name}
            </Link>{" "}
            is {BLOG_AUTHOR.jobTitle} at {BLOG_AUTHOR.worksFor}, where he builds the invoicing, CRM and
            milestone tooling that freelance engineers use to run client work. Portfolio:{" "}
            <a href={BLOG_AUTHOR.url} className="underline" rel="me noopener">
              usmanghias.co.uk
            </a>
            .
          </p>
          <p className="mt-3 text-xs text-text-secondary">
            General information only, not legal, tax or financial advice. Rules change and vary by country;
            confirm specifics with a qualified adviser before acting.
          </p>
        </aside>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-navy">More guides</h2>
            <ul className="mt-4 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="font-semibold text-navy underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <MarketingFooter />
    </div>
  );
}

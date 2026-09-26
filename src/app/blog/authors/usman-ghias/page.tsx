import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { BLOG_AUTHOR, formatPostDate, getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${BLOG_AUTHOR.name}, ${BLOG_AUTHOR.jobTitle}`,
  description: `Articles by ${BLOG_AUTHOR.name}, ${BLOG_AUTHOR.jobTitle} at ${BLOG_AUTHOR.worksFor}.`,
  alternates: { canonical: `${site.url}${BLOG_AUTHOR.path}` },
};

export default function AuthorPage() {
  const posts = getAllPosts();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.url,
      jobTitle: BLOG_AUTHOR.jobTitle,
      worksFor: { "@type": "Organization", name: BLOG_AUTHOR.worksFor },
      sameAs: [...BLOG_AUTHOR.sameAs],
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary">
      <MarketingNav variant="light" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{BLOG_AUTHOR.name}</h1>
        <p className="mt-2 text-text-secondary">
          {BLOG_AUTHOR.jobTitle} at {BLOG_AUTHOR.worksFor}
        </p>
        <div className="mt-6 space-y-4 text-text-secondary">
          <p>
            Usman builds the systems behind Clivora: the CRM, milestone tracking, invoicing and the offline-first
            Android app, on Next.js, Flutter and Supabase. Through CODCrafters he delivers software for agency and
            enterprise clients, which is where most of the practical detail in these guides comes from.
          </p>
          <p>
            Portfolio:{" "}
            <a href={BLOG_AUTHOR.url} className="font-semibold text-navy underline" rel="me noopener">
              usmanghias.co.uk
            </a>{" "}
            · More about the company on the <Link href="/about" className="underline">About page</Link>.
          </p>
        </div>
        <h2 className="mt-10 font-display text-xl font-bold text-navy">Articles</h2>
        <ul className="mt-4 space-y-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="font-semibold text-navy underline">
                {p.title}
              </Link>
              <span className="ml-2 text-sm text-text-secondary">{formatPostDate(p.date)}</span>
            </li>
          ))}
        </ul>
      </main>
      <MarketingFooter />
    </div>
  );
}

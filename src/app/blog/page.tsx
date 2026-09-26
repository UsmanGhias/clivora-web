import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { BLOG_AUTHOR, formatPostDate, getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides for Freelance Engineers and Agencies",
  description:
    "Long-form guides on remote engineering rates, contractor agreements, cross-border tax paperwork, invoicing and platform fees, written by the team that builds Clivora.",
  alternates: { canonical: `${site.url}/blog` },
  openGraph: {
    title: `Guides for Freelance Engineers and Agencies | ${site.name}`,
    url: `${site.url}/blog`,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${site.url}/blog` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary">
      <MarketingNav variant="light" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">Guides</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Running a freelance engineering business
          </h1>
          <p className="mt-4 max-w-2xl text-text-secondary">
            Rates, contracts, tax paperwork, invoicing and platform economics for independent engineers and
            small agencies. Written by{" "}
            <Link href={BLOG_AUTHOR.path} className="font-semibold text-navy underline">
              {BLOG_AUTHOR.name}
            </Link>
            , {BLOG_AUTHOR.jobTitle} at {BLOG_AUTHOR.worksFor}.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-text-secondary">New guides are on the way.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="font-display text-xl font-bold text-navy group-hover:underline">{post.title}</h2>
                  <p className="mt-2 text-text-secondary">{post.description}</p>
                  <p className="mt-3 text-sm text-text-secondary">
                    {formatPostDate(post.date)} · {post.readingMinutes} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <MarketingFooter />
    </div>
  );
}

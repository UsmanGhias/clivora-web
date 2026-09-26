import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { site, legalLinks } from "@/lib/site";
import { DOC_CATALOG } from "@/lib/docs";
import { getAllPosts, BLOG_AUTHOR } from "@/lib/blog";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

// Rebuild hourly so newly crawled jobs reach search engines without a redeploy.
export const revalidate = 3600;

type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  lastModified?: Date | string;
};

const CATEGORIES = [
  "software-development",
  "design",
  "devops-sysadmin",
  "data-science",
  "marketing",
  "product",
  "customer-support",
  "management",
  "general",
];

const POPULAR_SKILLS: Record<string, string[]> = {
  "software-development": [
    "react",
    "nextjs",
    "typescript",
    "javascript",
    "python",
    "django",
    "fastapi",
    "nodejs",
    "express",
    "flutter",
    "dart",
    "golang",
    "rust",
    "full-stack",
    "frontend",
    "backend",
    "ios",
    "android",
    "swift",
    "kotlin",
    "react-native",
    "odoo",
    "java",
    "spring-boot",
    "csharp",
    "dotnet",
    "php",
    "laravel",
    "wordpress",
    "shopify",
    "vue",
    "angular",
    "svelte",
    "tailwind-css",
    "graphql",
    "solidity",
  ],
  design: [
    "ui-ux",
    "figma",
    "product-design",
    "brand-identity",
    "web-design",
    "illustration",
    "motion-design",
    "design-systems",
    "mobile-app-design",
    "3d-blender",
    "graphic-design",
    "wireframing",
  ],
  "devops-sysadmin": [
    "aws",
    "kubernetes",
    "docker",
    "terraform",
    "ci-cd",
    "cloud",
    "linux",
    "gcp",
    "azure",
    "ansible",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "nginx",
    "prometheus",
    "grafana",
    "sre",
  ],
  "data-science": [
    "ai",
    "machine-learning",
    "llm",
    "data-engineering",
    "sql",
    "analytics",
    "deep-learning",
    "nlp",
    "computer-vision",
    "pandas",
    "pytorch",
    "tensorflow",
    "powerbi",
    "tableau",
    "bigquery",
  ],
  marketing: [
    "seo",
    "content-marketing",
    "growth",
    "social-media",
    "copywriting",
    "paid-ads",
    "email-marketing",
    "technical-writing",
    "lead-generation",
    "b2b-marketing",
    "google-ads",
  ],
  product: [
    "product-manager",
    "technical-pm",
    "scrum-master",
    "roadmapping",
    "user-research",
    "agile",
    "product-strategy",
  ],
  "customer-support": [
    "customer-success",
    "technical-support",
    "support-lead",
    "helpdesk",
    "client-onboarding",
  ],
  management: [
    "engineering-management",
    "operations",
    "project-management",
    "team-lead",
    "cto-consulting",
    "scrum",
  ],
  general: ["remote", "contract", "freelance", "part-time", "full-time"],
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const core: SitemapEntry[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/jobs", priority: 0.95, changeFrequency: "hourly" },
    { path: "/connect", priority: 0.95, changeFrequency: "daily" },
    { path: "/for-freelancers", priority: 0.9, changeFrequency: "weekly" },
    { path: "/for-clients", priority: 0.9, changeFrequency: "weekly" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.9, changeFrequency: "weekly" },
    { path: "/tools/freelance-rate-calculator", priority: 0.88, changeFrequency: "weekly" },
    { path: "/tools/upwork-fee-calculator", priority: 0.88, changeFrequency: "weekly" },
    { path: "/tools/invoice-generator", priority: 0.88, changeFrequency: "weekly" },
    { path: "/start-a-project", priority: 0.85, changeFrequency: "weekly" },
    { path: "/compare", priority: 0.85, changeFrequency: "weekly" },
    { path: "/compare/upwork", priority: 0.85, changeFrequency: "weekly" },
    { path: "/compare/fiverr", priority: 0.85, changeFrequency: "weekly" },
    { path: "/compare/contra", priority: 0.85, changeFrequency: "weekly" },
    { path: "/compare/bonsai", priority: 0.85, changeFrequency: "weekly" },
    { path: "/trust", priority: 0.82, changeFrequency: "monthly" },
    { path: "/security", priority: 0.8, changeFrequency: "monthly" },
    { path: "/integrations", priority: 0.8, changeFrequency: "monthly" },
    { path: "/pro", priority: 0.8, changeFrequency: "monthly" },
    { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" },
    { path: "/support", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ];

  const docs: SitemapEntry[] = DOC_CATALOG.filter((d) => d.slug !== "index").map((d) => ({
    path: `/docs/${d.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const legal: SitemapEntry[] = [
    legalLinks.privacy,
    legalLinks.terms,
    legalLinks.cookies,
    legalLinks.disclaimer,
    legalLinks.sitemap,
    legalLinks.deleteAccount,
    legalLinks.dataSafety,
  ].map((path) => ({
    path,
    priority: 0.4,
    changeFrequency: "monthly" as const,
  }));

  // Categories
  const categoryUrls: SitemapEntry[] = CATEGORIES.map((cat) => ({
    path: `/jobs/${cat}`,
    priority: 0.85,
    changeFrequency: "daily" as const,
  }));

  // Skill sub-pages for SEO
  const skillUrls: SitemapEntry[] = [];
  for (const [cat, skills] of Object.entries(POPULAR_SKILLS)) {
    for (const skill of skills) {
      skillUrls.push({
        path: `/jobs/${cat}/${skill}`,
        priority: 0.8,
        changeFrequency: "daily" as const,
      });
    }
  }

  // Fetch all published jobs from Supabase
  let jobUrls: SitemapEntry[] = [];
  try {
    // Cookie-free anon client: the cookie-bound server client throws during static generation,
    // which left every /jobs/view URL out of the sitemap. RLS allows anon reads of published jobs.
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    // PostgREST caps each response at 1000 rows, so page through up to MAX_SITEMAP_JOBS.
    const MAX_SITEMAP_JOBS = 2000;
    const PAGE = 1000;
    const jobs: { seo_slug: string; created_at: string }[] = [];
    for (let from = 0; from < MAX_SITEMAP_JOBS; from += PAGE) {
      const { data, error } = await supabase
        .from("connect_jobs")
        .select("seo_slug, created_at")
        .eq("is_public", true)
        .eq("status", "published")
        // Only jobs posted on CLIVORA itself; third-party listings are noindexed.
        .is("source_url", null)
        .or("source.is.null,source.eq.client,source.eq.clivora")
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, Math.min(from + PAGE, MAX_SITEMAP_JOBS) - 1);
      if (error) throw error;
      jobs.push(...(data ?? []));
      if (!data || data.length < PAGE) break;
    }

    if (jobs.length > 0) {
      jobUrls = jobs.map((job) => ({
        path: `/jobs/view/${job.seo_slug}`,
        priority: 0.75,
        changeFrequency: "weekly" as const,
        lastModified: new Date(job.created_at),
      }));
    }
  } catch (e) {
    console.error("[sitemap] Failed to load jobs for sitemap:", e);
  }

  const posts = getAllPosts();
  const blog: SitemapEntry[] = [
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
    { path: BLOG_AUTHOR.path, priority: 0.6, changeFrequency: "monthly" },
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
      lastModified: p.updated ?? p.date,
    })),
  ];

  // skillUrls are intentionally excluded: those pages are noindex.
  void skillUrls;
  const allRoutes: SitemapEntry[] = [
    ...core,
    ...blog,
    ...categoryUrls,
    ...jobUrls,
    ...docs,
    ...legal,
  ];

  return allRoutes.map(({ path, priority, changeFrequency, lastModified }) => ({
    url: `${site.url}${path}`,
    lastModified: lastModified || now,
    changeFrequency,
    priority,
  }));
}

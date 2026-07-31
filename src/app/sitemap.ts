import type { MetadataRoute } from "next";
import { site, legalLinks } from "@/lib/site";
import { DOC_CATALOG } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/features", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/for-freelancers", priority: 0.9, changeFrequency: "weekly" },
    { path: "/for-clients", priority: 0.9, changeFrequency: "weekly" },
    { path: "/connect", priority: 0.9, changeFrequency: "weekly" },
    { path: "/compare", priority: 0.85, changeFrequency: "monthly" },
    { path: "/pro", priority: 0.8, changeFrequency: "monthly" },
    { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
    { path: "/login", priority: 0.5, changeFrequency: "monthly" },
    { path: "/signup", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/support", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  ];

  const docs = DOC_CATALOG.filter((d) => d.slug !== "index").map((d) => ({
    path: `/docs/${d.slug}`,
    priority: 0.55,
    changeFrequency: "monthly" as const,
  }));

  const legal = [
    legalLinks.privacy,
    legalLinks.terms,
    legalLinks.cookies,
    legalLinks.deleteAccount,
    legalLinks.dataSafety,
  ].map((path) => ({
    path,
    priority: 0.3,
    changeFrequency: "yearly" as const,
  }));

  return [...core, ...docs, ...legal].map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

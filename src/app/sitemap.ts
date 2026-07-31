import type { MetadataRoute } from "next";
import { site, legalLinks } from "@/lib/site";
import { DOC_CATALOG } from "@/lib/docs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/features",
    "/pricing",
    "/for-freelancers",
    "/for-clients",
    "/connect",
    "/login",
    "/signup",
    "/pro",
    "/docs",
    ...DOC_CATALOG.filter((d) => d.slug !== "index").map((d) => `/docs/${d.slug}`),
    legalLinks.privacy,
    legalLinks.terms,
    legalLinks.cookies,
    legalLinks.about,
    legalLinks.contact,
    legalLinks.support,
    legalLinks.deleteAccount,
    legalLinks.dataSafety,
  ];

  return pages.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}

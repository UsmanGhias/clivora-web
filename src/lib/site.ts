import { getPublicSiteUrl } from "@/lib/site-url";
import { productManifest } from "@/config/product";

export const site = {
  /** Must match Google OAuth consent screen app name exactly: "Clivora". */
  name: "Clivora",
  tagline: "Complete Freelancer OS - Connect, CRM & Invoices",
  shortDescription:
    "Complete Freelancer OS: private Connect hiring, CRM, invoices, and timesheets on web and Android - $0 platform fee on your deals.",
  metaDescription:
    "Clivora is a complete Freelancer OS for hire, private Connect, CRM, invoices, and timesheets on web and Android with $0 deal fees.",
  description:
    "Clivora is a complete Freelancer OS for freelancers and clients worldwide. Hire and get hired on Connect with private contact until mutual accept, then run clients, projects, invoices, and timesheets on web and Android with one account. Platform fee on negotiated deals stays $0 - clients pay freelancers directly.",
  /** Build-time: set NEXT_PUBLIC_SITE_URL=https://clivora.io on Hostinger production. */
  url: getPublicSiteUrl(),
  appPackage: "org.codcrafters.clivora",
  appVersion: productManifest.versions.android,
  webVersion: productManifest.versions.web,
  company: {
    name: "CODCrafters",
    url: "https://clivora.io",
    email: "hello@clivora.io",
    supportEmail: "contact@clivora.io",
    privacyEmail: "contact@clivora.io",
    legalEmail: "contact@clivora.io",
  },
  pricing: {
    proMonthlyUsd: 0,
    proMonthlyLabel: "$0",
    proPlusMonthlyUsd: 0,
    proPlusMonthlyLabel: "$0",
    proListLabel: "$0",
    proPlusListLabel: "$0",
    billingNote: "100% Free during Founder Launch. Zero platform fees.",
    earlyAccessNote:
      "Start 100% free with unlimited tools and Connect access.",
  },
  freeLimits: {
    clients: 3,
    projects: 5,
    invoicesPerMonth: 10,
    templates: 3,
    fileVaultMb: 100,
  },
  proLimits: {
    fileVaultGb: 5,
  },
  proPlusLimits: {
    fileVaultGb: 50,
  },
  social: {
    github: "https://github.com/UsmanGhias/clivora",
    facebook: "https://www.facebook.com/clivora.io/",
    x: "https://x.com/clivoraos",
    linkedin: "https://www.linkedin.com/company/clivoraos",
    instagram: "https://www.instagram.com/clivoraos",
    youtube: "https://www.youtube.com/@clivora-io",
    tiktok: "https://tiktok.com/@clivoraos",
  },
  githubRepo: "https://github.com/UsmanGhias/clivora",
  openSourceUrl: "https://github.com/UsmanGhias/clivora",
  playStoreUrl: "https://play.google.com/store/apps/details?id=org.codcrafters.clivora",
  apkDownloadUrl: "/download/apk",
  githubReleaseUrl: "https://github.com/UsmanGhias/clivora/releases/tag/v5.6.2-open-source",
  directApkUrl: "https://github.com/UsmanGhias/clivora/releases/download/v5.6.2-open-source/clivora-5.6.2.apk",
  /** Custom scheme handled by Android MainActivity */
  appDeepLinkScheme: "clivora",
  appStoreUrl: "#",
  proCheckoutUrl: "/pro",
} as const;

export const legalLinks = {
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  disclaimer: "/disclaimer",
  sitemap: "/sitemap",
  deleteAccount: "/delete-account",
  dataSafety: "/data-safety",
  support: "/support",
  about: "/about",
  contact: "/contact",
} as const;

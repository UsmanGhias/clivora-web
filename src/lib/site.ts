import { getPublicSiteUrl } from "@/lib/site-url";

export const site = {
  /** Must match Google OAuth consent screen app name exactly: "Clivora". */
  name: "Clivora",
  tagline: "Complete Freelancer OS - Connect, CRM & Invoices",
  shortDescription:
    "Complete Freelancer OS: private Connect hiring, CRM, invoices, and timesheets on web and Android - $0 platform fee on your deals.",
  description:
    "Clivora is a complete Freelancer OS for freelancers and clients worldwide. Hire and get hired on Connect with private contact until mutual accept, then run clients, projects, invoices, and timesheets on web and Android with one account. Platform fee on negotiated deals stays $0 - clients pay freelancers directly.",
  /** Build-time: set NEXT_PUBLIC_SITE_URL=https://clivora.io on Hostinger production. */
  url: getPublicSiteUrl(),
  appPackage: "org.codcrafters.clivora",
  appVersion: "5.3.10",
  company: {
    name: "CODCrafters",
    url: "https://clivora.io",
    email: "contact@clivora.io",
    privacyEmail: "contact@clivora.io",
    legalEmail: "contact@clivora.io",
  },
  pricing: {
    proMonthlyUsd: 9,
    proMonthlyLabel: "$9",
    proPlusMonthlyUsd: 19,
    proPlusMonthlyLabel: "$19",
    proListLabel: "$14",
    proPlusListLabel: "$29",
    billingNote: "Billed monthly via Google Play. Cancel anytime.",
    earlyAccessNote:
      "Start free, then upgrade to Pro ($9/mo) or Pro Plus ($19/mo) when you need unlimited tools and Connect.",
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
    facebook: "https://www.facebook.com/clivora.io/",
    x: "https://x.com/clivoraos",
    linkedin: "https://www.linkedin.com/company/clivoraos",
    instagram: "https://www.instagram.com/clivoraos",
    youtube: "https://www.youtube.com/@clivora",
    tiktok: "https://tiktok.com/@clivoraos",
  },
  playStoreUrl: "https://play.google.com/store/apps/details?id=org.codcrafters.clivora",
  /** Custom scheme handled by Android MainActivity */
  appDeepLinkScheme: "clivora",
  appStoreUrl: "#",
  proCheckoutUrl: "/pro",
} as const;

export const legalLinks = {
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  deleteAccount: "/delete-account",
  dataSafety: "/data-safety",
  support: "/support",
  about: "/about",
  contact: "/contact",
} as const;

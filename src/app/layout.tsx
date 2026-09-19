import type { Metadata } from "next";
import { site } from "@/lib/site";
import { OdooLiveChat } from "@/components/common/OdooLiveChat";
import { CookieConsentBanner } from "@/components/common/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/common/GoogleAnalytics";
import { GoogleAdSense } from "@/components/common/GoogleAdSense";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    (() => {
      try {
        return new URL(site.url).toString();
      } catch {
        return "https://clivora.io";
      }
    })()
  ),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.shortDescription,
  keywords: [
    "Clivora",
    "Clivora freelancer platform",
    "freelancer workspace",
    "client workspace",
    "freelance project management",
    "freelancer collaboration",
    "freelancer CRM",
    "freelancer invoice app",
    "Clivora Connect",
    "freelance marketplace",
    "hire freelancers",
    "CODCrafters",
    "Usman Ghias",
    "freelancer OS",
    "client portal",
  ],
  authors: [
    { name: site.company.name, url: site.company.url },
    { name: "Usman Ghias" },
  ],
  creator: site.company.name,
  publisher: site.company.name,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.shortDescription,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/brand/clivora-og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Clivora Freelancer OS - workspace for freelancers and clients",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.shortDescription,
    images: ["/brand/clivora-og-share-1200x630.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "google-adsense-account": "ca-pub-6149132910438736",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-6149132910438736" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6149132910438736"
          crossOrigin="anonymous"
        />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen overflow-x-hidden font-sans">
        {children}
        <CookieConsentBanner />
        <OdooLiveChat />
      </body>
    </html>
  );
}

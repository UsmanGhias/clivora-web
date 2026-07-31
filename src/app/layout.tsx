import type { Metadata } from "next";
import { site } from "@/lib/site";
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
  description: site.description,
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
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/brand/clivora-og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Clivora Freelancer OS — workspace for freelancers and clients",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden font-sans">{children}</body>
    </html>
  );
}

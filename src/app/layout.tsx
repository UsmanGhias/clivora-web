import type { Metadata } from "next";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "freelancer CRM",
    "CLIVORA Connect",
    "freelance marketplace",
    "business operating system",
    "invoice app",
    "project management",
    "hire freelancers",
    "CLIVORA",
    "CODCrafters",
  ],
  authors: [{ name: site.company.name, url: site.company.url }],
  creator: site.company.name,
  publisher: site.company.name,
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/clivora_logo.png",
    apple: "/app-icon.png",
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

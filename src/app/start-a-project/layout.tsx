import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a Project with CODCrafters",
  description: "Launch your custom software project with Clivora and CODCrafters. Generate instant AI Scopes of Work and connect with top engineers.",
  alternates: { canonical: `${site.url}/start-a-project` },
};

export default function StartAProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

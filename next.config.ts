import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.clivora.io",
          },
        ],
        destination: "https://clivora.io/:path*",
        permanent: true,
      },
      {
        source: "/comapre",
        destination: "/compare",
        permanent: true,
      },
      {
        source: "/docs/ai-research-brief",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/CLIVORA-AI-Research-Brief.pdf",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/docs/architecture",
        destination: "/docs",
        permanent: true,
      },
      {
        source: "/calculator",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/agency",
        destination: "/for-clients",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/jobs",
        permanent: true,
      },
      {
        source: "/changelog",
        destination: "/docs/changelog",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/docs/ai-research-brief",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

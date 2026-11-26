import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
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
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://adservice.google.com https://community.clivora.io https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://community.clivora.io",
              "font-src 'self' data: https://fonts.gstatic.com https://community.clivora.io",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://community.clivora.io https://api.stripe.com https://api.getsafepay.com https://sandbox.api.getsafepay.com https://meet.jit.si https://*.clivora.io",
              "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://getsafepay.com https://sandbox.api.getsafepay.com https://meet.jit.si https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://community.clivora.io https://www.google.com https://*.clivora.io",
              "frame-ancestors 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com https://checkout.stripe.com https://getsafepay.com https://sandbox.api.getsafepay.com",
            ].join("; "),
          },
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

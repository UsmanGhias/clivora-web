import { site } from "@/lib/site";

/** Sitewide structured data for public marketing pages. */
export function MarketingJsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.company.name,
    url: site.url,
    logo: `${site.url}/brand/clivora-mark-1024.png`,
    email: site.company.email,
    founder: {
      "@type": "Person",
      name: "Usman Ghias",
      url: "https://usmanghias.co.uk",
      jobTitle: "Founder & Lead Architect",
      sameAs: [
        "https://usmanghias.co.uk",
        "https://github.com/UsmanGhias",
        "https://linkedin.com/in/usmanghias",
      ],
    },
    sameAs: [
      site.social.facebook,
      site.social.x,
      site.social.linkedin,
      site.social.instagram,
      site.social.youtube,
      site.social.tiktok,
      "https://community.clivora.io",
      "https://github.com/UsmanGhias/clivora",
    ],
    brand: {
      "@type": "Brand",
      name: site.name,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.shortDescription,
    publisher: { "@type": "Organization", name: site.company.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/jobs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: site.shortDescription,
    url: site.url,
    author: { "@type": "Organization", name: site.company.name },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Clivora Freelancer Platform",
    serviceType: "Freelancer workspace and client collaboration platform",
    provider: { "@type": "Organization", name: site.company.name },
    areaServed: "Worldwide",
    description:
      "Freelancer workspace and client workspace for project management, collaboration, invoicing, and Connect hiring with $0 deal platform fees.",
    url: site.url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </>
  );
}

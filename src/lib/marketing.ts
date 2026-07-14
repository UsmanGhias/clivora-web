import { site } from "@/lib/site";

/**
 * Single source of truth for marketing site copy, navigation, and section data.
 * Edit this file to reconfigure the public website without touching components.
 */
export const marketing = {
  brand: {
    name: site.name,
    productLine: "FREELANCER OS",
    badge: "All-in-One Freelance OS",
    tagline: "Work Smarter. Manage Everything. Grow Faster.",
    description: site.description,
  },

  nav: {
    links: [
      {
        label: "For Freelancers",
        href: "/for-freelancers",
        children: [
          { label: "Freelancer OS", href: "/for-freelancers" },
          { label: "Find Jobs", href: "/connect" },
          { label: "Features", href: "/features" },
        ],
      },
      {
        label: "For Clients",
        href: "/for-clients",
        children: [
          { label: "Client Portal", href: "/for-clients" },
          { label: "Hire Talent", href: "/connect" },
          { label: "Pricing", href: "/pricing" },
        ],
      },
      {
        label: "Features",
        href: "/features",
        children: [
          { label: "All Features", href: "/features" },
          { label: "Connect Marketplace", href: "/connect" },
          { label: "Pro Plans", href: "/pro" },
        ],
      },
      {
        label: "Resources",
        href: "/docs",
        children: [
          { label: "Documentation", href: "/docs" },
          { label: "Support", href: "/support" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
      { label: "Pricing", href: "/pricing" },
    ],
    cta: { label: "Get Started Free", href: "/signup" },
    login: { label: "Login", href: "/login" },
    locale: "EN",
  },

  hero: {
    badge: "All-in-One Freelance Management Platform",
    headline: ["Work Smarter. Manage Everything.", "Grow Faster."],
    body:
      "CLIVORA is your Freelance Business OS — manage clients and money, hire through a private marketplace, and work on web or Android without losing control. One account. Built for freelancers and teams who want more than just gigs.",
    primaryCta: { label: "I'm a Freelancer", href: "/signup?role=freelancer" },
    secondaryCta: { label: "I'm a Client", href: "/signup?role=client" },
    trusts: [
      "Offline-first Android",
      "Private Connect marketplace",
      "Invoices & client portal",
    ],
  },

  trustBar: {
    title: "Trusted by freelancers and growing teams worldwide.",
    logos: [
      "Nexora Labs",
      "BrightPath Co",
      "Orbit Studio",
      "Cedar & Co",
      "PixelCraft",
      "Northline",
      "Helix Soft",
      "Summit Digital",
    ],
  },

  dualPortal: {
    badge: "ALL-IN-ONE FREELANCE OS",
    headline: ["Everything You Need.", "One Powerful Platform."],
    body: "CLIVORA brings every tool, every workflow, and every connection together in one seamless operating system.",
    tabs: [
      { id: "freelancer" as const, label: "For Freelancers" },
      { id: "client" as const, label: "For Clients" },
    ],
    sideFeatures: {
      left: [
        {
          title: "Smart Dashboard",
          description: "Real-time overview of earnings, projects, proposals and more.",
          tone: "violet" as const,
        },
        {
          title: "Project Management",
          description: "Organize tasks, milestones, files and deadlines effortlessly.",
          tone: "green" as const,
        },
        {
          title: "Invoicing & Payments",
          description: "Create professional invoices and get paid on time.",
          tone: "orange" as const,
        },
      ],
      right: [
        {
          title: "Messages",
          description: "Communicate with clients or freelancers in real-time.",
          tone: "blue" as const,
        },
        {
          title: "Connect Marketplace",
          description: "Find work, hire talent and grow your network.",
          tone: "violet" as const,
        },
        {
          title: "AI Assistant",
          description: "Smart AI tools to write proposals, contracts, invoices and more.",
          tone: "teal" as const,
        },
      ],
    },
    bottomStrip: [
      "Analytics & Reports",
      "Expenses Tracking",
      "Contracts & Documents",
      "Time Tracking",
      "Backup & Security",
      "Workflows",
    ],
    socialProof: "Built for freelancers. Loved by teams. Growing worldwide.",
    activeUsers: "850+ Active Users",
  },

  freelancerOs: {
    headline: "Everything Freelancers Need to Succeed. All in One Workspace.",
    body: "Manage clients, projects, proposals, invoices, and payments from a beautiful, powerful dashboard — without juggling five different apps.",
    cta: { label: "Explore All Features", href: "/features" },
    features: [
      {
        title: "Complete Dashboard",
        description: "Track earnings, projects, proposals, and performance in real-time.",
      },
      {
        title: "Project Management",
        description: "Organize tasks, milestones, files, and deadlines effortlessly.",
      },
      {
        title: "Invoicing & Payments",
        description: "Create professional invoices, get paid on time, every time.",
      },
      {
        title: "Time Tracking",
        description: "Track time, log hours, and boost productivity.",
      },
      {
        title: "Client Management",
        description: "Manage clients, contracts, communications in one place.",
      },
      {
        title: "AI Assistant",
        description: "Write proposals, contracts, replies and more with CLIVORA AI.",
      },
    ],
    stats: [
      { value: "420+", label: "Active freelancers" },
      { value: "680+", label: "Projects delivered" },
      { value: "94%", label: "Client satisfaction" },
      { value: "$48K+", label: "Paid via CLIVORA" },
      { value: "22+", label: "Countries" },
      { value: "4.7/5", label: "Average rating" },
    ],
  },

  socialProof: {
    badge: "TRUSTED BY GROWING TEAMS WORLDWIDE",
    headline: ["Built for Top Talent.", "Trusted by Growing Teams."],
    body: "CLIVORA powers freelancers and businesses worldwide. Join a community of serious professionals who run work, money, and hiring in one private operating system.",
    features: [
      {
        title: "Top Talent",
        description: "Access skilled freelancers across design, development, writing, and 40+ categories.",
        tone: "violet" as const,
      },
      {
        title: "Secure & Reliable",
        description: "Private Connect, authenticated accounts, and clear privacy controls you can count on.",
        tone: "teal" as const,
      },
      {
        title: "Faster Delivery",
        description: "Get projects done faster with smart matching and connected proposals → projects → invoices.",
        tone: "orange" as const,
      },
      {
        title: "Proven Quality",
        description: "4.7/5 average rating from clients who finish real projects on CLIVORA.",
        tone: "blue" as const,
      },
      {
        title: "Global Reach",
        description: "Work with clients and talent from 22+ countries — anytime, across time zones.",
        tone: "violet" as const,
      },
      {
        title: "Business Growth",
        description: "CRM, analytics, and Connect help you scale beyond one-off gigs into lasting relationships.",
        tone: "green" as const,
      },
    ],
    floatingStats: [
      { value: "420+", label: "Active Freelancers", hint: "Ready for your next project." },
      { value: "680+", label: "Projects Completed", hint: "↑ 8% this quarter" },
      { value: "22+", label: "Countries Supported", hint: "Across the globe" },
      { value: "$48K+", label: "Total Paid", hint: "↑ 6% this quarter" },
    ],
    trustedBy: {
      title: "TRUSTED BY STUDIOS, STARTUPS, AND SOLO TEAMS",
      body: "From innovative startups to growing agencies, teams trust CLIVORA to get work done.",
      link: { label: "See our story", href: "/about" },
      logos: [
        "Nexora Labs",
        "BrightPath Co",
        "Orbit Studio",
        "Cedar & Co",
        "PixelCraft",
        "Northline",
        "Helix Soft",
        "Summit Digital",
      ],
    },
    metrics: [
      { value: "260+", label: "Active Clients" },
      { value: "140+", label: "Jobs Posted" },
      { value: "94%", label: "Client Satisfaction" },
      { value: "99.5%", label: "Uptime & Reliability" },
      { value: "24/7", label: "Email Support" },
    ],
  },

  connect: {
    headline: ["Hire top talent.", "Get hired for great work."],
    body: "A private network to connect, collaborate, and grow together. Zero platform fees on negotiated rates. Total privacy. Built for professionals.",
    features: [
      {
        title: "100% Private",
        description: "Contact only after mutual approval.",
      },
      {
        title: "No Platform Fees",
        description: "Keep more of what you earn.",
      },
      {
        title: "Pro Tools",
        description: "CRM after you connect.",
      },
    ],
    primaryCta: { label: "I want to hire", href: "/signup?role=client&next=/connect" },
    secondaryCta: { label: "I want to get hired", href: "/signup?role=freelancer&next=/connect" },
    ribbon: [
      { value: "36+", label: "Active jobs" },
      { value: "420+", label: "Freelancers" },
      { value: "94%", label: "Success rate" },
      { value: "22+", label: "Countries" },
      { value: "680+", label: "Projects done" },
    ],
    categories: [
      { title: "Web Development", jobs: "28+ jobs", tone: "green" as const },
      { title: "Mobile Apps", jobs: "18+ jobs", tone: "violet" as const },
      { title: "Design & Creative", jobs: "22+ jobs", tone: "orange" as const },
      { title: "AI & Machine Learning", jobs: "8+ jobs", tone: "blue" as const },
      { title: "Writing & Content", jobs: "14+ jobs", tone: "green" as const },
      { title: "Marketing", jobs: "12+ jobs", tone: "violet" as const },
      { title: "Video & Animation", jobs: "6+ jobs", tone: "orange" as const },
      { title: "Business", jobs: "10+ jobs", tone: "blue" as const },
    ],
  },

  workspace: {
    headline: ["Your Freelance", "Business Operating System."],
    body: "CLIVORA gives freelancers everything they need to manage clients, projects, payments, and growth — all in one place.",
    cta: { label: "Explore Freelancer Workspace", href: "/for-freelancers" },
    features: [
      { title: "Project Management", description: "Plan and deliver projects." },
      { title: "Invoicing & Payments", description: "Create invoices and track earnings." },
      { title: "Time Tracking", description: "Track billable hours." },
      { title: "Client Communication", description: "Chat and share files." },
      { title: "CRM & Clients", description: "Manage leads and build relationships." },
      { title: "AI Assistant", description: "Write proposals and contracts." },
      { title: "Contracts & Docs", description: "Create and e-sign contracts." },
      { title: "Analytics & Reports", description: "Get business growth insights." },
    ],
    workflow: {
      title: "Your Workflow. Simplified.",
      steps: [
        { title: "Find Client", description: "Discover opportunities." },
        { title: "Send Proposal", description: "Create & send proposals." },
        { title: "Get Hired", description: "Client accepts proposal." },
        { title: "Work & Collaborate", description: "Complete project tasks." },
        { title: "Send Invoice", description: "Bill for your work." },
        { title: "Get Paid", description: "Receive payments." },
        { title: "Grow Business", description: "Build long-term success." },
      ],
    },
  },

  pricingPage: {
    badge: "Simple, transparent pricing",
    headline: "Start free. Upgrade when you grow.",
    body: site.pricing.earlyAccessNote,
    plans: [
      {
        id: "free",
        name: "Free",
        price: "$0",
        period: "/month",
        description: "Everything you need to start managing your freelance business.",
        cta: { label: "Get Started Free", href: "/signup" },
        highlighted: false,
        features: [
          `Up to ${site.freeLimits.clients} clients`,
          `Up to ${site.freeLimits.projects} projects`,
          `${site.freeLimits.invoicesPerMonth} invoices per month`,
          `Up to ${site.freeLimits.templates} smart templates`,
          `${site.freeLimits.fileVaultMb} MB File Vault`,
          "Tasks, expenses & notes",
          "Calendar & follow-up alerts",
          "Financial reports & PDF invoices",
          "CLIVORA AI insights",
          "Web + Android sync",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: site.pricing.proMonthlyLabel,
        listPrice: site.pricing.proListLabel,
        period: "/month",
        description: "Unlimited tools for freelancers ready to scale.",
        cta: { label: "Upgrade to Pro", href: "/pro" },
        highlighted: true,
        features: [
          "Unlimited clients & projects",
          "Unlimited invoices & tasks",
          "Unlimited smart templates",
          "Client contracts & tracking",
          "Business workflows & automations",
          `${site.proLimits.fileVaultGb} GB File Vault`,
          "Invoice branding & PDF export",
          "Project time tracking",
          "Priority email support",
          "All future Pro features",
        ],
      },
      {
        id: "pro-plus",
        name: "Pro Plus",
        price: site.pricing.proPlusMonthlyLabel,
        listPrice: site.pricing.proPlusListLabel,
        period: "/month",
        description: "Unlimited Connect, AI tools, and team collaboration.",
        cta: { label: "Get Pro Plus", href: "/pro" },
        highlighted: false,
        badge: "Best for growth",
        features: [
          "Everything in Pro",
          "Unlimited Connect credits",
          "AI proposal & contract writer",
          "Team seats & collaboration",
          `${site.proPlusLimits.fileVaultGb} GB File Vault`,
          "Advanced analytics & reports",
          "Priority marketplace visibility",
          "Dedicated onboarding",
        ],
      },
    ],
    note: site.pricing.billingNote,
  },

  featuresPage: {
    badge: "Product capabilities",
    headline: "Every tool. One Freelancer OS.",
    body: "From first lead to final payment — CLIVORA replaces the patchwork of apps freelancers and clients juggle every day.",
    groups: [
      {
        title: "Core business OS",
        items: [
          {
            title: "Business Command Center",
            description:
              "Paid revenue, outstanding amounts, active projects, and onboarding checklist — your morning snapshot in seconds.",
          },
          {
            title: "Client CRM",
            description:
              "Business name, contact, email, phone, WhatsApp, address, and notes. Search and manage your entire client base.",
          },
          {
            title: "Projects & Time Tracking",
            description:
              "Budgets, deadlines, status filters, and a built-in project timer. Track hours and earned revenue per project.",
          },
          {
            title: "Professional Invoicing",
            description:
              "Tax, discounts, draft/sent/paid/overdue workflow. Link invoices to clients and projects effortlessly.",
          },
        ],
      },
      {
        title: "Connect & growth",
        items: [
          {
            title: "CLIVORA Connect",
            description:
              "Private marketplace to find work and hire talent. Contact stays private until mutual accept. $0 platform fees on your deals.",
          },
          {
            title: "Proposals",
            description:
              "Send polished proposals, track status, and convert wins into projects without leaving CLIVORA.",
          },
          {
            title: "Messages",
            description: "Real-time chat with clients or freelancers, tied to projects and jobs.",
          },
          {
            title: "Reviews & reputation",
            description: "Build trust with verified reviews after completed work.",
          },
        ],
      },
      {
        title: "Money & documents",
        items: [
          {
            title: "Payments Hub",
            description: "Track payments, payouts, escrow, and outstanding balances in one place.",
          },
          {
            title: "Contracts & Documents",
            description: "Create, store, and manage contracts alongside your projects.",
          },
          {
            title: "Expenses & reports",
            description: "Log expenses and export financial reports for tax season.",
          },
          {
            title: "File Vault",
            description: "Secure cloud storage for briefs, deliverables, and client files.",
          },
        ],
      },
      {
        title: "Intelligence & platforms",
        items: [
          {
            title: "CLIVORA AI",
            description: "Draft proposals, contracts, replies, and invoices with AI assistance.",
          },
          {
            title: "Analytics",
            description: "Earnings trends, utilization, and growth insights for freelancers and teams.",
          },
          {
            title: "Web + Android",
            description: "One account across clivora.codcrafters.org and the Android app — cloud-first sync.",
          },
          {
            title: "Team collaboration",
            description: "Invite teammates, assign work, and grow beyond solo freelancing with Pro Plus.",
          },
        ],
      },
    ],
  },

  forFreelancers: {
    badge: "FREELANCER PORTAL",
    headline: "Run your freelance business like a pro.",
    body: "Dashboard, CRM, projects, invoices, Connect jobs, time tracking, and AI — purpose-built for freelancers who want one OS, not ten tabs.",
    cta: { label: "Start as Freelancer", href: "/signup?role=freelancer" },
    secondaryCta: { label: "See pricing", href: "/pricing" },
  },

  forClients: {
    badge: "CLIENT PORTAL",
    headline: "Hire talent. Manage projects. Pay with confidence.",
    body: "Post jobs, review proposals, track active work, hold escrow, and collaborate with freelancers — all inside CLIVORA.",
    cta: { label: "Start as Client", href: "/signup?role=client" },
    secondaryCta: { label: "Browse Connect", href: "/connect" },
  },

  faq: [
    {
      q: "Is CLIVORA free to start?",
      a: `Yes. Start on the Free plan with up to ${site.freeLimits.clients} clients and ${site.freeLimits.projects} projects. Upgrade to Pro (${site.pricing.proMonthlyLabel}/mo) or Pro Plus (${site.pricing.proPlusMonthlyLabel}/mo) when you need unlimited tools and Connect.`,
    },
    {
      q: "What is CLIVORA Connect?",
      a: "Connect is our private marketplace to find work and hire talent. Browse free; contact stays private until both sides accept. Negotiated rates have $0 platform fees.",
    },
    {
      q: "Does it work on web and Android?",
      a: "Yes. Use the full web app at clivora.codcrafters.org and the Android app with the same account. Data syncs in the cloud.",
    },
    {
      q: "Can clients and freelancers both use CLIVORA?",
      a: "Absolutely. Freelancers get a business OS; clients get a portal to post jobs, manage projects, and pay. Role-aware UI keeps each experience clear.",
    },
    {
      q: "How do Pro and Pro Plus billing work?",
      a: site.pricing.billingNote,
    },
    {
      q: "Is my data secure?",
      a: "We use enterprise-grade cloud infrastructure with authenticated access, role-based permissions, and documented privacy / data-safety policies.",
    },
  ],

  cta: {
    headline: "Ready to run your freelance business on one OS?",
    body: "Join freelancers and clients who manage work, money, and growth inside CLIVORA.",
    primary: { label: "Get Started Free", href: "/signup" },
    secondary: { label: "Explore documentation", href: "/docs" },
  },

  footer: {
    blurb:
      "The all-in-one Freelancer OS — Connect marketplace, CRM, projects, invoices, and payments. Web and Android.",
    columns: {
      Product: [
        { label: "Features", href: "/features" },
        { label: "Connect", href: "/connect" },
        { label: "Pricing", href: "/pricing" },
        { label: "Pro Plans", href: "/pro" },
        { label: "Documentation", href: "/docs" },
        { label: "Sign in", href: "/login" },
      ],
      Solutions: [
        { label: "For Freelancers", href: "/for-freelancers" },
        { label: "For Clients", href: "/for-clients" },
        { label: "Marketplace", href: "/connect" },
        { label: "FAQ", href: "/#faq" },
      ],
      Company: [
        { label: "About CODCrafters", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Support", href: "/support" },
      ],
      Legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Data Safety", href: "/data-safety" },
        { label: "Delete Account", href: "/delete-account" },
      ],
    },
  },
} as const;

export type MarketingConfig = typeof marketing;

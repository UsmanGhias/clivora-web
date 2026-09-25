import { site } from "@/lib/site";

/**
 * Single source of truth for marketing site copy, navigation, and section data.
 * Edit this file to reconfigure the public website without touching components.
 */
export const marketing = {
  brand: {
    name: site.name,
    productLine: "FREELANCER OS",
    badge: "Complete business OS · Web + Android",
    tagline: "Hire, deliver, and invoice - without marketplace fees.",
    description: site.description,
  },

  nav: {
    links: [
      {
        label: "Jobs",
        href: "/jobs",
        badge: "Remote",
      },
      {
        label: "Freelancers",
        href: "/for-freelancers",
        children: [
          { label: "Freelancer OS Overview", href: "/for-freelancers" },
          { label: "Remote Jobs Board", href: "/jobs" },
          { label: "Connect Direct Hiring", href: "/connect?tab=jobs" },
          { label: "Free Tools & Calculators", href: "/tools" },
        ],
      },
      {
        label: "Clients",
        href: "/for-clients",
        children: [
          { label: "Client Portal Overview", href: "/for-clients" },
          { label: "Hire Verified Talent", href: "/connect?tab=talent" },
          { label: "Post a Remote Job (Free)", href: "/app/connect/manage" },
          { label: "Instant AI SOW Generator", href: "/start-a-project" },
        ],
      },
      {
        label: "Compare",
        href: "/compare",
        children: [
          { label: "Comparison Overview", href: "/compare" },
          { label: "Clivora vs Upwork", href: "/compare/upwork" },
          { label: "Clivora vs Fiverr", href: "/compare/fiverr" },
          { label: "Clivora vs Contra", href: "/compare/contra" },
          { label: "Clivora vs Hello Bonsai", href: "/compare/bonsai" },
        ],
      },
      {
        label: "Resources",
        href: "/docs",
        children: [
          { label: "Documentation", href: "/docs" },
          { label: "Features Overview", href: "/features" },
          { label: "Free Tools & Calculators", href: "/tools" },
          { label: "Trust & Safety", href: "/trust" },
          { label: "Security Architecture", href: "/security" },
          { label: "Plans & Pricing ($0 Fee)", href: "/pricing" },
          { label: "Community Blog", href: "https://community.clivora.io/blog", external: true },
          { label: "Services & Agency", href: "https://codcrafters.org", external: true },
          { label: "Support & Contact", href: "/contact" },
        ],
      },
    ],
    cta: { label: "Open free workspace", href: "/signup" },
    login: { label: "Login", href: "/login" },
    locale: "EN",
  },

  hero: {
    badge: "FOUNDER LAUNCH · 100% FREE ACCESS & $0 DEAL FEES",
    headline: ["Stop losing 10-20%", "to marketplace fees."],
    body:
      "Clivora is a complete Freelancer OS for freelancers and clients worldwide: private Connect hiring, real-time verified remote jobs, CRM, projects, timesheets, and milestone invoices. Platform fees stay $0 with 100% free access during Founder Launch. Clients pay you directly with zero cuts. One unified account for web and Android.",
    primaryCta: { label: "I'm a Freelancer", href: "/signup?role=freelancer" },
    secondaryCta: { label: "I'm hiring", href: "/signup?role=client" },
    trusts: [
      "$0 Connect platform fee",
      "Invoice clients directly",
      "One account · web + Android",
    ],
    socialLine:
      "Join freelancers and clients already moving off fee-heavy marketplaces into one workspace.",
  },

  traction: {
    line: "Built for the full freelance loop: hire, deliver, and invoice with 0% platform cuts on your deals.",
    stats: [
      { value: "Thousands", label: "Active Remote Jobs" },
      { value: "$0", label: "Deal platform fee" },
      { value: "100%", label: "Direct client payouts" },
      { value: "Direct", label: "Milestones & safety" },
    ],
  },

  trustBar: {
    title: "Built for freelancers and clients who already run real businesses.",
    logos: [
      "Independent studios",
      "Remote teams",
      "Solo freelancers",
      "Startup founders",
      "Agency operators",
      "Product designers",
      "Developers",
      "Consultants",
    ],
  },

  dualPortal: {
    badge: "TWO PORTALS · ONE ACCOUNT",
    headline: ["Freelancer desk.", "Client desk."],
    body: "Same product, different home screens. Freelancers run CRM and money. Clients post needs, review talent, and track shared projects - without another SaaS login.",
    tabs: [
      { id: "freelancer" as const, label: "For Freelancers" },
      { id: "client" as const, label: "For Clients" },
    ],
    sideFeatures: {
      left: [
        {
          title: "Morning money view",
          description: "Paid invoices, open balances, and active projects before your first coffee.",
          tone: "violet" as const,
        },
        {
          title: "Projects with real rates",
          description: "Fixed or hourly budgets. Timer uses the client-approved rate - not a made-up number.",
          tone: "green" as const,
        },
        {
          title: "Invoices that match the work",
          description: "Draft → sent → paid. Clients pay you directly on the terms you put on the invoice.",
          tone: "orange" as const,
        },
      ],
      right: [
        {
          title: "Messages that stick",
          description: "Threads per contact from Connect matches and CRM emails - not a separate chat app.",
          tone: "blue" as const,
        },
        {
          title: "Connect hiring",
          description: "Post a need or apply with cover letter + bid. Contact stays hidden until accept.",
          tone: "violet" as const,
        },
        {
          title: "Ask AI on your CRM",
          description: "Answers from your invoices and projects when keys are set - or honest offline tips.",
          tone: "teal" as const,
        },
      ],
    },
    bottomStrip: [
      "Analytics",
      "Expenses",
      "Contracts",
      "Timesheets",
      "Meetings",
      "File vault",
    ],
    socialProof: "Shipped by CODCrafters. Used by independent professionals worldwide.",
    activeUsers: "Built for freelancers and clients worldwide",
  },

  freelancerOs: {
    headline: "The desk you open when a client says “send the invoice tonight.”",
    body: "Clients, projects, proposals, invoices, and tracked hours in one workspace - so you are not copying numbers between chat apps, spreadsheets, and a third tool at 11pm.",
    cta: { label: "See the full toolkit", href: "/features" },
    features: [
      {
        title: "Dashboard that tells the truth",
        description: "Revenue and pending from your invoices - not vanity “success score” widgets.",
      },
      {
        title: "Kanban + CRM projects",
        description: "Drag status on mobile-wide columns. Budget and hourly type live on the project.",
      },
      {
        title: "Invoicing",
        description: "Create, send, mark paid. Clients settle you directly - no marketplace cut on the deal.",
      },
      {
        title: "Timesheets",
        description: "Live timer tied to approved hourly rates. Empty state if the client never set one.",
      },
      {
        title: "Client records",
        description: "Emails, phones, notes, and custom fields that save to your CRM - not a fake form.",
      },
      {
        title: "Ask AI",
        description: "Ask about plans, Connect, overdue invoices, or Android vs web - grounded in your data.",
      },
    ],
    stats: [
      { value: "100%", label: "Free Full Access" },
      { value: "$0", label: "Connect deal fee" },
      { value: "Live Feed", label: "Verified Remote Jobs" },
      { value: "100%", label: "Earnings you keep" },
      { value: "Global", label: "freelancers & clients" },
      { value: "2", label: "platforms · web+app" },
    ],
  },

  socialProof: {
    badge: "WHY PEOPLE CHOOSE CLIVORA",
    headline: ["Private hiring.", "Direct invoicing."],
    body: "CLIVORA is a practical operating system built for real freelance businesses: Connect with private contact release on mutual accept, invoices paid directly to you, and offline-first cloud synchronization.",
    features: [
      {
        title: "Talent you can verify",
        description: "Connect cards show rate, skills, and ratings from real reviews - load more as the list grows.",
        tone: "violet" as const,
      },
      {
        title: "Privacy by default",
        description: "Emails reveal only after mutual accept. Decline and the other side never gets your inbox.",
        tone: "teal" as const,
      },
      {
        title: "Proposal → project → invoice",
        description: "Win a Connect job, keep the thread, open the project, bill from the same workspace.",
        tone: "orange" as const,
      },
      {
        title: "Ratings from finished work",
        description: "Reviews attach after delivery - we do not invent stars on empty profiles.",
        tone: "blue" as const,
      },
      {
        title: "Works across time zones",
        description: "Morning standups, afternoon client calls, overnight handoffs - one login on phone and laptop.",
        tone: "violet" as const,
      },
      {
        title: "Grow past one-off gigs",
        description: "CRM + analytics for retainers and repeat clients, not only marketplace one-shots.",
        tone: "green" as const,
      },
    ],
    floatingStats: [
      { value: "$0", label: "Platform fee", hint: "On negotiated Connect deals" },
      { value: "Mutual", label: "Accept to reveal email", hint: "No cold contact spam" },
      { value: "Direct", label: "Client → freelancer pay", hint: "Via your invoice terms" },
      { value: "1 login", label: "Web & Android", hint: "Same business everywhere" },
    ],
    trustedBy: {
      title: "FROM REAL CLIENT DELIVERY TO YOUR FREELANCE DESK",
      body: "We built CLIVORA while shipping real projects - the product mirrors how freelancers and clients already want to work together.",
      link: { label: "About CODCrafters", href: "/about" },
      logos: [
        "CODCrafters",
        "Play Store app",
        "Next.js web",
        "Flutter Android",
        "Connect marketplace",
        "CRM workspace",
        "Invoicing",
        "Timesheets",
      ],
    },
    metrics: [
      { value: "Free→Pro", label: "Clear plan ladder" },
      { value: "Connect", label: "Jobs · talent · inbox" },
      { value: "Honest UI", label: "No fake Connected" },
      { value: "Email", label: "Support from the builder" },
      { value: "Docs", label: "Product guides" },
    ],
  },

  connect: {
    headline: ["Hire without buying leads.", "Get hired without selling your rate."],
    body: "Connect is a private board: clients post needs, freelancers apply with cover letter and bid, inbox shows accept/decline. Zero CLIVORA cut on the fee you negotiate - then invoice and get paid directly.",
    features: [
      {
        title: "Private contact",
        description: "Email appears only after both sides accept.",
      },
      {
        title: "$0 platform fee",
        description: "Keep the rate you agree - no marketplace tax.",
      },
      {
        title: "CRM after match",
        description: "Turn the hire into a project, tasks, and invoices.",
      },
    ],
    primaryCta: { label: "I want to hire", href: "/signup?role=client&next=/connect" },
    secondaryCta: { label: "I want work", href: "/signup?role=freelancer&next=/connect" },
    ribbon: [
      { value: "Jobs", label: "Feed + filters" },
      { value: "Talent", label: "Paginated cards" },
      { value: "Inbox", label: "Accept / decline" },
      { value: "$0", label: "Deal fee" },
      { value: "Pro+", label: "Credits & listing" },
    ],
    categories: [
      { title: "Web Development", jobs: "Open roles", tone: "green" as const },
      { title: "Mobile Apps", jobs: "Flutter & native", tone: "violet" as const },
      { title: "Design & Creative", jobs: "Brand & UI", tone: "orange" as const },
      { title: "AI & Automation", jobs: "Agents & pipelines", tone: "blue" as const },
      { title: "Writing & Content", jobs: "Briefs & SEO", tone: "green" as const },
      { title: "Marketing", jobs: "Campaigns", tone: "violet" as const },
      { title: "Video", jobs: "Edit & motion", tone: "orange" as const },
      { title: "Business ops", jobs: "Ops & VA", tone: "blue" as const },
    ],
  },

  workspace: {
    headline: ["Your freelance", "operating desk."],
    body: "Open /app after signup: projects, clients, invoices, timesheets, messages, meetings. Upgrade only when Connect credits or unlimited CRM limits matter.",
    cta: { label: "Tour freelancer workspace", href: "/for-freelancers" },
    features: [
      { title: "Projects", description: "Pipeline + kanban status." },
      { title: "Invoices", description: "Bill clients directly." },
      { title: "Timesheets", description: "Approved hourly rates." },
      { title: "Messages", description: "Compact threads." },
      { title: "Clients CRM", description: "Custom fields that save." },
      { title: "Ask AI", description: "CRM + product FAQ." },
      { title: "Contracts", description: "Clean body, no meta dump." },
      { title: "Meetings", description: "Instant video rooms." },
    ],
    workflow: {
      title: "How a typical week looks",
      steps: [
        { title: "Browse Connect", description: "Jobs or talent." },
        { title: "Send proposal", description: "Cover letter + bid." },
        { title: "Mutual accept", description: "Emails reveal." },
        { title: "Share project", description: "Budget / hourly rate." },
        { title: "Track time", description: "Timer uses that rate." },
        { title: "Invoice", description: "Client pays you directly." },
        { title: "Repeat", description: "Keep the CRM." },
      ],
    },
  },


  compare: {
    badge: "MARKETPLACE COMPARISON",
    headline: "How CLIVORA differs from fee-heavy marketplaces",
    body: "Most platforms charge freelancers, clients, or both - then still leave you juggling CRM and invoices elsewhere. CLIVORA connects hiring with a full business OS and $0 deal fees.",
    columns: ["CLIVORA", "Upwork", "Fiverr", "Freelancer.com"],
    rows: [
      {
        feature: "Platform fee on negotiated deals",
        values: ["$0", "Service fee on freelancers", "Seller fees + extras", "Bid + milestone fees"],
      },
      {
        feature: "Who pays the middleman",
        values: [
          "Neither side on the deal",
          "Both sides: client marketplace/initiation fees; freelancer service fee varies by contract",
          "Sellers (+ buyer extras)",
          "Both via fees/bids",
        ],
      },
      {
        feature: "Contact privacy",
        values: ["Mutual accept first", "After hire / rules vary", "After order", "After award"],
      },
      {
        feature: "CRM + projects + invoices",
        values: ["Built-in Freelancer OS", "Limited / add-ons", "Order-centric", "Project tools vary"],
      },
      {
        feature: "Web + mobile same account",
        values: ["Yes", "Yes (marketplace)", "Yes (marketplace)", "Yes (marketplace)"],
      },
      {
        feature: "Client pays freelancer",
        values: ["Directly on your invoice", "Through platform", "Through platform", "Through platform"],
      },
      {
        feature: "Best for",
        values: [
          "Running a freelance business end-to-end",
          "Large open marketplace",
          "Gig catalog & packages",
          "Competitive bidding",
        ],
      },
    ],
    cta: { label: "Start free on CLIVORA", href: "/signup" },
    secondaryCta: { label: "Open Connect", href: "/connect" },
  },

  pricingPage: {
    badge: "FOUNDER LAUNCH · 100% FREE FOR 1 YEAR",
    headline: "1 Year Pro Plus Included Free. $0 Fees Forever.",
    body: "To celebrate our global launch, all registered freelancers and clients receive 1 full year of CLIVORA Pro Plus completely free. Manage unlimited clients, send unlimited invoices, and keep 100% of your earnings.",
    plans: [
      {
        id: "free",
        name: "Standard",
        price: "$0",
        period: "/forever",
        description: "Essential tools to manage your freelance clients and projects.",
        cta: { label: "Open Free Workspace", href: "/signup" },
        highlighted: false,
        features: [
          "3 clients & 5 active projects",
          "10 invoices per month",
          "100 MB secure file vault",
          "Direct client messaging",
          "Milestone contract verification",
          "PDF invoices & receipts",
          "Web + Android sync",
        ],
      },
      {
        id: "founder-pro",
        name: "Founder Pro Plus",
        price: "$0",
        listPrice: "$0 Free",
        period: "100% Free Forever",
        badge: "Founder Launch Gift",
        description: "Full unlimited power for scaling freelancers, agencies, and clients.",
        cta: { label: "Claim Free Access", href: "/signup" },
        highlighted: true,
        features: [
          "Full Founder Access Included ($0 Cost)",
          "Unlimited clients & projects",
          "Unlimited invoices & smart templates",
          "Unlimited Connect marketplace applications",
          "Client contracts & e-signatures",
          "Ask AI proposal & contract generator",
          "50 GB Secure File Vault lake",
          "0% platform commission on all earnings",
          "Dedicated priority support",
        ],
      },
      {
        id: "enterprise",
        name: "Team / Agency",
        price: "$0",
        listPrice: "$0 Free",
        period: "100% Free Forever",
        description: "Multi-seat workspace for agency teams and high-volume clients.",
        cta: { label: "Open Team Workspace", href: "/signup" },
        highlighted: false,
        features: [
          "Everything in Pro Plus",
          "Multiple team seats & role permissions",
          "Client CRM portal & white-label billing",
          "Automated accounting exports (Odoo)",
          "Priority marketplace directory placement",
          "VIP onboarding & dedicated engineer",
        ],
      },
    ],
    note: "100% free founder grant applied automatically to all new accounts. No credit card required.",
  },

  featuresPage: {
    badge: "Product capabilities",
    headline: "Every tool. One Freelancer OS.",
    body: "From first lead to final payment - CLIVORA replaces the patchwork of apps freelancers and clients juggle every day.",
    groups: [
      {
        title: "Core business OS",
        items: [
          {
            title: "Business Command Center",
            description:
              "Paid revenue, outstanding amounts, active projects, and onboarding checklist - your morning snapshot in seconds.",
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
            description: "Build trust with reviews after eligible completed engagements.",
          },
        ],
      },
      {
        title: "Money & documents",
        items: [
          {
            title: "Payments Hub",
            description: "Track invoices and payment-status records (manual or processor-confirmed) and outstanding balances in one place.",
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
            description: "One account across clivora.io and the Android app - cloud-first sync.",
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
    badge: "Freelancer desk",
    headline: "One operating desk for every client you keep.",
    body: "Stop bouncing between CRM tabs, invoice tools, and marketplace apps. CLIVORA keeps your pipeline, delivery, time, and direct invoices on one account - web and Android.",
    cta: { label: "Start as Freelancer", href: "/signup?role=freelancer" },
    secondaryCta: { label: "Explore Platform", href: "/features" },
  },

  forClients: {
    badge: "Client desk",
    headline: "Hire, track delivery, and settle invoices in one place.",
    body: "Post the brief, review proposals, follow active work, and pay freelancers directly on the invoice - without a marketplace taking a cut of the deal.",
    cta: { label: "Start as Client", href: "/signup?role=client" },
    secondaryCta: { label: "Browse Connect", href: "/connect" },
  },

  faq: [
    {
      q: "Is CLIVORA free to start?",
      a: "Yes. CLIVORA is 100% free with $0 platform fees. All workspace tools, Connect marketplace access, CRM, direct invoices, and time tracking are fully available with zero commission taken from your client payments.",
    },
    {
      q: "What is CLIVORA Connect?",
      a: "Connect is our private marketplace to find work and hire talent. Browse free; contact stays private until both sides accept. Negotiated rates have $0 platform fees.",
    },
    {
      q: "Does it work on web and Android?",
      a: "Yes. Use the full web app at clivora.io and the Android app with the same account. Data syncs in the cloud.",
    },
    {
      q: "Can clients and freelancers both use CLIVORA?",
      a: "Absolutely. Freelancers get a business OS; clients get a portal to post jobs, manage projects, and pay. Role-aware UI keeps each experience clear.",
    },
    {
      q: "How is CLIVORA different from Upwork or Fiverr?",
      a: "Those marketplaces take fees from freelancers and often add cost for clients, then still leave CRM and invoicing elsewhere. CLIVORA keeps $0 platform fee on negotiated Connect deals, lets clients pay freelancers directly on invoices, and includes CRM, projects, and timesheets in one account. See /compare.",
    },
    {
      q: "Are there any hidden marketplace fees?",
      a: "No. CLIVORA keeps a $0 platform fee on negotiated Connect deals. Clients pay freelancers directly against their invoice with zero middleman deductions.",
    },
    {
      q: "Is my data secure?",
      a: "We use enterprise-grade cloud infrastructure with authenticated access, role-based permissions, and documented privacy / data-safety policies.",
    },
  ],

  cta: {
    headline: "Open your CLIVORA workspace before the next deal slips into five tabs.",
    body: "Same signup for freelancers and clients. Private Connect until mutual accept. Direct invoices and zero middleman deductions.",
    primary: { label: "Create free account", href: "/signup" },
    secondary: { label: "Read the docs", href: "/docs" },
  },

  footer: {
    blurb:
      "CLIVORA by CODCrafters: private Connect, CRM, invoices, timesheets for freelancers and clients worldwide. Web + Android. $0 platform fee on negotiated deals.",
    columns: {
      Product: [
        { label: "Features", href: "/features" },
        { label: "Free Tools Directory", href: "/tools" },
        { label: "Rate Calculator", href: "/tools/freelance-rate-calculator" },
        { label: "Upwork Fee Calculator", href: "/tools/upwork-fee-calculator" },
        { label: "Invoice Generator", href: "/tools/invoice-generator" },
        { label: "Connect", href: "/connect" },
        { label: "Documentation", href: "/docs" },
        { label: "Sign in", href: "/login" },
      ],
      Solutions: [
        { label: "For Freelancers", href: "/for-freelancers" },
        { label: "For Clients", href: "/for-clients" },
        { label: "Clivora vs Upwork", href: "/compare/upwork" },
        { label: "Clivora vs Fiverr", href: "/compare/fiverr" },
        { label: "Clivora vs Contra", href: "/compare/contra" },
        { label: "Clivora vs Bonsai", href: "/compare/bonsai" },
        { label: "Trust & Payments", href: "/trust" },
        { label: "Security Architecture", href: "/security" },
        { label: "Integrations", href: "/integrations" },
      ],
      Company: [
        { label: "About CODCrafters", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Support", href: "/support" },
        { label: "Architecture Studio", href: "https://arch.clivora.io" },
        { label: "Code Studio", href: "https://play.clivora.io" },
        { label: "Developer DevTools", href: "https://tools.clivora.io" },
        { label: "Community", href: "https://community.clivora.io" },
      ],
      Legal: [
        { label: "Trust & Safety Standards", href: "/trust" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "HTML Sitemap", href: "/sitemap" },
        { label: "Data Safety", href: "/data-safety" },
        { label: "Delete Account", href: "/delete-account" },
      ],
    },
  },
} as const;

export type MarketingConfig = typeof marketing;

export const siteUrl = process.env.VITE_SITE_URL || "https://innoviaburst.com";

export const staticRoutes = [
  { path: "/", source: "src/pages/Index.tsx", changefreq: "weekly", priority: 1.0 },
  { path: "/automations", source: "src/pages/AutomationsPage.tsx", changefreq: "weekly", priority: 0.9 },
  { path: "/resources", source: "src/pages/ResourcesPage.tsx", changefreq: "weekly", priority: 0.85 },
  { path: "/industries", source: "src/pages/IndustriesPage.tsx", changefreq: "monthly", priority: 0.6 },
  { path: "/trust", source: "src/pages/TrustPage.tsx", changefreq: "monthly", priority: 0.8 },
  { path: "/subprocessors", source: "src/pages/SubprocessorsPage.tsx", changefreq: "monthly", priority: 0.6 },
  { path: "/privacy", source: "src/pages/PrivacyPage.tsx", changefreq: "yearly", priority: 0.4 },
  { path: "/cookies", source: "src/pages/CookiesPage.tsx", changefreq: "yearly", priority: 0.4 },
  { path: "/terms", source: "src/pages/TermsPage.tsx", changefreq: "yearly", priority: 0.4 },
  { path: "/works", source: "src/pages/WorkPage.tsx", changefreq: "monthly", priority: 0.7 },
  { path: "/work", source: "src/pages/ComingSoonPage.tsx", changefreq: "monthly", priority: 0.3 },
  { path: "/coming-soon", source: "src/pages/ComingSoonPage.tsx", changefreq: "monthly", priority: 0.3 },
];

export const offers = [
  { slug: "ai-ops-sprint", title: "AI Ops Sprint", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
  { slug: "automation-build", title: "Automation Build", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
  { slug: "mvp-launch", title: "MVP Launch", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
];

export const caseStudies = [
  { slug: "professional-services-client-onboarding", title: "Professional Services — Client Onboarding", source: "src/pages/CaseStudyPage.tsx", changefreq: "monthly", priority: 0.7 },
  { slug: "saas-support-ticket-triage", title: "B2B SaaS — Support Ticket Triage", source: "src/pages/CaseStudyPage.tsx", changefreq: "monthly", priority: 0.7 },
];

const toPath = (entry) => ({
  path: entry.path,
  source: entry.source,
  changefreq: entry.changefreq,
  priority: entry.priority,
});

export const allRoutes = [
  ...staticRoutes.map(toPath),
  ...offers.map((offer) => ({
    path: `/${offer.slug}`,
    source: offer.source,
    changefreq: offer.changefreq,
    priority: offer.priority,
  })),
  ...caseStudies.map((study) => ({
    path: `/work/${study.slug}`,
    source: study.source,
    changefreq: study.changefreq,
    priority: study.priority,
  })),
];

export const buildUrl = (path = "/") => `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

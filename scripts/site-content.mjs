export const siteUrl = process.env.VITE_SITE_URL || "https://innoviaburst.com";

// Locale routing — mirror of src/lib/i18n-routing.ts (kept in sync manually
// because Node runs this .mjs directly and can't import the .ts module).
// Phase 5: `en` (default) + `fr`.
export const LOCALES = ["en", "fr"];
export const DEFAULT_LOCALE = "en";

export const localizedPath = (locale, flatPath = "/") => {
  const clean = `/${String(flatPath).replace(/^\/+/, "")}`;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
};

export const offers = [
  { slug: "ai-ops-sprint", title: "AI Ops Sprint", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
  { slug: "automation-build", title: "Automation Build", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
  { slug: "mvp-launch", title: "MVP Launch", source: "src/pages/OfferPage.tsx", changefreq: "monthly", priority: 0.75 },
];

export const caseStudies = [
  { slug: "professional-services-client-onboarding", title: "Professional Services — Client Onboarding", source: "src/pages/CaseStudyPage.tsx", changefreq: "monthly", priority: 0.7 },
  { slug: "saas-support-ticket-triage", title: "B2B SaaS — Support Ticket Triage", source: "src/pages/CaseStudyPage.tsx", changefreq: "monthly", priority: 0.7 },
];

// Canonical flat (locale-less) routes that are pre-rendered for every locale.
// `/work` is intentionally absent — it 301-redirects to `/works`.
export const flatRoutes = [
  { path: "/", source: "src/pages/Index.tsx", changefreq: "weekly", priority: 1.0 },
  { path: "/about", source: "src/pages/AboutPage.tsx", changefreq: "monthly", priority: 0.6 },
  { path: "/automations", source: "src/pages/AutomationsPage.tsx", changefreq: "weekly", priority: 0.9 },
  { path: "/resources", source: "src/pages/ResourcesPage.tsx", changefreq: "weekly", priority: 0.85 },
  { path: "/industries", source: "src/pages/IndustriesPage.tsx", changefreq: "monthly", priority: 0.6 },
  { path: "/trust", source: "src/pages/TrustPage.tsx", changefreq: "monthly", priority: 0.8 },
  { path: "/subprocessors", source: "src/pages/SubprocessorsPage.tsx", changefreq: "monthly", priority: 0.6 },
  { path: "/privacy", source: "src/pages/PrivacyPage.tsx", changefreq: "yearly", priority: 0.4 },
  { path: "/cookies", source: "src/pages/CookiesPage.tsx", changefreq: "yearly", priority: 0.4 },
  { path: "/terms", source: "src/pages/TermsPage.tsx", changefreq: "yearly", priority: 0.4 },
  // Coming-soon listing — noindex (out of sitemap) until real cases exist, but
  // still 301s legacy flat /works -> /en/works (not a newRoute).
  { path: "/works", source: "src/pages/WorkPage.tsx", changefreq: "monthly", priority: 0.7, noindex: true },
  { path: "/coming-soon", source: "src/pages/ComingSoonPage.tsx", changefreq: "monthly", priority: 0.3 },
  // Campaign landing page — pre-rendered + indexable-ready, but kept OUT of the
  // sitemap (noindex flag) until launch is confirmed. Reached via the /en/ URL.
  { path: "/lp/ai-automation", source: "src/pages/LandingPage.tsx", changefreq: "monthly", priority: 0.5, noindex: true, newRoute: true },
  // Paid-ads MVP landing page — SSG'd for both locales, noindex (out of sitemap),
  // no legacy 301 (newRoute). The robots meta is emitted by SeoHead in the page.
  { path: "/lp/mvp", source: "src/pages/LpMvpPage.tsx", changefreq: "monthly", priority: 0.5, noindex: true, newRoute: true },
  ...offers.map((o) => ({ path: `/${o.slug}`, source: o.source, changefreq: o.changefreq, priority: o.priority })),
  ...caseStudies.map((c) => ({ path: `/work/${c.slug}`, source: c.source, changefreq: c.changefreq, priority: c.priority })),
  // Pre-rendered but noindex — served as the real 404 body (nginx error_page).
  { path: "/404", source: "src/pages/NotFound.tsx", changefreq: "yearly", priority: 0.0, noindex: true, newRoute: true },
];

/** All locale-prefixed URLs to pre-render (SSG). */
export const prerenderUrls = () =>
  LOCALES.flatMap((loc) => flatRoutes.map((r) => localizedPath(loc, r.path)));

/** Sitemap entries with localized loc + metadata for every locale (excludes noindex). */
export const sitemapRoutes = () =>
  LOCALES.flatMap((loc) =>
    flatRoutes
      .filter((r) => !r.noindex)
      .map((r) => ({
        loc: localizedPath(loc, r.path),
        source: r.source,
        changefreq: r.changefreq,
        priority: r.priority,
      })),
  );

/**
 * 301 redirect map: every legacy flat URL -> its default-locale equivalent.
 * Preserves link equity during the locale migration. `/work` consolidates to
 * `/works`. The site root `/` is intentionally EXCLUDED — it is not a static
 * 301 but a per-visitor locale negotiation (see `negotiateLocale` + the
 * `location = /` block in nginx.prod.conf).
 */
export const legacyRedirects = () => {
  const map = {};
  for (const r of flatRoutes) {
    // Skip routes with no legacy flat URL (/404, /lp). noindex routes like /works
    // are LEGACY URLs and must still redirect — so gate on `newRoute`, not noindex.
    if (r.newRoute) continue;
    // `/` is content-negotiated (302), not a permanent 301 to one locale.
    if (r.path === "/") continue;
    map[r.path] = localizedPath(DEFAULT_LOCALE, r.path);
  }
  map["/work"] = localizedPath(DEFAULT_LOCALE, "/works");
  return map;
};

/**
 * Pick the locale for a bare `/` request. Mirrors the nginx map in
 * nginx.prod.conf and negotiateLocale() in src/lib/i18n-routing.ts (which the
 * dev/preview middleware in vite.config.ts uses) so every server agrees:
 *   1. an explicit `locale` cookie (set by the on-site language switcher) wins;
 *   2. otherwise the browser's primary Accept-Language tag (e.g. "fr-FR" -> fr);
 *   3. otherwise DEFAULT_LOCALE.
 */
export const negotiateLocale = (acceptLanguage = "", cookieLocale = "") => {
  const cookie = String(cookieLocale).trim().toLowerCase().slice(0, 2);
  if (LOCALES.includes(cookie)) return cookie;
  const primary = String(acceptLanguage)
    .toLowerCase()
    .split(",")[0]
    .split("-")[0]
    .trim();
  return LOCALES.includes(primary) ? primary : DEFAULT_LOCALE;
};

export const buildUrl = (path = "/") =>
  `${siteUrl.replace(/\/$/, "")}${String(path).startsWith("/") ? path : `/${path}`}`;

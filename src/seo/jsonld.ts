import i18n from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, type Locale } from "@/lib/i18n-routing";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";
const base = siteUrl.replace(/\/$/, "");

/** Stable @id for the sitewide organization entity (referenced across schemas). */
const ORG_ID = `${base}/#organization`;
const WEBSITE_ID = `${base}/#website`;

const currentLocale = (): Locale => {
  const l = (i18n.language || DEFAULT_LOCALE).slice(0, 2);
  return isLocale(l) ? l : DEFAULT_LOCALE;
};

/** Absolute URL for a flat in-app path at the active locale (e.g. /en/trust). */
export const localizedUrl = (flatPath = "/") => `${base}${localizedPath(currentLocale(), flatPath)}`;

/**
 * Localize an absolute site URL to the active locale: `${base}/x` -> `${base}/<loc>/x`.
 * Leaves already-locale-prefixed and off-site URLs untouched. Used to keep
 * breadcrumb/Service schema URLs consistent with the page's /en|/fr canonical.
 */
const localizeAbs = (url: unknown): unknown => {
  if (typeof url !== "string" || !url.startsWith(base)) return url;
  const rest = url.slice(base.length);
  if (/^\/(en|fr)(\/|#|$)/.test(rest)) return url; // already localized
  return `${base}${localizedPath(currentLocale(), rest || "/")}`;
};

export const safeJsonLd = (data: Record<string, unknown> | Record<string, unknown>[]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * Sitewide entity: Organization + ProfessionalService (a subtype), with a stable
 * @id so Services/Breadcrumbs/WebSite can reference it.
 *
 * Only verified data is included. TODO(Phase 7 — GEO/entity consistency): add
 * `legalName`, `foundingDate`, `founder` (Person), and the remaining `sameAs`
 * profiles (Crunchbase, X, GitHub, Clutch) once the user provides real values —
 * do NOT invent these.
 */
export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "Innoviaburst",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${base}/logo.png`,
  },
  image: `${base}/og.jpg`,
  description:
    "GDPR-by-design AI automation, AI copilots and MVPs for UK/EU SMEs — fixed scope, delivered in weeks, with the audit trail built in.",
  email: "hello@innoviaburst.com",
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Place", name: "European Union" },
  ],
  serviceType: ["Workflow automation", "AI copilots", "MVP development"],
  // Verified profiles only (from the site footer). More added in Phase 7.
  sameAs: [
    "https://www.linkedin.com/company/innoviaburst",
    "https://www.instagram.com/innoviaburst/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@innoviaburst.com",
    contactType: "sales",
    areaServed: ["GB", "EU"],
    availableLanguage: ["en", "fr"],
  },
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: siteUrl,
  name: "Innoviaburst",
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
  // No SearchAction/potentialAction: there is no /search endpoint and the
  // Sitelinks Searchbox is deprecated.
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: localizeAbs(item.url),
  })),
});

export const serviceJsonLd = (params: {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
  serviceType?: string[];
  priceCurrency?: string;
  price?: string | number;
  priceRange?: string;
  priceValidUntil?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: params.name,
  description: params.description,
  areaServed: params.areaServed ?? ["GB", "EU"],
  serviceType: params.serviceType ?? ["Workflow automation", "AI copilots", "MVP development"],
  // Reference the sitewide org entity (emitted on the same page) instead of a
  // duplicate inline Organization.
  provider: { "@id": ORG_ID },
  offers: params.price
    ? {
        "@type": "Offer",
        url: localizeAbs(params.url),
        priceCurrency: params.priceCurrency ?? "GBP",
        price: String(params.price),
        priceValidUntil: params.priceValidUntil ?? "2026-12-31",
        availability: "https://schema.org/InStock",
        ...(params.priceRange ? { description: params.priceRange } : {}),
      }
    : undefined,
  url: localizeAbs(params.url),
});

export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export { siteUrl, ORG_ID };

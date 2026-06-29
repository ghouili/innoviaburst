import i18n from "@/i18n";
import { DEFAULT_LOCALE, isLocale, localizedPath, type Locale } from "@/lib/i18n-routing";
import { ORG_FACTS, hasFounder, hasAddress } from "@/seo/org-facts";

const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";
const base = siteUrl.replace(/\/$/, "");

/** Stable @ids for the sitewide entities (referenced across schemas). */
const ORG_ID = `${base}/#organization`;
const WEBSITE_ID = `${base}/#website`;
const FOUNDER_ID = `${base}/#founder`;

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
 * @id so Services/Breadcrumbs/WebSite/Person can reference it.
 *
 * GEO/entity-consistency fields (legalName, foundingDate, founder, address) are
 * driven by src/seo/org-facts.ts and emitted ONLY when the owner has supplied a
 * real value there — nothing is invented. `founder` references the Person node
 * emitted by founderJsonLd() (same @id), so the entity graph stays consistent.
 */
export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: ORG_FACTS.name,
  ...(ORG_FACTS.legalName ? { legalName: ORG_FACTS.legalName } : {}),
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${base}/logo.png`,
  },
  image: `${base}/og.jpg`,
  description:
    "GDPR-by-design AI automation, AI copilots and MVPs for UK/EU SMEs — fixed scope, delivered in weeks, with the audit trail built in.",
  email: "hello@innoviaburst.com",
  ...(ORG_FACTS.foundingDate ? { foundingDate: ORG_FACTS.foundingDate } : {}),
  ...(hasFounder() ? { founder: { "@id": FOUNDER_ID } } : {}),
  ...(hasAddress()
    ? {
        address: {
          "@type": "PostalAddress",
          ...(ORG_FACTS.address.streetAddress ? { streetAddress: ORG_FACTS.address.streetAddress } : {}),
          ...(ORG_FACTS.address.addressLocality ? { addressLocality: ORG_FACTS.address.addressLocality } : {}),
          ...(ORG_FACTS.address.addressRegion ? { addressRegion: ORG_FACTS.address.addressRegion } : {}),
          ...(ORG_FACTS.address.postalCode ? { postalCode: ORG_FACTS.address.postalCode } : {}),
          ...(ORG_FACTS.address.addressCountry ? { addressCountry: ORG_FACTS.address.addressCountry } : {}),
        },
      }
    : {}),
  ...(ORG_FACTS.vatId ? { vatID: ORG_FACTS.vatId } : {}),
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Place", name: "European Union" },
  ],
  serviceType: ["Workflow automation", "AI copilots", "MVP development"],
  // Verified profiles only — driven by org-facts.ts.
  sameAs: ORG_FACTS.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@innoviaburst.com",
    contactType: "sales",
    areaServed: ["GB", "EU"],
    availableLanguage: ["en", "fr"],
  },
});

/**
 * Founder Person node (GEO). Returns null until a real founder name exists in
 * org-facts.ts — so we never emit a placeholder Person. `worksFor` references the
 * org @id; orgJsonLd reciprocates with `founder: { @id }`.
 */
export const founderJsonLd = () => {
  if (!hasFounder()) return null;
  const f = ORG_FACTS.founder;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: f.name,
    ...(f.jobTitle ? { jobTitle: f.jobTitle } : {}),
    worksFor: { "@id": ORG_ID },
    url: `${base}/about`,
    ...(f.sameAs.length ? { sameAs: f.sameAs } : {}),
  };
};

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
  /**
   * Price points, EUR primary then GBP (from src/data/offers.ts). Emitted as a
   * single Offer when one currency, or an array of Offers (EUR + GBP) when both.
   */
  offers?: { priceCurrency: string; price: number; priceRange?: string; priceValidUntil?: string }[];
}) => {
  const offerNodes = (params.offers ?? []).map((o) => ({
    "@type": "Offer",
    url: localizeAbs(params.url),
    priceCurrency: o.priceCurrency,
    price: String(o.price),
    priceValidUntil: o.priceValidUntil ?? "2026-12-31",
    availability: "https://schema.org/InStock",
    ...(o.priceRange ? { description: o.priceRange } : {}),
  }));
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    areaServed: params.areaServed ?? ["GB", "EU"],
    serviceType: params.serviceType ?? ["Workflow automation", "AI copilots", "MVP development"],
    // Reference the sitewide org entity (emitted on the same page) instead of a
    // duplicate inline Organization.
    provider: { "@id": ORG_ID },
    ...(offerNodes.length ? { offers: offerNodes.length === 1 ? offerNodes[0] : offerNodes } : {}),
    url: localizeAbs(params.url),
  };
};

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

/**
 * Reusable Article schema (case studies now; blog/resources later). Author and
 * publisher default to the sitewide org entity (@id graph). `url` is localized to
 * the active locale. Omitted optional fields are simply not emitted.
 */
export const articleJsonLd = (params: {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  articleSection?: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: params.headline,
  ...(params.description ? { description: params.description } : {}),
  ...(params.articleSection ? { articleSection: params.articleSection } : {}),
  mainEntityOfPage: localizeAbs(params.url),
  image: params.image ?? `${base}/og.jpg`,
  ...(params.datePublished ? { datePublished: params.datePublished } : {}),
  ...(params.dateModified ? { dateModified: params.dateModified } : {}),
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
});

export { siteUrl, ORG_ID };

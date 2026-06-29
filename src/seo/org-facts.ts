/**
 * Single source of truth for verified Organization / founder facts (GEO — Phase 7).
 *
 * HOW THIS WORKS: schema (orgJsonLd / founderJsonLd) and the About page only emit
 * a field once it is non-null/non-empty here. So every value left as `null` or `[]`
 * is simply OMITTED — nothing fake is ever rendered.
 *
 * TODO(owner): replace each `null` / empty value below with the REAL value from the
 * company owner, then nothing else needs changing — the JSON-LD and the About page
 * pick it up automatically. DO NOT invent any of these values.
 */
export interface OrgFacts {
  name: string;
  /** Registered legal name, e.g. "Innoviaburst Ltd". */
  legalName: string | null;
  /** ISO 8601 — a year ("2023") or year-month ("2023-06") is fine. */
  foundingDate: string | null;
  founder: {
    /** Founder full name — gates the whole Person node + About founder section. */
    name: string | null;
    jobTitle: string | null;
    /** Founder's own public profiles (LinkedIn, X, …) — absolute URLs. */
    sameAs: string[];
  };
  /** Registered / principal place of business. */
  address: {
    streetAddress: string | null;
    addressLocality: string | null; // city/town
    addressRegion: string | null; // region/county/state
    postalCode: string | null;
    addressCountry: string | null; // ISO-3166-1, e.g. "GB"
  };
  /** VAT or company-registration number (optional). */
  vatId: string | null;
  /** Verified organization profiles only (live links). */
  sameAs: string[];
}

export const ORG_FACTS: OrgFacts = {
  name: "Innoviaburst",
  legalName: null, // TODO(owner): registered company name, e.g. "Innoviaburst Ltd"
  foundingDate: null, // TODO(owner): ISO year/month the company was founded, e.g. "2023"
  founder: {
    name: null, // TODO(owner): founder's full name (enables the founder Person node + About section)
    jobTitle: null, // TODO(owner): e.g. "Founder & CEO"
    sameAs: [], // TODO(owner): founder's own profile URLs (LinkedIn/X/…)
  },
  address: {
    streetAddress: null,
    addressLocality: null, // TODO(owner): city/town of the registered office
    addressRegion: null,
    postalCode: null,
    addressCountry: null, // TODO(owner): ISO country code, e.g. "GB"
  },
  vatId: null, // TODO(owner): VAT/company-registration number (optional)
  // Verified profiles (already live in the site footer). TODO(owner): add
  // Crunchbase / X / GitHub / Clutch once the canonical URLs are confirmed.
  sameAs: [
    "https://www.linkedin.com/company/innoviaburst",
    "https://www.instagram.com/innoviaburst/",
  ],
};

/** True once a real founder name exists — gates the founder Person node + UI. */
export const hasFounder = (): boolean => Boolean(ORG_FACTS.founder.name);

/** True if any postal-address field is set — gates the PostalAddress node. */
export const hasAddress = (): boolean =>
  Object.values(ORG_FACTS.address).some((v) => Boolean(v));

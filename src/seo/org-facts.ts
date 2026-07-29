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
  /** Registered legal name, e.g. "InnoviaBurst" or "Acme Ltd". */
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
  /** Optional second office, shown alongside the registered address. */
  secondaryAddress: {
    streetAddress: string | null;
    addressLocality: string | null;
    addressRegion: string | null;
    postalCode: string | null;
    addressCountry: string | null;
  } | null;
  /**
   * National fiscal / tax identifier. For Tunisia this is the Matricule Fiscal,
   * which also serves as the VAT identifier — emitted as schema.org `taxID`
   * (NOT `vatID`, which would wrongly imply an EU VAT number).
   */
  taxId: string | null;
  /** Verified organization profiles only (live links). */
  sameAs: string[];
}

export const ORG_FACTS: OrgFacts = {
  name: "InnoviaBurst",
  legalName: "InnoviaBurst",
  foundingDate: "2023",
  founder: {
    name: "Walid Ghouili",
    jobTitle: "CEO",
    sameAs: [], // No public founder profile supplied yet.
  },
  address: {
    // Registered office (siège social), Tunisia.
    streetAddress: "Rue Habib Thameur, Résidence Haj Dahman, Étage 1",
    addressLocality: "Jendouba Sud",
    addressRegion: "Jendouba",
    postalCode: "8100",
    addressCountry: "TN",
  },
  secondaryAddress: {
    // Tunis office, shown alongside the registered office.
    streetAddress: "63 Avenue Habib Bourguiba",
    addressLocality: "Tunis",
    addressRegion: "Tunis",
    postalCode: null,
    addressCountry: "TN",
  },
  // Tunisian Matricule Fiscal (also the VAT identifier).
  taxId: "1985775/A/M/000",
  // Verified, live organization profiles.
  sameAs: [
    "https://www.linkedin.com/company/innoviaburst",
    "https://www.facebook.com/profile.php?id=61553603638951",
    "https://www.instagram.com/innoviaburst/",
  ],
};

/** True once a real founder name exists — gates the founder Person node + UI. */
export const hasFounder = (): boolean => Boolean(ORG_FACTS.founder.name);

/** True if any postal-address field is set — gates the PostalAddress node. */
export const hasAddress = (): boolean =>
  Object.values(ORG_FACTS.address).some((v) => Boolean(v));

/** True if a second office address is set — gates the extra location node/line. */
export const hasSecondaryAddress = (): boolean =>
  Boolean(ORG_FACTS.secondaryAddress) &&
  Object.values(ORG_FACTS.secondaryAddress as Record<string, string | null>).some((v) => Boolean(v));

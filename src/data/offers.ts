/**
 * Single source of truth for offer PRICING (Phase 8).
 *
 * EUR is primary (used for display and the Service/Offer schema); GBP is the
 * explicit secondary. The localizable offer COPY (name, timeline, bestFor,
 * deliverables, …) lives in i18n — `offers.*` for the home cards and
 * `offerDetails.*` for the offer pages. This file owns ONLY the numbers and how
 * they are formatted, so prices can never drift between the cards, the offer
 * pages and the JSON-LD again.
 *
 * Confirmed prices (owner):
 *   AI Ops Sprint    €5,000              / £4,500
 *   Automation Build €15,000–€30,000     / £13,000–£26,000
 *   MVP Launch       from €25,000        / from £22,000
 */

/**
 * TEMPORARY pricing kill-switch.
 *
 * `false` → NO price is displayed anywhere (hero chip, offer cards, comparison
 * table, offer-page badge, billing figures) and the AEO "how much" answer renders
 * a no-figure reply; the Service/Offer schema OMITS price/priceCurrency entirely
 * (no Offer node) — while the price DATA in OFFERS below stays intact.
 *
 * `true`  → restores every price AND the priced schema exactly as before.
 *
 * This is the ONE switch every price-rendering site reads. Flip and rebuild.
 */
export const SHOW_PRICING = false;

export interface Money {
  /** Lower bound, or the single fixed price. */
  min: number;
  /** Upper bound — present only for a range. */
  max?: number;
  /** Render with a "From " prefix (open-ended starting price). */
  from?: boolean;
}

export interface OfferPrice {
  slug: string;
  eur: Money;
  gbp: Money;
}

export const OFFERS: Record<string, OfferPrice> = {
  "ai-ops-sprint": { slug: "ai-ops-sprint", eur: { min: 5000 }, gbp: { min: 4500 } },
  "automation-build": { slug: "automation-build", eur: { min: 15000, max: 30000 }, gbp: { min: 13000, max: 26000 } },
  "mvp-launch": { slug: "mvp-launch", eur: { from: true, min: 25000 }, gbp: { from: true, min: 22000 } },
};

const CUR = {
  EUR: { code: "EUR", locale: "en-IE" },
  GBP: { code: "GBP", locale: "en-GB" },
} as const;
export type CurrencyKey = keyof typeof CUR;

const amount = (n: number, cur: CurrencyKey): string =>
  new Intl.NumberFormat(CUR[cur].locale, {
    style: "currency",
    currency: CUR[cur].code,
    maximumFractionDigits: 0,
  }).format(n);

/** "€5,000" | "€15,000–€30,000" | "From €25,000" */
export const formatMoney = (m: Money, cur: CurrencyKey): string =>
  `${m.from ? "From " : ""}${amount(m.min, cur)}${m.max != null ? `–${amount(m.max, cur)}` : ""}`;

export const hasOffer = (slug: string): boolean => slug in OFFERS;

export const priceEUR = (slug: string): string => {
  const o = OFFERS[slug];
  return o ? formatMoney(o.eur, "EUR") : "";
};

export const priceGBP = (slug: string): string => {
  const o = OFFERS[slug];
  return o ? formatMoney(o.gbp, "GBP") : "";
};

/**
 * EUR primary, explicit GBP — for inline copy (e.g. the AEO "how much" answer),
 * e.g. "From €25,000 (£22,000)". The "From" prefix (when present) sits on the
 * primary EUR figure only, so it isn't duplicated inside the parentheses.
 */
export const priceInline = (slug: string): string => {
  const o = OFFERS[slug];
  if (!o) return "";
  const gbpBare = formatMoney({ min: o.gbp.min, max: o.gbp.max }, "GBP");
  return `${formatMoney(o.eur, "EUR")} (${gbpBare})`;
};

/**
 * Schema price points (EUR primary, then GBP). `price` is the numeric lower
 * bound; `priceRange` carries the formatted range string when it is a range.
 */
export const schemaOffers = (slug: string): { priceCurrency: string; price: number; priceRange?: string }[] => {
  const o = OFFERS[slug];
  // Pricing hidden → omit the Offer node entirely (never emit an empty/zero price).
  if (!o || !SHOW_PRICING) return [];
  return [
    { priceCurrency: "EUR", price: o.eur.min, priceRange: o.eur.max != null ? formatMoney(o.eur, "EUR") : undefined },
    { priceCurrency: "GBP", price: o.gbp.min, priceRange: o.gbp.max != null ? formatMoney(o.gbp, "GBP") : undefined },
  ];
};

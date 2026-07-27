/**
 * A/B campaign config for /lp/mvp.
 *
 * The above-the-fold message (eyebrow, headline, subhead, primary CTA) lives
 * here as i18n key references — NOT hard-coded copy — so we can message-match a
 * page variant to the ad that sent the click without editing the component.
 *
 * HOW TO A/B / MESSAGE-MATCH A CAMPAIGN:
 *   1. Add a variant below (its keys resolve under `lpMvp.hero.variants.<id>`
 *      in en.json + fr.json; leave a key out of the JSON and it transparently
 *      falls back to the `default` copy via `defaultValue`).
 *   2. Point the ad at `/lp/mvp?v=<id>` (or `?variant=<id>`).
 * The `default` variant renders for direct/organic hits and during SSG.
 */

export interface LpHeroVariant {
  /** i18n key for the small eyebrow above the H1. */
  eyebrowKey: string;
  /** H1 split into pre + gradient-accent + post so the accent can be styled. */
  headlinePreKey: string;
  headlineAccentKey: string;
  headlinePostKey: string;
  /** i18n key for the subhead paragraph. */
  subheadKey: string;
  /** i18n key for the primary CTA label (form submit + sticky/nav buttons). */
  primaryCtaKey: string;
}

const base = (id: string): LpHeroVariant => ({
  eyebrowKey: `lpMvp.hero.variants.${id}.eyebrow`,
  headlinePreKey: `lpMvp.hero.variants.${id}.headlinePre`,
  headlineAccentKey: `lpMvp.hero.variants.${id}.headlineAccent`,
  headlinePostKey: `lpMvp.hero.variants.${id}.headlinePost`,
  subheadKey: `lpMvp.hero.variants.${id}.subhead`,
  primaryCtaKey: `lpMvp.hero.variants.${id}.primaryCta`,
});

export const LP_MVP_VARIANTS: Record<string, LpHeroVariant> = {
  // Direct/organic + SSG default. Reads straight from `lpMvp.hero.*`.
  default: {
    eyebrowKey: "lpMvp.hero.eyebrow",
    headlinePreKey: "lpMvp.hero.headlinePre",
    headlineAccentKey: "lpMvp.hero.headlineAccent",
    headlinePostKey: "lpMvp.hero.headlinePost",
    subheadKey: "lpMvp.hero.subhead",
    primaryCtaKey: "lpMvp.hero.primaryCta",
  },
  // Example variant for a "raise / investor" ad set.
  investor: base("investor"),
  // Example variant for a "ship fast / speed" ad set.
  speed: base("speed"),
};

export const DEFAULT_VARIANT = "default";

/** Resolve a (possibly-untrusted) `?v=` value to a known variant id. */
export function resolveVariant(value?: string | null): string {
  const key = (value ?? "").trim().toLowerCase();
  return key && key in LP_MVP_VARIANTS ? key : DEFAULT_VARIANT;
}

/** Read the requested variant from a URL search string (hydration-safe caller). */
export function variantFromSearch(search: string): string {
  const params = new URLSearchParams(search);
  return resolveVariant(params.get("v") ?? params.get("variant"));
}

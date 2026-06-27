// Single source of truth for locale-prefixed routing.
// Phase 1: only `en` is live. Phase 5 adds `fr` (just extend LOCALES).
// The app (react-router basename), the SSR render hooks, SeoHead, and the
// build scripts all read these helpers so canonical URLs never drift.

export const LOCALES = ["en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** True if `seg` is a supported locale code. */
export function isLocale(seg: string | undefined): seg is Locale {
  return !!seg && (LOCALES as readonly string[]).includes(seg);
}

/**
 * Extract the locale from a full pathname (e.g. "/en/automations" -> "en").
 * Falls back to DEFAULT_LOCALE when the first segment isn't a known locale.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  return isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/** The react-router basename for a locale, e.g. "/en". */
export function basenameFor(locale: Locale): string {
  return `/${locale}`;
}

/**
 * Build a locale-prefixed path from a flat in-app path.
 *   localizedPath("en", "/")            -> "/en/"
 *   localizedPath("en", "/automations") -> "/en/automations"
 */
export function localizedPath(locale: Locale, flatPath = "/"): string {
  const clean = `/${flatPath.replace(/^\/+/, "")}`;
  if (clean === "/") return `/${locale}/`;
  return `/${locale}${clean}`;
}

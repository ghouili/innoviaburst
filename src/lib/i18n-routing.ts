// Single source of truth for locale-prefixed routing.
// Phase 5: `en` (default) + `fr`. The app (react-router basename), the SSR
// render hooks, SeoHead, and the build scripts all read these helpers so
// canonical URLs never drift.

export const LOCALES = ["en", "fr"] as const;
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

/**
 * Pick the locale for a bare "/" request. Mirrors the `map` blocks in
 * nginx.prod.conf and negotiateLocale() in scripts/site-content.mjs so dev,
 * preview and prod all resolve "/" the same way:
 *   1. an explicit `locale` cookie (set by LanguageSwitcher) wins;
 *   2. otherwise the browser's primary Accept-Language tag ("fr-FR" -> fr);
 *   3. otherwise DEFAULT_LOCALE.
 */
export function negotiateLocale(acceptLanguage = "", cookieLocale = ""): Locale {
  const cookie = cookieLocale.trim().toLowerCase().slice(0, 2);
  if (isLocale(cookie)) return cookie;
  const primary = acceptLanguage.toLowerCase().split(",")[0].split("-")[0].trim();
  return isLocale(primary) ? primary : DEFAULT_LOCALE;
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

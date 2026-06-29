import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { safeJsonLd } from "@/seo/jsonld";
import { DEFAULT_LOCALE, LOCALES, isLocale, localizedPath, type Locale } from "@/lib/i18n-routing";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type AlternateLink = {
  hrefLang: string;
  href: string;
};

type SeoHeadProps = {
  title: string;
  description?: string;
  /** Flat in-app path WITHOUT the locale prefix, e.g. "/ai-ops-sprint" or "/". */
  canonicalPath?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: JsonLd;
  /** Accepts any string (e.g. i18n.language); normalized to a supported locale. */
  lang?: string;
  /** Optional override; when omitted, hreflang alternates are derived from canonicalPath. */
  alternates?: AlternateLink[];
};

const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";
const defaultOgImage = "/og.jpg";

/** Absolute URL from an already-locale-prefixed (or asset) path. */
const buildUrl = (path = "") => {
  if (!path) return siteUrl;
  return `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

/** hreflang alternates for every supported locale, derived from a flat path. */
const buildAlternates = (flatPath = "/"): AlternateLink[] =>
  LOCALES.map((loc) => ({
    hrefLang: loc,
    href: buildUrl(localizedPath(loc, flatPath)),
  }));

const localeMap: Record<string, string> = {
  en: "en_GB",
  fr: "fr_FR",
};

export function SeoHead({
  title,
  description,
  canonicalPath = "/",
  robots,
  ogImage,
  ogType = "website",
  jsonLd,
  lang,
  alternates,
}: SeoHeadProps) {
  // Locale = explicit `lang` prop, else the active i18n language (the SSR sets
  // this per request, so /fr/* render with loc="fr"). Normalize "en-GB"->"en".
  const { i18n } = useTranslation();
  const active = lang ?? i18n.language ?? DEFAULT_LOCALE;
  const loc: Locale = isLocale(active)
    ? active
    : isLocale(active.slice(0, 2))
      ? (active.slice(0, 2) as Locale)
      : DEFAULT_LOCALE;
  // Self-referencing canonical at the locale-prefixed URL (e.g. /en/trust).
  const canonical = buildUrl(localizedPath(loc, canonicalPath));
  // x-default always points at the default locale (en) per the locale strategy.
  const xDefaultHref = buildUrl(localizedPath(DEFAULT_LOCALE, canonicalPath));
  const hreflangs = alternates ?? buildAlternates(canonicalPath);

  const ogImageUrl = ogImage?.startsWith("http") ? ogImage : buildUrl(ogImage || defaultOgImage);
  const locale = localeMap[loc] || "en_GB";
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <Helmet htmlAttributes={{ lang: loc }}>
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        <link rel="canonical" href={canonical} />

        {/* Hreflang alternates (self + every locale) + x-default */}
        {hreflangs.map((alt) => (
          <link key={`${alt.hrefLang}-${alt.href}`} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={xDefaultHref} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        {description ? <meta property="og:description" content={description} /> : null}
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content="Innoviaburst" />
        <meta property="og:locale" content={locale} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description ? <meta name="twitter:description" content={description} /> : null}
        <meta name="twitter:image" content={ogImageUrl} />

        <meta httpEquiv="content-language" content={loc} />
        {robots ? <meta name="robots" content={robots} /> : null}
      </Helmet>

      {/* JSON-LD is rendered directly in the document (not via helmet, which
          drops dangerouslySetInnerHTML on <script>). Google reads ld+json
          anywhere in the page; rendering here guarantees it lands in the SSR
          HTML for crawlers and AI engines. */}
      {jsonLdArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
        />
      ))}
    </>
  );
}

export { buildAlternates, buildUrl, defaultOgImage, siteUrl };

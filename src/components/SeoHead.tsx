import { Helmet } from "react-helmet-async";
import { safeJsonLd } from "@/seo/jsonld";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type AlternateLink = {
  hrefLang: string;
  href: string;
};

type SeoHeadProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: JsonLd;
  lang?: string;
  alternates?: AlternateLink[];
};

const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";
const defaultOgImage = "/og.jpg";

const buildUrl = (path = "") => {
  if (!path) return siteUrl;
  return `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

const buildAlternates = (path = "") => [
  { hrefLang: "en", href: buildUrl(path) },
  { hrefLang: "fr", href: `${buildUrl(path)}?lng=fr` },
];

const localeMap: Record<string, string> = {
  en: "en_GB",
  fr: "fr_FR",
};

export function SeoHead({
  title,
  description,
  canonicalPath,
  robots,
  ogImage,
  ogType = "website",
  jsonLd,
  lang = "en",
  alternates,
}: SeoHeadProps) {
  const canonical = buildUrl(canonicalPath);
  const ogImageUrl = ogImage?.startsWith("http") ? ogImage : buildUrl(ogImage || defaultOgImage);
  const locale = localeMap[lang] || "en_GB";
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet
      htmlAttributes={{ lang }}
    >
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />

      {/* Hreflang alternates */}
      {alternates?.map((alt) => (
        <link key={`${alt.hrefLang}-${alt.href}`} rel="alternate" hrefLang={alt.hrefLang} href={alt.href} />
      ))}
      {alternates?.length ? (
        <link rel="alternate" hrefLang="x-default" href={canonical} />
      ) : null}

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

      <meta httpEquiv="content-language" content={lang} />
      {robots ? <meta name="robots" content={robots} /> : null}

      {jsonLdArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
        />
      ))}
    </Helmet>
  );
}

export { buildAlternates, buildUrl, defaultOgImage, siteUrl };
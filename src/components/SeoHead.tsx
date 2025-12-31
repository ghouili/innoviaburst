import { Helmet } from "react-helmet-async";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type SeoHeadProps = {
  title: string;
  description?: string;
  path?: string;
  robots?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: JsonLd;
};

const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";
const defaultOgImage = "/og.jpg";

const buildUrl = (path = "") => {
  if (!path) return siteUrl;
  return `${siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export function SeoHead({
  title,
  description,
  path,
  robots,
  ogImage,
  ogType = "website",
  jsonLd,
}: SeoHeadProps) {
  const canonical = buildUrl(path);
  const ogImageUrl = ogImage || defaultOgImage;

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content="Innoviaburst" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={ogImageUrl} />

      {robots ? <meta name="robots" content={robots} /> : null}

      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}
    </Helmet>
  );
}

export { buildUrl, defaultOgImage, siteUrl };
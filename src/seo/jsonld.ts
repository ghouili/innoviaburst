const siteUrl = import.meta.env.VITE_SITE_URL || "https://innoviaburst.com";

export const safeJsonLd = (data: Record<string, unknown> | Record<string, unknown>[]) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Innoviaburst",
  url: siteUrl,
  logo: `${siteUrl.replace(/\/$/, "")}/og.jpg`,
  sameAs: ["https://www.linkedin.com/company/innoviaburst"],
  areaServed: ["GB", "EU"],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={query}`,
    queryInput: "required name=query",
  },
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const serviceJsonLd = (params: {
  name: string;
  description: string;
  url: string;
  areaServed?: string[];
  serviceType?: string[];
  priceCurrency?: string;
  price?: string | number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: params.name,
  description: params.description,
  areaServed: params.areaServed ?? ["GB", "EU"],
  serviceType: params.serviceType ?? ["Workflow automation", "AI copilots", "MVP development"],
  provider: {
    "@type": "Organization",
    name: "Innoviaburst",
    url: siteUrl,
  },
  offers: params.price
    ? {
        "@type": "Offer",
        url: params.url,
        priceCurrency: params.priceCurrency ?? "GBP",
        price: params.price,
        availability: "https://schema.org/InStock",
      }
    : undefined,
  url: params.url,
});

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

export { siteUrl };

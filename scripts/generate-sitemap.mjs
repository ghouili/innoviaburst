import fs from "node:fs";
import path from "node:path";

const siteUrl = process.env.VITE_SITE_URL || "https://innoviaburst.com";
const outPath = path.resolve(process.cwd(), "public", "sitemap.xml");

const staticRoutes = [
  "/",
  "/automations",
  "/work",
  "/works",
  "/resources",
  "/industries",
  "/trust",
  "/subprocessors",
  "/privacy",
  "/cookies",
  "/terms",
  "/coming-soon",
];

const offerSlugs = ["ai-ops-sprint", "automation-build", "mvp-launch"];
const caseStudySlugs = [
  "professional-services-client-onboarding",
  "saas-support-ticket-triage",
];

const dynamicRoutes = [
  ...offerSlugs.map((slug) => `/${slug}`),
  ...caseStudySlugs.map((slug) => `/work/${slug}`),
];

const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => {
    const loc = `${siteUrl.replace(/\/$/, "")}${route}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${route === "/" ? "1.0" : "0.8"}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, "utf8");
console.log(`Sitemap written to ${outPath} with ${allRoutes.length} routes.`);
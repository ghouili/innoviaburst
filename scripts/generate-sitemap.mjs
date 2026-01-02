import fs from "node:fs";
import path from "node:path";
import { allRoutes, siteUrl } from "./site-content.mjs";

const outPath = path.resolve(process.cwd(), "public", "sitemap.xml");

const resolveLastmod = (sourcePath, fallback) => {
  try {
    const stat = fs.statSync(path.resolve(process.cwd(), sourcePath));
    return stat.mtime.toISOString().split("T")[0];
  } catch (error) {
    console.warn(`[sitemap] Unable to read mtime for ${sourcePath}: ${error.message}`);
    return fallback;
  }
};

const today = new Date().toISOString().split("T")[0];
const seen = new Set();

const routes = allRoutes.filter((route) => {
  if (seen.has(route.path)) return false;
  seen.add(route.path);
  return true;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const loc = `${siteUrl.replace(/\/$/, "")}${route.path}`;
    const lastmod = resolveLastmod(route.source, today);
    const changefreq = route.changefreq || "monthly";
    const priority = route.priority ?? (route.path === "/" ? 1 : 0.8);
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(2)}</priority>\n  </url>`;
  })
  .join("\n")}
</urlset>`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, "utf8");
console.log(`Sitemap written to ${outPath} with ${routes.length} routes.`);
// SEO surface drift guard: <title>, canonical and meta description are compared
// byte-for-byte against a committed baseline for every indexable route.
//
// Why this exists: titles and descriptions are deliberate SEO assets, but they
// live in i18n files that get edited for unrelated reasons (copy passes, tone
// tweaks, typo fixes). A silent one-character change to a <title> is invisible
// in review and expensive in search. This turns that into a failing check.
//
// Changing copy on purpose is fine — re-baseline it:
//     npm run qa:titles -- --update
// which rewrites scripts/seo-baseline.json. Commit that diff alongside the copy
// change so the new strings are reviewed as an explicit, visible edit rather
// than sliding through unnoticed.
import fs from "node:fs";
import path from "node:path";
import { sitemapRoutes } from "./site-content.mjs";

const ROOT = path.resolve("dist", "client");
const BASELINE = path.resolve("scripts", "seo-baseline.json");
const UPDATE = process.argv.includes("--update");

const extract = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

/** Read the SEO surface out of one pre-rendered page. */
const surfaceOf = (loc) => {
  // sitemap loc is "/en/about" -> dist/client/en/about/index.html
  const rel = path.join(loc.replace(/^\//, "").replace(/\/$/, ""), "index.html");
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return null;
  const html = fs.readFileSync(file, "utf8");
  return {
    title: extract(html, /<title[^>]*>([^<]*)<\/title>/i),
    canonical: extract(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    description: extract(html, /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i),
  };
};

const routes = sitemapRoutes().map((r) => r.loc);
const current = {};
const missing = [];
for (const loc of routes) {
  const s = surfaceOf(loc);
  if (!s) { missing.push(loc); continue; }
  current[loc] = s;
}

if (UPDATE) {
  if (missing.length) {
    console.error("Refusing to re-baseline: pages missing from the build:", missing.join(", "));
    console.error("Run `npm run build` first.");
    process.exit(1);
  }
  fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2) + "\n");
  console.log(`Re-baselined ${Object.keys(current).length} routes -> ${path.relative(process.cwd(), BASELINE)}`);
  console.log("Review the diff before committing: every changed title/description is an intentional SEO edit.");
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error(`No baseline at ${path.relative(process.cwd(), BASELINE)}. Create it with: npm run qa:titles -- --update`);
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(BASELINE, "utf8"));

const drift = [];
for (const loc of routes) {
  const b = baseline[loc];
  const c = current[loc];
  if (!c) { drift.push({ loc, field: "page", was: "present", now: "MISSING FROM BUILD" }); continue; }
  if (!b) { drift.push({ loc, field: "route", was: "not in baseline", now: "new route" }); continue; }
  for (const field of ["title", "canonical", "description"]) {
    if (b[field] !== c[field]) drift.push({ loc, field, was: b[field], now: c[field] });
  }
}
// routes that vanished from the sitemap but are still baselined
for (const loc of Object.keys(baseline)) {
  if (!routes.includes(loc)) drift.push({ loc, field: "route", was: "baselined", now: "NO LONGER IN SITEMAP" });
}

console.log("\n===== SEO SURFACE BASELINE (title / canonical / description) =====");
console.log(`  routes checked: ${routes.length}   baseline entries: ${Object.keys(baseline).length}`);
if (drift.length) {
  for (const d of drift) {
    console.log(`  ✗ ${d.loc} [${d.field}]`);
    console.log(`      baseline: ${JSON.stringify(d.was)}`);
    console.log(`      built:    ${JSON.stringify(d.now)}`);
  }
  console.log(`\n  ${drift.length} drift(s). If intentional: npm run qa:titles -- --update`);
} else {
  console.log("  ✓ no drift");
}
console.log("\nVERDICT:", drift.length === 0 ? "PASS ✅" : "REVIEW ❌");
process.exit(0);

// Static JSON-LD validator for the pre-rendered build (dist/client).
// Extracts every <script type="application/ld+json"> block from each page,
// checks it parses, and verifies the required fields per @type. Complements
// verify-seo.mjs (which checks a LIVE url) — this runs on the SSG output.
//
// Usage: node scripts/validate-jsonld.mjs            (checks a default page set)
//        node scripts/validate-jsonld.mjs <relpaths> (e.g. en/index.html ...)
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("dist", "client");
const DEFAULT_PAGES = [
  "en/index.html",
  "en/automations/index.html",
  "en/trust/index.html",
  "en/works/index.html",
  "en/industries/index.html",
  "en/resources/index.html",
  "en/ai-ops-sprint/index.html",
  "en/automation-build/index.html",
  "en/mvp-launch/index.html",
  "en/lp/ai-automation/index.html",
  "en/work/professional-services-client-onboarding/index.html",
  "en/work/saas-support-ticket-triage/index.html",
  "en/about/index.html",
  "en/privacy/index.html",
  // A couple of /fr pages to confirm localized schema validates too.
  "fr/index.html",
  "fr/ai-ops-sprint/index.html",
  "fr/about/index.html",
];
const pages = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PAGES;

const types = (node) => (Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]]).filter(Boolean);
const has = (o, k) => o != null && o[k] != null && o[k] !== "";

let errors = 0;
let blocksTotal = 0;
const typeCount = {};

function checkNode(node, where, push) {
  const t = types(node);
  t.forEach((x) => (typeCount[x] = (typeCount[x] || 0) + 1));
  if (!node["@context"]) push(`${where}: missing @context`);
  if (t.length === 0) push(`${where}: missing @type`);

  if (t.includes("Organization") || t.includes("ProfessionalService")) {
    for (const k of ["name", "url", "@id", "logo"]) if (!has(node, k)) push(`${where} [Org]: missing ${k}`);
  }
  if (t.includes("WebSite")) {
    if (!has(node, "url")) push(`${where} [WebSite]: missing url`);
  }
  if (t.includes("BreadcrumbList")) {
    const items = node.itemListElement || [];
    if (!items.length) push(`${where} [Breadcrumb]: empty itemListElement`);
    items.forEach((it, i) => {
      for (const k of ["position", "name", "item"]) if (!has(it, k)) push(`${where} [Breadcrumb#${i}]: missing ${k}`);
    });
  }
  if (t.includes("Service")) {
    for (const k of ["name", "provider"]) if (!has(node, k)) push(`${where} [Service]: missing ${k}`);
    if (node.offers) {
      // `offers` may be a single Offer or an array of Offers (e.g. EUR + GBP).
      const offerList = Array.isArray(node.offers) ? node.offers : [node.offers];
      offerList.forEach((off, oi) => {
        const label = offerList.length > 1 ? `[Offer#${oi}]` : "[Offer]";
        for (const k of ["price", "priceCurrency", "availability"]) if (!has(off, k)) push(`${where} ${label}: missing ${k}`);
        if (off.price != null && Number.isNaN(Number(off.price))) push(`${where} ${label}: price not numeric (${off.price})`);
      });
    }
  }
  if (t.includes("FAQPage")) {
    const m = node.mainEntity || [];
    if (!m.length) push(`${where} [FAQ]: empty mainEntity`);
    m.forEach((q, i) => {
      if (!has(q, "name")) push(`${where} [FAQ#${i}]: missing question name`);
      if (!has(q.acceptedAnswer || {}, "text")) push(`${where} [FAQ#${i}]: missing acceptedAnswer.text`);
    });
  }
}

for (const rel of pages) {
  const file = path.join(ROOT, rel);
  if (!existsSync(file)) { console.log(`SKIP (missing): ${rel}`); continue; }
  const html = readFileSync(file, "utf8");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const found = [];
  const pageErrs = [];
  blocks.forEach((raw, bi) => {
    blocksTotal++;
    let json;
    try { json = JSON.parse(raw); }
    catch (e) { pageErrs.push(`block#${bi}: invalid JSON (${e.message})`); errors++; return; }
    const arr = Array.isArray(json) ? json : [json];
    arr.forEach((node) => { found.push(...types(node)); checkNode(node, `block#${bi}`, (m) => { pageErrs.push(m); errors++; }); });
  });
  console.log(`\n${rel}\n  blocks: ${blocks.length} | types: ${[...new Set(found)].join(", ") || "(none)"}`);
  pageErrs.forEach((e) => console.log("  ✗ " + e));
}

console.log("\n================ JSON-LD VALIDATION ================");
console.log("type occurrences:", JSON.stringify(typeCount));
console.log(`blocks: ${blocksTotal} | errors: ${errors}`);
console.log(errors === 0 ? "RESULT: PASS ✅ (well-formed + required fields present)" : "RESULT: FAIL ❌");
process.exit(errors === 0 ? 0 : 1);

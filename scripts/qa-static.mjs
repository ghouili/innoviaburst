// Phase 11 QA — static checks over the pre-rendered (no-JS) build.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("dist", "client");
const base = "https://innoviaburst.com";
const read = (rel) => (existsSync(path.join(ROOT, rel)) ? readFileSync(path.join(ROOT, rel), "utf8") : null);
const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<");

const results = [];
const check = (dim, name, cond, extra = "") => results.push({ dim, name, pass: !!cond, extra });

// page = { rel, loc, flat } ; flat path used to build expected canonical
const PAGES = [
  { rel: "en/index.html", loc: "en", flat: "/" },
  { rel: "fr/index.html", loc: "fr", flat: "/" },
  { rel: "en/ai-ops-sprint/index.html", loc: "en", flat: "/ai-ops-sprint" },
  { rel: "fr/ai-ops-sprint/index.html", loc: "fr", flat: "/ai-ops-sprint" },
  { rel: "en/about/index.html", loc: "en", flat: "/about" },
  { rel: "fr/about/index.html", loc: "fr", flat: "/about" },
  { rel: "en/lp/ai-automation/index.html", loc: "en", flat: "/lp/ai-automation" },
  { rel: "fr/lp/ai-automation/index.html", loc: "fr", flat: "/lp/ai-automation" },
];

const canonOf = (loc, flat) => `${base}${flat === "/" ? `/${loc}/` : `/${loc}${flat}`}`;
const KEY_LEAK = /(offerPage|cookiesPage|privacyPage|termsPage|subprocessorsPage|resourcesSection|notFound|languageSwitcher|about|offerDetails|caseStudyPage|workPage|industriesPage)\.[a-z][a-zA-Z]+/;

for (const p of PAGES) {
  const html = read(p.rel);
  if (!html) { check("RENDER", `${p.rel} exists`, false); continue; }
  const tag = `${p.loc}${p.flat}`;

  // RENDER (helmet adds data-rh attrs; HTML attrs are case-insensitive)
  check("RENDER", `${tag} <title>`, /<title[^>]*>[^<]{10,}<\/title>/.test(html));
  check("RENDER", `${tag} meta description`, /<meta[^>]+name="description"[^>]+content="[^"]{30,}"/i.test(html));
  check("RENDER", `${tag} canonical=${canonOf(p.loc, p.flat)}`, html.includes(`rel="canonical"`) && html.includes(`href="${canonOf(p.loc, p.flat)}"`));
  check("RENDER", `${tag} og:title+og:image`, /property="og:title"/.test(html) && /property="og:image"/.test(html));
  check("RENDER", `${tag} JSON-LD blocks`, (html.match(/application\/ld\+json/g) || []).length >= 2);
  check("RENDER", `${tag} substantive body text`, decode(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().length > 1200);
  check("RENDER", `${tag} <html lang="${p.loc}">`, new RegExp(`<html lang="${p.loc}"`).test(html));

  // HREFLANG — parse alternate links (case-insensitive hreflang); bidirectional + self-ref + x-default, absolute
  const alts = [...html.matchAll(/<link[^>]*rel="alternate"[^>]*>/g)].map((t) => ({
    hl: (t[0].match(/hreflang="([^"]+)"/i) || [])[1]?.toLowerCase(),
    href: (t[0].match(/href="([^"]+)"/i) || [])[1],
  }));
  const get = (k) => alts.find((a) => a.hl === k)?.href;
  const en = get("en") === canonOf("en", p.flat);
  const fr = get("fr") === canonOf("fr", p.flat);
  const xd = get("x-default") === canonOf("en", p.flat);
  check("HREFLANG", `${tag} en+fr+x-default self-ref+absolute`, en && fr && xd, en && fr && xd ? "" : `en=${en} fr=${fr} xd=${xd}`);

  // PARITY — fr pages: lang fr + canonical fr + no raw i18n key leaking in visible text
  if (p.loc === "fr") {
    const body = decode(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, ""));
    const leak = body.match(KEY_LEAK);
    check("PARITY", `${tag} no raw i18n key in body`, !leak, leak ? `leak: ${leak[0]}` : "");
    check("PARITY", `${tag} og:locale fr_FR`, /og:locale"[^>]+content="fr_FR"/.test(html) || /content="fr_FR"[^>]+og:locale/.test(html) || html.includes("fr_FR"));
  }
}

// SITEMAP / ROBOTS / LLMS
const sm = read("sitemap.xml");
check("LINKS", "sitemap.xml exists", !!sm);
if (sm) {
  check("LINKS", "sitemap has /en/about", sm.includes(`${base}/en/about`));
  check("LINKS", "sitemap has /fr/about", sm.includes(`${base}/fr/about`));
  check("LINKS", "sitemap has /en/ + /fr/ home", sm.includes(`${base}/en/`) && sm.includes(`${base}/fr/`));
  check("LINKS", "sitemap EXCLUDES /lp (noindex)", !sm.includes("/lp/ai-automation"));
  check("LINKS", "sitemap EXCLUDES /404", !sm.includes("/404"));
  const locs = (sm.match(/<loc>/g) || []).length;
  check("LINKS", `sitemap url count (${locs})`, locs >= 30);
}
const robots = read("robots.txt");
check("LINKS", "robots.txt exists", !!robots);
if (robots) check("LINKS", "robots references sitemap", /Sitemap:\s*https?:\/\/[^\s]+sitemap\.xml/i.test(robots));
check("LINKS", "llms.txt exists", !!read("llms.txt"));

// REPORT
const byDim = {};
for (const r of results) { (byDim[r.dim] ??= []).push(r); }
for (const dim of Object.keys(byDim)) {
  const fails = byDim[dim].filter((r) => !r.pass);
  console.log(`\n[${dim}] ${byDim[dim].length - fails.length}/${byDim[dim].length} pass`);
  for (const f of fails) console.log(`  ✗ ${f.name}${f.extra ? " — " + f.extra : ""}`);
}
const allFails = results.filter((r) => !r.pass);
console.log(`\n===== QA STATIC: ${results.length - allFails.length}/${results.length} checks pass =====`);
console.log(allFails.length ? "RESULT: REVIEW ❌" : "RESULT: PASS ✅");

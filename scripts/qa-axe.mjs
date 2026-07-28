import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
const PORT = 5127;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const axeSrc = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
/**
 * Pages to audit, with the hero-accent expectation declared per page.
 *
 * `heroAccent: true` means the page is supposed to carry the brand-gradient
 * heading accent — a *fragment* of the H1 wrapped in `.text-gradient-brand`,
 * driven by a dedicated `titleHighlight` i18n key (home, /automations, /trust,
 * /works, /industries, ...).
 *
 * It is not a site-wide invariant. An offer page's H1 is the bare product name
 * (`{offer.title}` — "AI Ops Sprint"), and the legal/about pages have no accent
 * either; there is no fragment to highlight and gradient-filling a whole product
 * name is a pattern used nowhere in the design system. The probe used to assert
 * the accent unconditionally, so /ai-ops-sprint failed the whole suite for a
 * design it was never meant to have. The flag keeps the assertion strict where
 * the pattern applies and silent where it doesn't — if a marketing page ever
 * loses its accent, this still fails.
 */
const PAGES = [
  { path: "/en/", heroAccent: true },
  { path: "/fr/", heroAccent: true },
  { path: "/en/ai-ops-sprint", heroAccent: false },
];

let browser; const out = [];
try {
  await sleep(1500);
  browser = await chromium.launch({ headless: true, executablePath: process.env.PW_EXECUTABLE });
  for (const { path, heroAccent: expectAccent } of PAGES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" }).catch(() => {});
    await sleep(1200);
    const lang = await page.evaluate(() => document.documentElement.lang);
    await page.evaluate(axeSrc);
    const res = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
    const byImpact = {};
    const rules = [];
    for (const v of res.violations) { byImpact[v.impact] = (byImpact[v.impact] || 0) + v.nodes.length; rules.push(`${v.impact}:${v.id}(${v.nodes.length})`); }
    // focus indicator: tab to first interactive element, check it has a visible ring/outline
    await page.keyboard.press("Tab");
    await sleep(150);
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { tag: "(none)", ring: false };
      const s = getComputedStyle(el);
      const ring = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none");
      return { tag: el.tagName.toLowerCase() + (el.textContent ? "·" + el.textContent.trim().slice(0, 18) : ""), ring };
    });
    // hero H1 accent: confirm the gradient class is applied + computed color is transparent w/ bg-image (gradient renders)
    const accent = await page.evaluate(() => {
      const el = document.querySelector("h1 .text-gradient-brand") || document.querySelector(".text-gradient-brand");
      if (!el) return { found: false };
      const s = getComputedStyle(el);
      return { found: true, hasGradient: /gradient/.test(s.backgroundImage), clip: s.webkitBackgroundClip || s.backgroundClip };
    });
    // Pages without the accent pattern still have to have a top-level heading —
    // that's the check that carries the weight where the gradient one can't.
    const h1s = await page.evaluate(() => document.querySelectorAll("h1").length);
    const heroAccent = expectAccent ? { ...accent, ok: !!accent.hasGradient } : { expected: false, ok: true };
    out.push({ path, lang, criticals: byImpact.critical || 0, serious: byImpact.serious || 0, moderate: byImpact.moderate || 0, rules: rules.slice(0, 8), focusRing: focus.ring, focusEl: focus.tag, h1s, heroAccent });
    await page.close();
  }
} catch (e) { out.push({ fatal: String(e).slice(0, 200) }); }
finally { if (browser) await browser.close().catch(() => {}); server.kill(); }
console.log("\n===== PHASE 11 AXE A11Y =====");
for (const r of out) console.log(JSON.stringify(r));
const pass = out.every((r) => !r.fatal && r.criticals === 0 && r.lang && r.focusRing && r.h1s === 1 && r.heroAccent?.ok);
console.log("\nVERDICT (0 critical + lang + focus ring + single h1 + hero gradient where expected):", pass ? "PASS ✅" : "REVIEW ❌");
process.exit(0);

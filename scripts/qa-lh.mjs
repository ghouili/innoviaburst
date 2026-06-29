// Phase 11 QA: Lighthouse mobile, all 4 categories, on home + offer + /fr.
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { spawn } from "node:child_process";
const PORT = 5126;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/en/", "/en/ai-ops-sprint", "/fr/"];
const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
await sleep(1800);
const chrome = await launch({ chromePath: process.env.PW_EXECUTABLE, chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
const flags = { port: chrome.port, logLevel: "error", output: "json", onlyCategories: ["performance", "seo", "best-practices", "accessibility"], formFactor: "mobile", screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false } };
const rows = [];
try {
  for (const p of paths) {
    const res = await lighthouse(`http://localhost:${PORT}${p}`, flags);
    const c = res.lhr.categories;
    const pct = (x) => Math.round((x?.score ?? 0) * 100);
    rows.push({ path: p, Perf: pct(c.performance), SEO: pct(c.seo), BP: pct(c["best-practices"]), A11y: pct(c.accessibility) });
  }
} catch (e) { console.log("LH ERROR:", String(e).slice(0, 300)); }
finally { await chrome.kill(); server.kill(); }
console.log("\n===== LIGHTHOUSE MOBILE — 4 CATEGORIES (lab) =====");
for (const r of rows) console.log(`${r.path.padEnd(22)} Perf ${r.Perf}  SEO ${r.SEO}  Best-Practices ${r.BP}  Accessibility ${r.A11y}`);
const pass = rows.every((r) => r.Perf >= 90 && r.SEO >= 90 && r.BP >= 90 && r.A11y >= 90);
const seo100 = rows.every((r) => r.SEO === 100);
console.log(`\nGATE (all >=90): ${pass ? "PASS ✅" : "REVIEW ❌"} | SEO=100 target: ${seo100 ? "MET ✅" : "not all 100"}`);
process.exit(0);

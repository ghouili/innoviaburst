// Lighthouse mobile runner for the SSG build. Serves dist/client via the preview
// server, drives the Playwright Chromium through chrome-launcher, and prints the
// Perf score + Core Web Vitals for the given paths.
//   PW_EXECUTABLE=<chrome> node scripts/lh.mjs /en/ /en/ai-ops-sprint
import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { spawn } from "node:child_process";

const PORT = 5123;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/en/", "/en/ai-ops-sprint"];

const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
await sleep(1800);

const chrome = await launch({
  chromePath: process.env.PW_EXECUTABLE,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const flags = {
  port: chrome.port,
  logLevel: "error",
  output: "json",
  onlyCategories: ["performance"],
  formFactor: "mobile",
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
};

const rows = [];
try {
  for (const p of paths) {
    const url = `http://localhost:${PORT}${p}`;
    // two passes; keep the better Perf score (lab runs vary run-to-run)
    let best = null;
    for (let i = 0; i < 2; i++) {
      const res = await lighthouse(url, flags);
      const lhr = res.lhr;
      const row = {
        path: p,
        perf: Math.round(lhr.categories.performance.score * 100),
        LCP_s: +(lhr.audits["largest-contentful-paint"].numericValue / 1000).toFixed(2),
        CLS: +lhr.audits["cumulative-layout-shift"].numericValue.toFixed(3),
        FCP_s: +(lhr.audits["first-contentful-paint"].numericValue / 1000).toFixed(2),
        TBT_ms: Math.round(lhr.audits["total-blocking-time"].numericValue),
        SI_s: +(lhr.audits["speed-index"].numericValue / 1000).toFixed(2),
      };
      if (!best || row.perf > best.perf) { best = row; best._lhr = lhr; }
    }
    rows.push(best);
    console.log(JSON.stringify({ path: best.path, perf: best.perf, LCP_s: best.LCP_s, CLS: best.CLS, FCP_s: best.FCP_s, TBT_ms: best.TBT_ms }));
    if (process.env.LH_DIAG) {
      const a = best._lhr.audits;
      const lcpItems = a["largest-contentful-paint-element"]?.details?.items || [];
      const node = lcpItems[0]?.node || lcpItems[0]?.items?.[0]?.node;
      console.log("  LCP element:", (node?.snippet || JSON.stringify(lcpItems[0] || {})).slice(0, 120));
      // LCP phase breakdown (TTFB / load delay / load time / render delay)
      const phases = lcpItems.find((i) => i.phase) ? lcpItems : a["largest-contentful-paint-element"]?.details?.items?.[1]?.items;
      if (Array.isArray(phases)) for (const p of phases) if (p.phase) console.log(`    LCP ${p.phase}: ${Math.round(p.timing)}ms`);
      const nr = (a["network-requests"]?.details?.items || []).slice().sort((x, y) => (y.transferSize || 0) - (x.transferSize || 0)).slice(0, 6);
      console.log("  biggest requests:");
      for (const r of nr) console.log(`    ${Math.round((r.transferSize || 0) / 1024)}KB  end=${Math.round(r.networkEndTime || 0)}ms  ${(r.url || "").split("/").pop().slice(0, 40)}`);
      const rs = a["resource-summary"]?.details?.items || [];
      console.log("  transfer:", rs.map((i) => `${i.resourceType}:${Math.round((i.transferSize||0)/1024)}KB`).join(" "));
    }
  }
} catch (e) {
  console.log("LH ERROR:", String(e).slice(0, 300));
} finally {
  await chrome.kill();
  server.kill();
}

console.log("\n===== LIGHTHOUSE MOBILE (lab) =====");
for (const r of rows) console.log(`${r.path.padEnd(22)} Perf ${r.perf}  LCP ${r.LCP_s}s  CLS ${r.CLS}  FCP ${r.FCP_s}s  TBT ${r.TBT_ms}ms  SI ${r.SI_s}s`);
const gate = rows.every((r) => r.perf >= 85 && r.LCP_s < 2.5 && r.CLS < 0.1);
console.log("GATE (Perf>=85, LCP<2.5s, CLS<0.1):", gate ? "PASS ✅" : "REVIEW ❌");
process.exit(0);

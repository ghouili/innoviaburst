import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
const PORT = 5130;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FB = /connect\.facebook\.net|facebook\.com\/tr|fbevents\.js/i;
const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
let browser; const R = {};
try {
  await sleep(1500);
  browser = await chromium.launch({ headless: true, executablePath: process.env.PW_EXECUTABLE });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const hits = [];
  page.on("request", (r) => { if (FB.test(r.url())) hits.push(r.url()); });
  await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: "load" }).catch(() => {});
  await sleep(1800);
  R.bannerShown = await page.getByRole("button", { name: /accept all/i }).isVisible().catch(() => false);
  R.fbBeforeConsent = hits.length;
  await page.getByRole("button", { name: /accept all/i }).click().catch(() => {});
  await sleep(2000);
  R.fbAfterAccept = hits.length;
  await ctx.close();
} catch (e) { R.fatal = String(e).slice(0, 160); }
finally { if (browser) await browser.close().catch(() => {}); server.kill(); }
console.log("\n===== PHASE 11 CONSENT =====");
console.log(JSON.stringify(R));
console.log("VERDICT:", !R.fatal && R.bannerShown && R.fbBeforeConsent === 0 && R.fbAfterAccept > 0 ? "PASS ✅ (no FB pre-consent; loads on accept)" : "REVIEW ❌");
process.exit(0);

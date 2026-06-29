import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
const PORT = 5131;
const OUT = process.env.SHOT_DIR || ".";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
let browser;
try {
  await sleep(1500);
  browser = await chromium.launch({ headless: true, executablePath: process.env.PW_EXECUTABLE });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1400 }, deviceScaleFactor: 2 });

  // 1) Offer page: hero region — has the price badge, the cyan timeline label,
  //    "Best for" label, and the primary "Book a 15-min call" button.
  await page.goto(`http://localhost:${PORT}/en/ai-ops-sprint`, { waitUntil: "load" });
  await sleep(1200);
  const heroSection = page.locator("main section").first();
  await heroSection.screenshot({ path: `${OUT}/shot-offer-hero.png` });
  // tight shot of the primary CTA button
  const cta = page.getByRole("button", { name: /book a 15-min call/i }).first();
  if (await cta.count()) await cta.screenshot({ path: `${OUT}/shot-primary-button.png` });

  // 2) Home: the Offers section (#offers) — cards with "Best for", metric labels,
  //    "Most popular" badge, price, and the card CTA buttons.
  await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: "load" });
  await sleep(1200);
  const offers = page.locator("#offers");
  await offers.scrollIntoViewIfNeeded();
  await sleep(400);
  await offers.screenshot({ path: `${OUT}/shot-offers-cards.png` });

  await page.close();
  console.log("screenshots written to", OUT);
} catch (e) { console.log("SHOT ERR", String(e).slice(0, 200)); }
finally { if (browser) await browser.close().catch(() => {}); server.kill(); }
process.exit(0);

import { spawn } from "node:child_process";
import { legacyRedirects } from "./site-content.mjs";
const PORT = 5128;
const BASE = `http://localhost:${PORT}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn(process.execPath, ["scripts/preview-server.mjs"], { env: { ...process.env, PREVIEW_PORT: String(PORT) }, stdio: "ignore" });
await sleep(1500);

const hit = async (p, headers) => {
  const res = await fetch(BASE + p, { redirect: "manual", headers });
  return { status: res.status, loc: res.headers.get("location") };
};

const checks = [];
const ok = (name, cond, extra = "") => checks.push({ name, pass: !!cond, extra });

try {
  // 1) EVERY legacy redirect -> /en/* (301)
  const redirects = legacyRedirects();
  let red301 = 0, redBad = [];
  for (const [from, to] of Object.entries(redirects)) {
    const r = await hit(from);
    if (r.status === 301 && r.loc === to) red301++;
    else redBad.push(`${from}->${r.status} ${r.loc} (want ${to})`);
  }
  ok(`all ${Object.keys(redirects).length} legacy URLs 301 -> /en/*`, redBad.length === 0, redBad.slice(0, 5).join("; "));

  // 1b) "/" is content-negotiated (302), NOT a static 301 to /en/
  const nEn = await hit("/", { "Accept-Language": "en-US,en;q=0.9" });
  const nFr = await hit("/", { "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8" });
  const nCookie = await hit("/", { "Accept-Language": "en-US,en;q=0.9", Cookie: "locale=fr" });
  const nNone = await hit("/", {});
  ok(
    '"/" negotiates locale (302): en/fr/cookie/none',
    nEn.status === 302 && nEn.loc === "/en/" &&
      nFr.status === 302 && nFr.loc === "/fr/" &&
      nCookie.status === 302 && nCookie.loc === "/fr/" &&
      nNone.status === 302 && nNone.loc === "/en/",
    `en->${nEn.status} ${nEn.loc} | fr->${nFr.status} ${nFr.loc} | cookie(fr)->${nCookie.status} ${nCookie.loc} | none->${nNone.status} ${nNone.loc}`,
  );

  // 2) footer/link targets resolve (200)
  const targets = ["/en/", "/fr/", "/en/about", "/en/industries", "/en/works", "/en/automations", "/en/trust", "/en/subprocessors", "/en/resources", "/en/privacy", "/en/cookies", "/en/terms", "/en/lp/ai-automation"];
  const bad200 = [];
  for (const t of targets) { const r = await hit(t); if (r.status !== 200) bad200.push(`${t}->${r.status}`); }
  ok(`${targets.length} footer/page targets resolve 200`, bad200.length === 0, bad200.join("; "));

  // 3) no soft-404: unknown paths return real 404 (incl. old soft-404 sources like /contact, /offers, /solutions)
  const should404 = ["/en/this-does-not-exist", "/bogus-xyz", "/en/contact", "/en/offers", "/en/solutions", "/fr/nope"];
  const bad404 = [];
  for (const u of should404) { const r = await hit(u); if (r.status !== 404) bad404.push(`${u}->${r.status}`); }
  ok(`${should404.length} unknown paths return real 404 (no soft-404)`, bad404.length === 0, bad404.join("; "));
} catch (e) { ok("fatal", false, String(e).slice(0, 150)); }
finally { server.kill(); }

console.log("\n===== PHASE 11 STATUS / REDIRECTS / 404 =====");
for (const c of checks) console.log(`  ${c.pass ? "✓" : "✗"} ${c.name}${c.extra ? " — " + c.extra : ""}`);
console.log("\nVERDICT:", checks.every((c) => c.pass) ? "PASS ✅" : "REVIEW ❌");
process.exit(0);

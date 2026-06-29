// Post-build (Phase 10 perf): remove <link rel="modulepreload"> hints from the
// pre-rendered HTML.
//
// Why: the pages are SSG (full HTML) + hydrate. Vite emits high-priority
// modulepreload links for the client entry + chunks, which forces ~250KB of JS
// onto the critical path and competes with the LCP paint over a throttled mobile
// connection. The JS isn't needed to PAINT (content is server-rendered) — only to
// hydrate. Dropping the preload hints lets the hero/LCP render first; the JS still
// loads via the module <script> and hydrates (TBT stays minimal). Measured on
// mobile Lighthouse: LCP 3.5s -> 2.3s, Perf 86 -> 97, with TBT still <25ms.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("dist", "client");
const walk = (d) =>
  readdirSync(d).flatMap((e) => {
    const p = path.join(d, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });

let files = 0;
let links = 0;
for (const f of walk(ROOT)) {
  const html = readFileSync(f, "utf8");
  const out = html.replace(/<link[^>]+rel="modulepreload"[^>]*>\s*/g, () => {
    links++;
    return "";
  });
  if (out !== html) {
    writeFileSync(f, out, "utf8");
    files++;
  }
}
console.log(`[strip-modulepreload] removed ${links} modulepreload links from ${files} HTML files`);

// Local production-parity static server for Phase 1 verification.
// Mirrors nginx.prod.conf behavior so HTTP status codes (301 / 200 / 404) can
// be checked locally: applies the canonical legacyRedirects() map, serves the
// Vike pre-rendered files from dist/client, and returns a REAL 404 (with
// 404.html) for anything that wasn't pre-rendered.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { legacyRedirects } from "./site-content.mjs";

// gzip text assets (parity with nginx.prod.conf `gzip on`) so local Lighthouse
// measures representative transfer sizes, not raw bytes.
const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".xml", ".svg", ".txt", ".webmanifest"]);

const ROOT = path.resolve(process.cwd(), "dist", "client");
const PORT = Number(process.env.PREVIEW_PORT || 5055);
const REDIRECTS = legacyRedirects();

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const send = (res, status, body, type = "text/html; charset=utf-8") => {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
};

const tryFile = (urlPath) => {
  // try_files $uri $uri/index.html
  const candidates = [];
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, "");
  if (rel && !rel.endsWith("/")) candidates.push(path.join(ROOT, rel));
  candidates.push(path.join(ROOT, rel, "index.html"));
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];

  // 1) exact-match 301 redirects (locale migration)
  if (Object.prototype.hasOwnProperty.call(REDIRECTS, urlPath)) {
    res.writeHead(301, { Location: REDIRECTS[urlPath] });
    res.end();
    return;
  }

  // 2) serve pre-rendered file / directory index (gzip text like nginx)
  const file = tryFile(urlPath);
  if (file) {
    const ext = path.extname(file);
    let body = fs.readFileSync(file);
    const headers = { "Content-Type": MIME[ext] || "application/octet-stream" };
    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      body = zlib.gzipSync(body, { level: 6 });
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
    }
    res.writeHead(200, headers);
    res.end(body);
    return;
  }

  // 3) real 404 with the fully pre-rendered /en/404 page (matches nginx error_page)
  const notFound = path.join(ROOT, "en", "404", "index.html");
  const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : "Not Found";
  send(res, 404, body);
});

server.listen(PORT, () => {
  console.log(`[preview] serving ${ROOT} at http://localhost:${PORT}`);
});

import fs from "node:fs";
import path from "node:path";
import { sitemapRoutes, siteUrl } from "./site-content.mjs";

const targetBase = process.env.SEO_BASE_URL || siteUrl;
/** Origin the pages' canonicals must point at, regardless of where we fetch from. */
const canonicalBase = siteUrl.replace(/\/$/, "");
const outputDir = path.resolve(process.cwd(), "reports");
const timeoutMs = Number(process.env.SEO_TIMEOUT_MS || 15000);

/**
 * Audit every indexable, locale-prefixed URL (/en/*, /fr/*).
 *
 * This used to import `allRoutes`, which the locale migration removed — the
 * script had been crashing on import ever since. sitemapRoutes() is the right
 * successor: it is the same list the sitemap advertises, so it excludes the
 * noindex routes (/works, /lp/*, /404) that deliberately don't carry full SEO
 * metadata and would otherwise report as false failures.
 *
 * Note this audits a LIVE origin — `siteUrl` by default. Point it at a local
 * preview with SEO_BASE_URL to audit the build you just produced.
 */
const normalisedRoutes = (() => {
  const seen = new Set();
  return sitemapRoutes()
    .map((route) => ({ path: route.loc }))
    .filter((route) => {
      if (seen.has(route.path)) return false;
      seen.add(route.path);
      return true;
    });
})();

const getHtml = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "follow" });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(timeout);
  }
};

const extract = (html, pattern) => {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
};

const extractAllJsonLd = (html) => {
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts
    .map((match) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        return { parseError: error.message };
      }
    })
    .filter(Boolean);
};

const auditRoute = async (route) => {
  const url = `${targetBase.replace(/\/$/, "")}${route.path}`;
  const issues = [];

  try {
    const { response, text } = await getHtml(url);
    // react-helmet-async renders `<title data-rh="true">` — the old attribute-less
    // pattern matched nothing and reported every page as missing a title.
    const title = extract(text, /<title[^>]*>([^<]*)<\/title>/i);
    const description = extract(
      text,
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i
    );
    const canonical = extract(
      text,
      /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i
    );
    const robots = extract(text, /<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    const jsonLd = extractAllJsonLd(text);

    if (!response.ok) {
      issues.push(`Status ${response.status}`);
    }

    if (!title) issues.push("Missing <title>");
    if (!description) issues.push("Missing meta description");
    // Canonicals are absolute production URLs by design, so they're checked
    // against the canonical origin (siteUrl) — not against wherever we fetched
    // from. Auditing a local preview otherwise flagged every correct canonical.
    if (!canonical) {
      issues.push("Missing canonical link");
    } else if (!canonical.startsWith(canonicalBase)) {
      issues.push(`Canonical mismatch (${canonical}, expected ${canonicalBase}/...)`);
    }
    if (jsonLd.length === 0) issues.push("Missing JSON-LD");
    if (text.length < 500) issues.push("HTML response too small; possible empty shell");

    return {
      path: route.path,
      url,
      status: response.status,
      ok: response.ok,
      title,
      description,
      canonical,
      robots,
      jsonLdCount: jsonLd.length,
      issues,
    };
  } catch (error) {
    issues.push(error.message || "Unknown fetch error");
    return {
      path: route.path,
      url,
      status: 0,
      ok: false,
      title: "",
      description: "",
      canonical: "",
      robots: "",
      jsonLdCount: 0,
      issues,
    };
  }
};

const run = async () => {
  const results = [];
  for (const route of normalisedRoutes) {
    const result = await auditRoute(route);
    results.push(result);
  }

  const failed = results.filter((item) => item.issues.length > 0);
  const summary = {
    scanned: normalisedRoutes.length,
    passed: results.length - failed.length,
    failed: failed.length,
    baseUrl: targetBase,
    timestamp: new Date().toISOString(),
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, "seo-verification.json"),
    JSON.stringify({ summary, results }, null, 2),
    "utf8"
  );

  const markdown = [
    `# SEO Verification Report`,
    `- Base URL: ${targetBase}`,
    `- Scanned: ${summary.scanned}`,
    `- Passed: ${summary.passed}`,
    `- Failed: ${summary.failed}`,
    `- Generated: ${summary.timestamp}`,
    "",
    "| Path | Status | Issues |",
    "| --- | --- | --- |",
    ...results.map((item) => {
      const status = item.ok ? "✅" : `❌ ${item.status}`;
      const issues = item.issues.length ? item.issues.join("; ") : "None";
      return `| ${item.path} | ${status} | ${issues} |`;
    }),
  ].join("\n");

  fs.writeFileSync(path.join(outputDir, "seo-verification.md"), markdown, "utf8");
  console.log(`SEO verification complete. ${summary.passed}/${summary.scanned} passed.`);
  console.log(`Reports written to ${outputDir}`);
};

run().catch((error) => {
  console.error("SEO verification failed:", error);
  process.exitCode = 1;
});

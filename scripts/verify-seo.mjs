import fs from "node:fs";
import path from "node:path";
import { allRoutes, siteUrl } from "./site-content.mjs";

const targetBase = process.env.SEO_BASE_URL || siteUrl;
const outputDir = path.resolve(process.cwd(), "reports");
const timeoutMs = Number(process.env.SEO_TIMEOUT_MS || 15000);

const normalisedRoutes = (() => {
  const seen = new Set();
  return allRoutes.filter((route) => {
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
    const title = extract(text, /<title>([^<]*)<\/title>/i);
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
    if (!canonical) {
      issues.push("Missing canonical link");
    } else if (!canonical.startsWith(targetBase.replace(/\/$/, ""))) {
      issues.push(`Canonical mismatch (${canonical})`);
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

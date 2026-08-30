import { defineConfig, type Connect, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import path from "path";
import { negotiateLocale } from "./src/lib/i18n-routing";

// TODO(post-launch, standalone task): upgrade to Vite 6 + newest Vike (0.4.26x+)
// and switch build/dev/preview to the `vike` CLI. Vike is pinned to exactly
// 0.4.235 (last Vite-5-compatible release) — see package.json (no caret).
// @vitejs/plugin-react-swc already supports Vite 6/7, so the bump is isolated.

/**
 * Dev/preview parity with the `location = /` block in nginx.prod.conf: the site
 * root is content-negotiated per visitor (302 + Vary), never rendered.
 *
 * Without this the dev server hands "/" to Vike's catch-all page, react-router
 * refuses it ("<Router basename="/en"> is not able to match the URL /") and the
 * page comes back blank with a 200 — the redirect only existed in nginx and
 * scripts/preview-server.mjs, so it was missing from `npm run dev`.
 */
function rootLocaleRedirect(): PluginOption {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const [pathname, ...rest] = (req.url || "/").split("?");
    if (pathname !== "/") return next();

    const rawCookie = /(?:^|;\s*)locale=([^;]*)/.exec(req.headers.cookie || "")?.[1] ?? "";
    const locale = negotiateLocale(req.headers["accept-language"] ?? "", decodeURIComponent(rawCookie));
    const query = rest.length ? `?${rest.join("?")}` : "";

    res.writeHead(302, {
      Location: `/${locale}/${query}`,
      Vary: "Accept-Language, Cookie",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    res.end();
  };

  return {
    name: "ib:root-locale-redirect",
    enforce: "pre", // must run before Vike claims "/" with its catch-all route
    configureServer: (server) => void server.middlewares.use(middleware),
    configurePreviewServer: (server) => void server.middlewares.use(middleware),
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
    // In production nginx proxies /api/ to the lead API. Mirror that here so
    // form submissions are testable in local dev instead of 404ing.
    //
    // The API is a SEPARATE process: run `npm run dev:api` alongside `npm run
    // dev`. Without it the proxy would otherwise surface a bare ECONNREFUSED
    // stack trace, which says nothing about what to do, so the handler below
    // turns it into an explicit instruction.
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${process.env.API_PORT || 3000}`,
        changeOrigin: false,
        configure: (proxy) => {
          proxy.on("error", (err: NodeJS.ErrnoException, _req, res) => {
            const down = err?.code === "ECONNREFUSED";
            if (down) {
              console.warn(
                "\n[dev] The lead API is not running, so form submissions cannot be " +
                  "delivered.\n      Start it in a second terminal:  npm run dev:api\n",
              );
            } else {
              console.warn(`\n[dev] Lead API proxy error: ${err?.message ?? err}\n`);
            }
            // Answer the request so the form shows its own error state rather
            // than hanging until the browser times out.
            const response = res as unknown as {
              writeHead?: (status: number, headers: Record<string, string>) => void;
              end?: (body?: string) => void;
              destroy?: () => void;
            };
            if (typeof response.writeHead !== "function") {
              response.destroy?.();
              return;
            }
            response.writeHead(503, { "Content-Type": "application/json" });
            response.end?.(
              JSON.stringify({
                ok: false,
                error: down ? "lead_api_not_running" : "lead_api_unreachable",
              }),
            );
          });
        },
      },
    },
  },
  plugins: [rootLocaleRedirect(), react(), vike()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    // react-helmet-async ships CommonJS; bundle it into the SSR build so its
    // named exports resolve under Node ESM during pre-rendering.
    noExternal: ["react-helmet-async"],
  },
  // NOTE: explicit vendor manualChunks is a no-op here — Vike 0.4.235 manages
  // chunking itself and overrides output.manualChunks. The Phase 10 perf wins
  // came from self-hosted fonts, WebP images, removing dead deps, and the
  // postbuild `strip-modulepreload` step (keeps the JS off the LCP critical path).
}));

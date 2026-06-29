import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import path from "path";

// TODO(post-launch, standalone task): upgrade to Vite 6 + newest Vike (0.4.26x+)
// and switch build/dev/preview to the `vike` CLI. Vike is pinned to exactly
// 0.4.235 (last Vite-5-compatible release) — see package.json (no caret).
// @vitejs/plugin-react-swc already supports Vite 6/7, so the bump is isolated.

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [react(), vike()],
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

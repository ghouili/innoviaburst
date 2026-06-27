import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import path from "path";

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
  // NOTE: vendor manualChunks removed for Vike (which requires a function and
  // manages chunking itself). Route/vendor code-splitting is revisited in
  // Phase 10 (performance).
}));

import type { Config } from "vike/types";

// Global Vike configuration. The render hooks (+onRenderHtml / +onRenderClient)
// are auto-detected. Server Routing (Vike default) is used: Vike SSR/SSG's the
// initial document and hydrates it; react-router then owns client-side
// navigation within the loaded SPA.
export default {
  prerender: true,
  passToClient: [],
} satisfies Config;

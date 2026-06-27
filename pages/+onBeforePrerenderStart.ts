export { onBeforePrerenderStart };

import { prerenderUrls } from "../scripts/site-content.mjs";

// Provide Vike the explicit list of locale-prefixed URLs to pre-render (SSG).
// The catch-all route can't be enumerated automatically, so we supply it here.
async function onBeforePrerenderStart(): Promise<string[]> {
  return prerenderUrls();
}

export { onBeforePrerenderStart };

// "/" is the only URL of this page. Declared explicitly (rather than relying on
// auto-discovery) because the pages/-level hook that enumerates the locale URLs
// is inherited by every page — this override keeps those URLs with the catch-all
// page and pre-renders the root shell to dist/client/index.html.
async function onBeforePrerenderStart(): Promise<string[]> {
  return ["/"];
}

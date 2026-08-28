export { onRenderClient };

import type { OnRenderClientAsync } from "vike/types";

// The root document is a redirect shell, not an app page: there is no #root to
// hydrate and no router (react-router's basename is a locale prefix, which "/"
// by definition doesn't have). Overriding the global hook with a no-op keeps the
// app bundle — and any hydration error — out of this page. The redirect itself
// runs from the inline <head> script (see redirect-script.ts).
const onRenderClient: OnRenderClientAsync = async () => {};

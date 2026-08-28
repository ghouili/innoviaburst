import type { PageContext } from "vike/types";

// Catch-all route: this page renders the react-router app for every URL except
// the bare site root, which belongs to the pre-rendered redirect shell in
// pages/root (a static Route String already outranks this function — declining
// "/" here makes the split explicit and keeps the two pages from ever competing).
// react-router (via basename + <Routes>) resolves the concrete page. The list
// of URLs to pre-render is provided by +onBeforePrerenderStart.
export default (pageContext: PageContext) => pageContext.urlPathname !== "/";

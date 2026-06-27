export { Page };

import "@/index.css";
import NotFound from "@/pages/NotFound";

// Vike renders this page for unmatched URLs and emits it as dist/client/404.html
// during pre-rendering. nginx serves that file with a real 404 status for any
// URL that wasn't pre-rendered. It renders inside the same router/helmet shell
// supplied by the render hooks, so <SeoHead> (noindex) and <Navbar>/<Footer>
// links work normally.
function Page() {
  return <NotFound />;
}

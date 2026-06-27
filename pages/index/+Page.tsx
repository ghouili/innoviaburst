export { Page };

import { AppShell } from "@/App";

// Single Vike page that renders the react-router application. The render hooks
// wrap it in the router (StaticRouter on the server / BrowserRouter on the
// client) so react-router resolves the actual route from the URL.
function Page() {
  return <AppShell />;
}

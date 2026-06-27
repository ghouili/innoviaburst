export { onRenderClient };

import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import type { OnRenderClientAsync } from "vike/types";
import i18n from "@/i18n";
import { basenameFor, getLocaleFromPath } from "@/lib/i18n-routing";

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const Page = (pageContext as { Page?: () => JSX.Element }).Page;
  if (!Page) return;

  const locale = getLocaleFromPath(window.location.pathname);
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }

  const root = document.getElementById("root");
  if (!root) return;

  hydrateRoot(
    root,
    <HelmetProvider>
      <BrowserRouter
        basename={basenameFor(locale)}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Page />
      </BrowserRouter>
    </HelmetProvider>,
  );
};

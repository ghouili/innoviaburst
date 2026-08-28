export { onRenderHtml };

import { renderToString } from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { ROOT_REDIRECT_SCRIPT } from "./redirect-script";

// Page-scoped override of the app's onRenderHtml: the root is a static redirect
// shell, so it skips helmet, i18n and the router entirely (StaticRouter can't
// match "/" — its basename is always a locale prefix). Nothing here redirects
// anything but the exact "/" URL; /en/ and /fr/ keep the app renderer.
//
// hreflang tells search engines which localized document to serve for whom;
// there is deliberately NO canonical tag — a redirect shell is not a page that
// should consolidate signals onto itself.
const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const Page = (pageContext as { Page?: () => JSX.Element }).Page;
  const bodyHtml = Page ? renderToString(<Page />) : "";

  return escapeInject`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InnoviaBurst</title>
    <!-- No-JS fallback: browsers without JS land on the default locale after 1s. -->
    <meta http-equiv="refresh" content="1; url=/en/" />
    <link rel="alternate" hreflang="en" href="https://innoviaburst.com/en/" />
    <link rel="alternate" hreflang="fr" href="https://innoviaburst.com/fr/" />
    <link rel="alternate" hreflang="x-default" href="https://innoviaburst.com/en/" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <script>${dangerouslySkipEscape(ROOT_REDIRECT_SCRIPT)}</script>
  </head>
  <body>${dangerouslySkipEscape(bodyHtml)}</body>
</html>`;
};

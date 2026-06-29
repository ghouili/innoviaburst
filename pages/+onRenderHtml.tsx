export { onRenderHtml };

import { renderToString } from "react-dom/server";
import { HelmetProvider, type FilledContext } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import i18n from "@/i18n";
import { basenameFor, getLocaleFromPath, DEFAULT_LOCALE } from "@/lib/i18n-routing";

// Static <head> content ported from index.html. Title/description/canonical/OG
// /Twitter/JSON-LD are NOT here — they are owned per-page by <SeoHead> (helmet)
// so each route gets unique, server-rendered metadata.
const STATIC_HEAD = `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="google-site-verification" content="ANEc-Pb3kIwnJgkroXd99Dc3CcBdDOqzKwR8RrfD86E" />
    <meta name="author" content="Innoviaburst" />
    <meta name="twitter:site" content="@Innoviaburst" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
    <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" /></noscript>
    <!-- Meta Pixel is NOT injected here. Deny-by-default: it loads client-side
         ONLY after explicit marketing consent (src/lib/meta-pixel.ts, gated by
         CookieConsent) — no Meta/Facebook network request fires before opt-in.
         The old no-JS tracking beacon was removed too (it can't be consent-gated). -->`;

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const Page = (pageContext as { Page?: () => JSX.Element }).Page;
  const pathname = pageContext.urlPathname || `/${DEFAULT_LOCALE}/`;
  const locale = getLocaleFromPath(pathname);

  // Sequential prerender / SSR — set the request language before rendering.
  await i18n.changeLanguage(locale);

  const helmetContext = {} as FilledContext;
  const appHtml = Page
    ? renderToString(
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={pathname} basename={basenameFor(locale)}>
            <Page />
          </StaticRouter>
        </HelmetProvider>,
      )
    : "";

  const { helmet } = helmetContext;
  const headTags = helmet
    ? dangerouslySkipEscape(
        `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}`,
      )
    : dangerouslySkipEscape("");

  return escapeInject`<!DOCTYPE html>
<html lang="${locale}">
  <head>${dangerouslySkipEscape(STATIC_HEAD)}
    ${headTags}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};

/**
 * Helpers for homepage-section links written as flat hrefs ("/#offers").
 *
 * These MUST go through react-router's <Link>, never a raw <a href="/#offers">:
 * a raw absolute href bypasses the router basename, so it resolves to the bare
 * site root instead of "/fr/" — the root then re-runs locale negotiation and can
 * drop a French visitor into /en/. Building a `To` object here keeps the
 * basename (and therefore the locale) applied to the rendered href, so
 * middle-click, "open in new tab", no-JS and crawlers all stay in-locale too.
 */

/** True for internal homepage-section links like "/#offers". */
export function isHashLink(href: string): boolean {
  return href.startsWith("/#");
}

/** The section id behind a hash link ("/#offers" -> "offers"). */
export function hashSectionId(href: string): string {
  return href.split("#")[1] ?? "";
}

/**
 * Router props for a hash link. `to` keeps the locale prefix on the href;
 * `state.scrollTo` is what the homepage reads to scroll after navigating.
 */
export function hashLinkProps(href: string) {
  const sectionId = hashSectionId(href);
  return {
    to: { pathname: "/", hash: `#${sectionId}` },
    state: { scrollTo: sectionId },
  } as const;
}

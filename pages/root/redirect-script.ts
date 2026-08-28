export { ROOT_REDIRECT_SCRIPT };

/**
 * Inline <head> script for the pre-rendered site root (dist/client/index.html).
 *
 * The root document is a redirect shell only: it sends the visitor to the
 * locale-prefixed site (/en/ or /fr/) that is actually pre-rendered. It ships as
 * a raw string (not bundled client code) so the redirect runs during HTML parse,
 * before any module is fetched.
 *
 * Loop-prevention rules baked in — every one of them matters because /en/ and
 * /fr/ are real pages that must never bounce back here:
 *   1. it runs ONLY on the exact root path ("/"), so it is inert if this markup
 *      is ever served from another URL;
 *   2. the target is always "/en/" or "/fr/" — never "/" — so the destination
 *      can't re-trigger this script;
 *   3. if the computed target already equals the current path, it does nothing.
 *
 * Language preference order: the explicit choice the visitor made in the app
 * (localStorage "lang", i18next's own "i18nextLng" cache, or the `locale` cookie
 * written by <LanguageSwitcher> — the same cookie nginx negotiates on), then the
 * browser's language, then English. Every storage read is wrapped: localStorage
 * throws outright in some privacy modes.
 *
 * The no-JS path is the <meta http-equiv="refresh"> in +onRenderHtml.
 */
const ROOT_REDIRECT_SCRIPT = `
(function () {
  var EN = "/en/";
  var FR = "/fr/";

  // 1. Root-only guard — do nothing anywhere else.
  if (window.location.pathname !== "/") return;

  function normalize(value) {
    var code = String(value || "").trim().toLowerCase().slice(0, 2);
    return code === "fr" || code === "en" ? code : "";
  }

  function stored(key) {
    try {
      return normalize(window.localStorage.getItem(key));
    } catch (e) {
      return "";
    }
  }

  function cookie(name) {
    try {
      var match = new RegExp("(?:^|; )" + name + "=([^;]*)").exec(document.cookie || "");
      return match ? normalize(decodeURIComponent(match[1])) : "";
    } catch (e) {
      return "";
    }
  }

  var lang =
    stored("lang") ||
    stored("i18nextLng") ||
    cookie("locale") ||
    normalize((navigator.languages && navigator.languages[0]) || navigator.language);

  // 2. Always a locale prefix with a trailing slash — never "/" itself.
  var target = lang === "fr" ? FR : EN;

  // 3. Never replace the current path with itself.
  if (target === window.location.pathname) return;

  window.location.replace(target + window.location.search + window.location.hash);
})();
`;

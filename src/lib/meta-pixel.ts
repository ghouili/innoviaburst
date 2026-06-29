/**
 * Consent-gated Meta Pixel loader (Phase 9 — GDPR/PECR).
 *
 * Deny-by-default: the Pixel is NOT in the document head. NOTHING from
 * connect.facebook.net / facebook.com/tr loads until the user grants marketing
 * consent (CookieConsent calls loadMetaPixel() only then). Idempotent — safe to
 * call on every consent apply / reload; it injects the loader at most once.
 *
 * Set VITE_META_PIXEL_ID to override / disable (empty string disables entirely).
 */
const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? "722865524230512";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let injected = false;

/** Load the Meta Pixel + fire the initial PageView. No-op if already loaded or no ID. */
export function loadMetaPixel(): void {
  if (injected || typeof window === "undefined" || !PIXEL_ID) return;
  injected = true;

  if (!window.fbq) {
    const fbq = function (this: unknown, ...args: unknown[]) {
      fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue!.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(script, first);
  }

  window.fbq?.("init", PIXEL_ID);
  window.fbq?.("track", "PageView");
}

/** True once the Pixel has been injected this session. */
export const isMetaPixelLoaded = (): boolean => injected;

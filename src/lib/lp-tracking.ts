/**
 * Consent-gated conversion tracking for the paid-ads landing pages (/lp/*).
 *
 * Deny-by-default, exactly like the Meta Pixel loader: NOTHING is sent to any
 * ad/analytics vendor until the visitor has granted the matching consent in the
 * cookie banner. We read the SAME consent record that CookieConsent writes
 * (`innoviaburst_cookie_consent`), so this can never drift from the banner.
 *
 *   • Meta (fbq)      → fires ONLY with `marketing` consent. (fbq itself only
 *                       exists after loadMetaPixel(), which is also gated on
 *                       marketing consent — this is a second, explicit guard.)
 *   • GA4 (gtag/dataLayer) → fires ONLY with `analytics` consent. No GA vendor
 *                       is wired yet, so these calls are no-ops until one is
 *                       added; the gate is already correct for when it is.
 *
 * A generic in-page `CustomEvent("analytics")` is still dispatched for every
 * conversion (matching the rest of the app's event bus). That event is purely
 * in-page — it makes NO network request — so dispatching it pre-consent leaks
 * nothing; only the vendor calls below are gated.
 */

type ConsentPrefs = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

const CONSENT_KEY = "innoviaburst_cookie_consent";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/** Read the persisted consent record, or null if the visitor hasn't chosen yet. */
function readConsent(): ConsentPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { preferences?: ConsentPrefs };
    return parsed?.preferences ?? null;
  } catch {
    return null;
  }
}

/** The conversions this landing page can report. */
export type LpConversion = "lead_submit" | "booking_click";

/**
 * Map our internal conversion names to the vendor-standard event names.
 *  - lead_submit  → "Lead": a completed scope-request form submit.
 *  - booking_click → "Contact": an INTENT signal fired when the visitor opens
 *    the "book a call" flow. We deliberately use "Contact" (not "Schedule")
 *    because the booking modal is a stub — no appointment is actually booked —
 *    so reporting "Schedule" would train ad optimization on intent, not a real
 *    booking. Move this to a completed-booking handler once booking is live.
 */
const META_EVENT: Record<LpConversion, string> = {
  lead_submit: "Lead",
  booking_click: "Contact",
};

/**
 * Report a landing-page conversion. Consent-gated per vendor; safe to call from
 * anywhere (no-ops on the server). Pass small, non-PII params only.
 */
export function trackLpConversion(
  event: LpConversion,
  params: Record<string, string | number | boolean> = {},
): void {
  if (typeof window === "undefined") return;

  // 1) In-page event bus (no network) — always, for parity with the app.
  window.dispatchEvent(
    new CustomEvent("analytics", { detail: { event, ...params } }),
  );

  const consent = readConsent();
  if (!consent) return; // pre-consent → nothing leaves the page.

  // 2) Meta Pixel — marketing consent only.
  if (consent.marketing && typeof window.fbq === "function") {
    window.fbq("track", META_EVENT[event], params);
  }

  // 3) GA4 — analytics consent only. gtag if present, else dataLayer push.
  if (consent.analytics) {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
  }
}

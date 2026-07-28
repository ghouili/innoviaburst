/**
 * Abstract "product view" for the offer sticky card — a navy app frame showing
 * the three things every MVP ships with: auth, a chart, a user list.
 *
 * Deliberately abstract: no invented screenshots, no fake metrics, no product
 * name. It reads as "this is what a shipped app looks like" without claiming a
 * specific client build. Purely decorative, so it is hidden from assistive tech
 * — the card's text carries all the meaning.
 *
 * One orange accent only (the auth submit button), per the brand rule that
 * orange is for accents, never for surfaces.
 */
export function OfferProductVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 150"
      className={`w-full h-auto ${className}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {/* App frame */}
      <rect x="0" y="0" width="320" height="150" rx="10" fill="hsl(var(--deep-blue-dark))" />

      {/* Title bar */}
      <rect x="0" y="0" width="320" height="20" rx="10" fill="hsl(215 60% 24%)" />
      <rect x="0" y="14" width="320" height="6" fill="hsl(215 60% 24%)" />
      <circle cx="14" cy="10" r="3" fill="hsl(210 30% 45%)" />
      <circle cx="26" cy="10" r="3" fill="hsl(210 30% 45%)" />
      <circle cx="38" cy="10" r="3" fill="hsl(210 30% 45%)" />

      {/* Panel 1 — auth */}
      <rect x="12" y="32" width="88" height="104" rx="7" fill="hsl(215 55% 29%)" />
      <circle cx="56" cy="52" r="9" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" />
      <path d="M50 52a6 6 0 0 1 12 0" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />
      <rect x="24" y="72" width="64" height="8" rx="4" fill="hsl(210 35% 44%)" />
      <rect x="24" y="86" width="64" height="8" rx="4" fill="hsl(210 35% 44%)" />
      {/* the single orange accent — the submit action */}
      <rect x="24" y="106" width="64" height="14" rx="7" fill="hsl(var(--orange))" />

      {/* Panel 2 — chart */}
      <rect x="110" y="32" width="98" height="104" rx="7" fill="hsl(215 55% 29%)" />
      <rect x="122" y="44" width="34" height="6" rx="3" fill="hsl(210 35% 44%)" />
      <rect x="122" y="104" width="14" height="20" rx="3" fill="hsl(var(--accent))" opacity="0.55" />
      <rect x="142" y="92" width="14" height="32" rx="3" fill="hsl(var(--accent))" opacity="0.7" />
      <rect x="162" y="78" width="14" height="46" rx="3" fill="hsl(var(--accent))" opacity="0.85" />
      <rect x="182" y="64" width="14" height="60" rx="3" fill="hsl(var(--accent))" />

      {/* Panel 3 — user list */}
      <rect x="218" y="32" width="90" height="104" rx="7" fill="hsl(215 55% 29%)" />
      <circle cx="234" cy="52" r="7" fill="hsl(210 35% 44%)" />
      <rect x="248" y="48" width="46" height="7" rx="3.5" fill="hsl(210 35% 44%)" />
      <circle cx="234" cy="78" r="7" fill="hsl(210 35% 44%)" />
      <rect x="248" y="74" width="46" height="7" rx="3.5" fill="hsl(210 35% 44%)" />
      <circle cx="234" cy="104" r="7" fill="hsl(210 35% 44%)" />
      <rect x="248" y="100" width="46" height="7" rx="3.5" fill="hsl(210 35% 44%)" />
    </svg>
  );
}

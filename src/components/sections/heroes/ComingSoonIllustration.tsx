import { useId } from "react";

/**
 * Decorative "coming soon / under construction" illustration.
 *
 * Ported from the Claude Design project "InnoviaBurst coming soon
 * illustration". Modular blocks wired together along a dashed trace, with a
 * fourth module settling into an empty slot and a single orange spark marking
 * the point still being worked on.
 *
 * Two deliberate departures from the design file's own React export:
 *
 *  - Its keyframes lived in a `<style>{CSS}</style>` child. On this SSG site
 *    that is the shape that produced React #418/#425, so every keyframe lives
 *    in index.css instead and this component only references class names.
 *  - Its colours were hard-coded hex. They are re-expressed here through the
 *    brand tokens, so the illustration follows the palette rather than pinning
 *    a copy of it.
 *
 * The trace reuses the shared `.animate-dash-flow` utility and the pulse ring
 * reuses `.animate-spark`; only settle, shimmer and spark-travel are new. All
 * of them collapse to a clean static composition under prefers-reduced-motion.
 *
 * Decorative only: aria-hidden, with no meaningful text baked into the graphic.
 */

const TRACE =
  "M 4,236 H 84 Q 104,236 104,216 V 172 Q 104,152 124,152 H 236 Q 256,152 256,172 V 216 Q 256,236 276,236 H 388 Q 408,236 408,216 V 172 Q 408,152 428,152 H 504";

export interface ComingSoonIllustrationProps {
  className?: string;
}

export function ComingSoonIllustration({ className = "" }: ComingSoonIllustrationProps) {
  // Namespaced ids so two instances on one page cannot collide over defs.
  // useId is stable across server render and hydration.
  const uid = useId().replace(/:/g, "");
  const blue = `${uid}-blue`;
  const shim = `${uid}-shim`;
  const shadow = `${uid}-shadow`;
  const glow = `${uid}-glow`;
  const clip = `${uid}-clip`;

  const cardFill = "hsl(var(--card))";
  const cardStroke = "hsl(var(--deep-blue-dark) / 0.12)";
  const barStrong = "hsl(var(--accent) / 0.3)";
  const barSoft = "hsl(var(--accent) / 0.14)";

  return (
    <div aria-hidden="true" className={`mx-auto w-full max-w-[640px] ${className}`}>
      <svg
        viewBox="0 104 520 180"
        role="presentation"
        focusable="false"
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <linearGradient id={blue} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--secondary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient id={shim} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(var(--card))" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(var(--card))" stopOpacity="0.75" />
            <stop offset="100%" stopColor="hsl(var(--card))" stopOpacity="0" />
          </linearGradient>
          <filter id={shadow} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="hsl(var(--deep-blue-dark))" floodOpacity="0.14" />
          </filter>
          <filter id={glow} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Shimmer is clipped to the three assembled modules only */}
          <clipPath id={clip}>
            <rect x="16" y="208" width="76" height="56" rx="13" />
            <rect x="132" y="120" width="96" height="64" rx="15" />
            <rect x="284" y="204" width="96" height="64" rx="15" />
          </clipPath>
        </defs>

        {/* Trace: static rail, then the flowing dashes on top. The "7 5" pattern
            matches the -24 shift in the shared dashFlow keyframe, so the loop
            repeats without jumping. */}
        <path d={TRACE} fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="4" strokeLinecap="round" />
        <path
          className="animate-dash-flow"
          d={TRACE}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="7 5"
        />

        {/* The empty slot the incoming module lands in */}
        <rect
          x="424"
          y="120"
          width="88"
          height="64"
          rx="15"
          fill="hsl(var(--muted) / 0.45)"
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeDasharray="7 7"
          strokeOpacity="0.55"
        />

        {/* Assembled modules */}
        <g filter={`url(#${shadow})`}>
          <rect x="16" y="208" width="76" height="56" rx="13" fill={cardFill} stroke={cardStroke} />
          <rect x="132" y="120" width="96" height="64" rx="15" fill={cardFill} stroke={cardStroke} />
          <rect x="284" y="204" width="96" height="64" rx="15" fill={cardFill} stroke={cardStroke} />
        </g>

        <rect x="28" y="220" width="16" height="16" rx="5" fill={`url(#${blue})`} />
        <rect x="28" y="244" width="42" height="6" rx="3" fill={barStrong} />

        <rect x="146" y="134" width="18" height="18" rx="5" fill={`url(#${blue})`} />
        <rect x="146" y="162" width="62" height="6" rx="3" fill={barStrong} />
        <rect x="146" y="174" width="38" height="6" rx="3" fill={barSoft} />

        <rect x="298" y="218" width="18" height="18" rx="5" fill="hsl(var(--accent))" />
        <rect x="298" y="246" width="62" height="6" rx="3" fill={barStrong} />
        <rect x="298" y="258" width="38" height="6" rx="3" fill={barSoft} />

        {/* Progress shimmer sweeping across the assembled modules */}
        <g clipPath={`url(#${clip})`}>
          <rect className="ib-cs-shimmer" x="-140" y="100" width="140" height="200" fill={`url(#${shim})`} />
        </g>

        {/* The module settling into the open slot */}
        <g className="ib-cs-settle">
          <rect
            x="424"
            y="120"
            width="88"
            height="64"
            rx="15"
            fill={cardFill}
            stroke={cardStroke}
            filter={`url(#${shadow})`}
          />
          <rect x="438" y="134" width="18" height="18" rx="5" fill={`url(#${blue})`} />
          <rect x="438" y="162" width="54" height="6" rx="3" fill={barStrong} />
          <rect x="438" y="174" width="32" height="6" rx="3" fill={barSoft} />
        </g>

        {/* The single high-contrast accent: the point still in progress */}
        <circle cx="424" cy="152" r="6" fill="hsl(var(--orange))" />
        <circle
          className="animate-spark"
          cx="424"
          cy="152"
          r="6"
          fill="none"
          stroke="hsl(var(--orange))"
          strokeWidth="2"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />

        {/* Sparks travelling the trace. offset-path is CSS, so the path is
            repeated here as a custom property the stylesheet consumes. */}
        <circle
          className="ib-cs-spark"
          r="5"
          fill="hsl(var(--orange))"
          filter={`url(#${glow})`}
          style={{ offsetPath: `path("${TRACE}")` }}
        />
        <circle
          className="ib-cs-spark"
          r="2.5"
          fill="hsl(var(--orange-light))"
          style={{ offsetPath: `path("${TRACE}")`, animationDelay: "-0.18s" }}
        />
      </svg>
    </div>
  );
}

export default ComingSoonIllustration;

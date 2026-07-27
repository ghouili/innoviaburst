import { cn } from "@/lib/utils";

interface TrainingRoomVisualProps {
  className?: string;
}

/**
 * Training-room schematic for the homepage Training band: a screen running an
 * automation workflow (trigger → branch → action) with three learners seated in
 * front of it.
 *
 * Decorative only — every claim it makes is already in the section copy, so it
 * is `aria-hidden` and carries no label (same treatment as the hero panel).
 *
 * All fills come from the brand tokens rather than literal hex, so the piece
 * follows the palette (including dark mode) instead of drifting from it. The
 * dashed connectors and status dots animate via `.animate-dash-flow` /
 * `.animate-spark`, both of which are disabled under `prefers-reduced-motion`.
 */
export function TrainingRoomVisual({ className }: TrainingRoomVisualProps) {
  return (
    <svg
      viewBox="0 0 560 470"
      className={cn("h-auto block", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ibTrainBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--secondary))" />
          <stop offset="1" stopColor="hsl(var(--cyan))" />
        </linearGradient>
        <linearGradient id="ibTrainNavy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--deep-blue-dark))" />
          <stop offset="1" stopColor="hsl(var(--secondary))" />
        </linearGradient>
        <linearGradient id="ibTrainOrange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(var(--orange))" />
          <stop offset="1" stopColor="hsl(var(--orange-light))" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <circle cx="286" cy="212" r="196" fill="hsl(var(--accent) / 0.08)" />
      <circle cx="286" cy="212" r="150" fill="hsl(var(--accent) / 0.14)" />

      {/* Screen shell + title bar */}
      <rect
        x="86" y="52" width="400" height="252" rx="16"
        fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"
      />
      <rect x="86" y="52" width="400" height="34" rx="16" fill="url(#ibTrainNavy)" />
      <rect x="86" y="72" width="400" height="14" fill="url(#ibTrainNavy)" />
      <circle cx="106" cy="69" r="4.5" fill="hsl(var(--card))" opacity=".55" />
      <circle cx="121" cy="69" r="4.5" fill="hsl(var(--card))" opacity=".35" />
      <circle cx="136" cy="69" r="4.5" fill="hsl(var(--orange))" />
      <rect x="152" y="63" width="120" height="12" rx="6" fill="hsl(var(--card))" opacity=".28" />

      {/* Workflow connectors */}
      <path
        d="M172 140 H236" fill="none" stroke="hsl(var(--cyan))" strokeWidth="2.5"
        strokeDasharray="7 5" className="animate-dash-flow"
      />
      <path
        d="M172 140 C 210 140, 210 214, 248 214" fill="none"
        stroke="hsl(var(--accent) / 0.45)" strokeWidth="2.5" strokeDasharray="7 5"
        className="animate-dash-flow" style={{ animationDuration: "2.7s" }}
      />
      <path
        d="M300 140 H 356" fill="none" stroke="hsl(var(--cyan))" strokeWidth="2.5"
        strokeDasharray="7 5" className="animate-dash-flow"
        style={{ animationDuration: "2.3s" }}
      />
      <path
        d="M312 214 C 344 214, 344 178, 372 178" fill="none"
        stroke="hsl(var(--orange) / 0.45)" strokeWidth="2.5" strokeDasharray="7 5"
        className="animate-dash-flow" style={{ animationDuration: "3s" }}
      />

      {/* Trigger node */}
      <rect x="118" y="118" width="56" height="44" rx="10" fill="url(#ibTrainBlue)" />
      <rect x="130" y="132" width="32" height="5" rx="2.5" fill="hsl(var(--card))" opacity=".85" />
      <rect x="130" y="143" width="20" height="5" rx="2.5" fill="hsl(var(--card))" opacity=".55" />

      {/* Branch node */}
      <rect
        x="238" y="118" width="64" height="44" rx="10"
        fill="hsl(var(--card))" stroke="hsl(var(--secondary))" strokeWidth="2.5"
      />
      <circle cx="256" cy="140" r="6" fill="hsl(var(--cyan))" />
      <rect x="268" y="132" width="24" height="5" rx="2.5" fill="hsl(var(--border))" />
      <rect x="268" y="143" width="16" height="5" rx="2.5" fill="hsl(var(--muted))" />

      {/* Secondary node */}
      <rect
        x="248" y="192" width="64" height="44" rx="10"
        fill="hsl(var(--card))" stroke="hsl(var(--accent) / 0.45)" strokeWidth="2.5"
      />
      <rect x="262" y="206" width="36" height="5" rx="2.5" fill="hsl(var(--border))" />
      <rect x="262" y="217" width="22" height="5" rx="2.5" fill="hsl(var(--muted))" />

      {/* Action node */}
      <rect x="356" y="156" width="60" height="44" rx="10" fill="url(#ibTrainOrange)" />
      <path d="M388 166 l-10 15 h8 l-4 12 12-16h-8z" fill="hsl(var(--primary-foreground))" />

      {/* Status dots */}
      <circle
        cx="404" cy="128" r="9" fill="hsl(var(--orange))" opacity=".85"
        className="animate-spark" style={{ transformOrigin: "404px 128px" }}
      />
      <circle
        cx="140" cy="212" r="6" fill="hsl(var(--cyan))" opacity=".7"
        className="animate-spark"
        style={{ transformOrigin: "140px 212px", animationDuration: "3.3s" }}
      />

      {/* Caption lines on screen */}
      <rect x="118" y="256" width="150" height="8" rx="4" fill="hsl(var(--border))" />
      <rect x="118" y="272" width="96" height="8" rx="4" fill="hsl(var(--muted))" />

      {/* Desk */}
      <rect x="60" y="330" width="440" height="14" rx="7" fill="hsl(var(--border))" />

      {/* Learners */}
      <g>
        <rect
          x="112" y="352" width="86" height="66" rx="10"
          fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"
        />
        <circle cx="155" cy="318" r="21" fill="url(#ibTrainBlue)" />
        <path d="M124 352 c0-18 14-28 31-28 s31 10 31 28z" fill="hsl(var(--deep-blue-dark))" />
        <rect x="128" y="368" width="54" height="6" rx="3" fill="hsl(var(--accent) / 0.12)" />
        <rect x="128" y="382" width="36" height="6" rx="3" fill="hsl(var(--muted))" />
      </g>
      <g>
        <rect
          x="237" y="352" width="86" height="66" rx="10"
          fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"
        />
        <circle cx="280" cy="314" r="23" fill="url(#ibTrainNavy)" />
        <path d="M248 352 c0-19 15-30 32-30 s32 11 32 30z" fill="hsl(var(--secondary))" />
        <rect x="253" y="368" width="54" height="6" rx="3" fill="hsl(var(--accent) / 0.12)" />
        <rect x="253" y="382" width="36" height="6" rx="3" fill="hsl(var(--muted))" />
      </g>
      <g>
        <rect
          x="362" y="352" width="86" height="66" rx="10"
          fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"
        />
        <circle cx="405" cy="318" r="21" fill="url(#ibTrainOrange)" />
        <path d="M374 352 c0-18 14-28 31-28 s31 10 31 28z" fill="hsl(var(--deep-blue-dark))" />
        <rect x="378" y="368" width="54" height="6" rx="3" fill="hsl(var(--accent) / 0.12)" />
        <rect x="378" y="382" width="36" height="6" rx="3" fill="hsl(var(--muted))" />
      </g>
    </svg>
  );
}

import { Bot, Code2, Workflow, Scale, CalendarDays, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Decorative hero visual for /training. It shows the four tracks plus the
// request-then-confirm booking model in one glance. Marked aria-hidden because
// every real claim lives in the surrounding copy, so there is no readable text
// here that would need translating. The only motion is the dashed connector,
// which index.css already disables under prefers-reduced-motion.
const LANES: { Icon: LucideIcon; accent: boolean }[] = [
  { Icon: Bot, accent: false },
  { Icon: Code2, accent: false },
  { Icon: Workflow, accent: false },
  { Icon: Scale, accent: true },
];

interface FourTracksVisualProps {
  className?: string;
}

export function FourTracksVisual({ className = "" }: FourTracksVisualProps) {
  return (
    <div
      className={`relative rounded-3xl border border-border bg-card/80 shadow-card p-6 sm:p-7 ${className}`}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 rounded-full bg-accent/10 blur-2xl" />

      <div className="relative space-y-3">
        {LANES.map(({ Icon, accent }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                accent ? "bg-gradient-cta" : "bg-gradient-blue"
              }`}
            >
              <Icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div
                className="h-2 rounded-full bg-muted-foreground/25"
                style={{ width: `${72 - i * 8}%` }}
              />
              <div
                className="h-2 rounded-full bg-muted-foreground/15"
                style={{ width: `${52 - i * 6}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Request -> confirm: you propose dates, we confirm an available slot. */}
      <div className="relative mt-6 pt-5 border-t border-border flex items-center gap-3">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((d) => (
            <div
              key={d}
              className="w-9 h-11 rounded-lg border border-border bg-background flex flex-col items-center justify-center gap-1"
            >
              <CalendarDays className="w-4 h-4 text-secondary" />
              <div className="h-1 w-4 rounded-full bg-muted-foreground/25" />
            </div>
          ))}
        </div>

        <svg width="36" height="12" viewBox="0 0 36 12" fill="none" className="shrink-0">
          <path
            d="M1 6 H31"
            stroke="hsl(var(--cyan))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 5"
            className="animate-dash-flow"
          />
          <path
            d="M28 2 L33 6 L28 10"
            stroke="hsl(var(--cyan))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="w-11 h-11 rounded-full bg-gradient-cta flex items-center justify-center shrink-0">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}

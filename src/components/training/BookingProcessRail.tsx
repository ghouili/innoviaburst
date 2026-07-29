import { CalendarPlus, CalendarCheck, GraduationCap, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

// One icon per booking step, in order: request dates, we confirm a slot,
// partner delivers. Falls back to the calendar icon if copy ever adds a step.
const STEP_ICONS: LucideIcon[] = [CalendarPlus, CalendarCheck, GraduationCap];

/**
 * Booking process as three icon-led cards on a connector: request dates, we
 * confirm, partner delivers. Each card carries a gradient icon chip, a large
 * ghost number, and the step copy; the final card is accented (orange) to mark
 * the outcome. A chevron sits in the gap between cards on desktop.
 *
 * The whole thing is static — no motion — so it renders identically with or
 * without prefers-reduced-motion and needs no JS of its own. Vertical on
 * mobile, three columns from `md`.
 */
export function BookingProcessRail({ steps }: { steps: Step[] }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <ol className="relative grid gap-6 md:grid-cols-3 md:gap-5">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const Icon = STEP_ICONS[i] ?? CalendarPlus;
        return (
          <li key={step.title} className="relative min-w-0">
            {/* Connector to the next card. Decorative, desktop only. */}
            {!isLast && (
              <span
                className="pointer-events-none absolute -right-4 top-9 z-10 hidden md:flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-secondary shadow-sm"
                aria-hidden="true"
              >
                <ChevronRight className="h-4 w-4" />
              </span>
            )}

            <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-shadow duration-200 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    isLast ? "bg-gradient-cta" : "bg-gradient-blue"
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                </span>
                <span
                  className="text-[2.75rem] font-bold leading-none text-muted-foreground/25 tabular-nums"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mt-5 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

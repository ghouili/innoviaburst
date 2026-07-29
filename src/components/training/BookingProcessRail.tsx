interface Step {
  title: string;
  description: string;
}

/**
 * Booking process as a horizontal rail: request dates, we confirm, partner
 * delivers.
 *
 * Node styling follows OfferTimelineRail (numbered nodes on a connector, final
 * node accented) so the two rails on the site read as one component family. The
 * connector uses the existing `.animate-dash-flow` utility, which index.css
 * already disables under prefers-reduced-motion, so the rail renders in its
 * final state with no motion there and needs no JS of its own.
 *
 * Vertical on mobile, horizontal from `md`.
 */
export function BookingProcessRail({ steps }: { steps: Step[] }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={step.title} className="relative min-w-0">
            <div className="flex items-center gap-3 md:block">
              <span
                className={`relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-4 ring-background ${
                  isLast ? "bg-gradient-cta text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Connector runs from this node to the next one. Decorative. */}
              {!isLast && (
                <>
                  <span
                    className="pointer-events-none absolute left-11 right-0 top-[22px] hidden md:block"
                    aria-hidden="true"
                  >
                    <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none" focusable="false">
                      <line
                        x1="4"
                        y1="1"
                        x2="100"
                        y2="1"
                        stroke="hsl(var(--secondary))"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                        strokeDasharray="7 5"
                        vectorEffect="non-scaling-stroke"
                        className="animate-dash-flow"
                      />
                    </svg>
                  </span>
                  <span
                    className="pointer-events-none absolute left-[21px] top-11 h-8 w-0.5 md:hidden"
                    aria-hidden="true"
                  >
                    <svg width="2" height="100%" viewBox="0 0 2 100" preserveAspectRatio="none" focusable="false">
                      <line
                        x1="1"
                        y1="0"
                        x2="1"
                        y2="100"
                        stroke="hsl(var(--secondary))"
                        strokeOpacity="0.45"
                        strokeWidth="2"
                        strokeDasharray="7 5"
                        vectorEffect="non-scaling-stroke"
                        className="animate-dash-flow"
                      />
                    </svg>
                  </span>
                </>
              )}

              <h3 className="text-base font-semibold text-foreground md:hidden">{step.title}</h3>
            </div>

            <h3 className="mt-4 hidden text-base font-semibold text-foreground md:block">{step.title}</h3>
            <p className="mt-2 pl-14 text-sm leading-relaxed text-muted-foreground md:pl-0">
              {step.description}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

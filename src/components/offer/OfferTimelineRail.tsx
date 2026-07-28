import { useEffect, useRef, useState } from "react";

interface TimelineStep {
  week: string;
  activities: string[];
}

/**
 * The delivery timeline as a rail: horizontal on desktop, vertical on mobile.
 *
 * The final node is the go-live node and is the only one in orange — it is the
 * outcome the reader is buying, and orange is reserved for exactly that kind of
 * accent in this design system.
 *
 * Motion (P1): the connecting stroke draws itself once the rail scrolls into
 * view, and the nodes fade up behind it. Three properties make that safe:
 *
 *  - SSR / no-JS renders the FINAL state (stroke fully drawn, nodes visible).
 *    The hidden state is only applied after `armed` flips in an effect, which
 *    never runs on the server — so a crawler or a JS-less visitor sees the
 *    finished rail, and hydration has nothing to mismatch on.
 *  - `prefers-reduced-motion: reduce` returns before arming, so the rail simply
 *    never animates — no transition is ever attached.
 *  - The observer disconnects after the first intersection; this animates once.
 */
export function OfferTimelineRail({ steps }: { steps: TimelineStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only ever true on the client, after we've confirmed motion is allowed.
  const pending = armed && !revealed;

  const strokeStyle = {
    strokeDasharray: 100,
    strokeDashoffset: pending ? 100 : 0,
    transition: armed ? "stroke-dashoffset 1100ms ease-out" : undefined,
  } as const;

  const nodeStyle = (i: number) => ({
    opacity: pending ? 0 : 1,
    transform: pending ? "translateY(6px)" : "none",
    transition: armed ? `opacity 420ms ease-out ${180 + i * 130}ms, transform 420ms ease-out ${180 + i * 130}ms` : undefined,
  });

  return (
    <div ref={ref}>
      {/* ---------- Horizontal rail (sm and up) ---------- */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* connector sits behind the node dots, inset by half a node width */}
          <div className="absolute left-0 right-0 top-[7px] px-[calc(50%/var(--rail-cols))]" style={{ ["--rail-cols" as string]: steps.length }}>
            <svg viewBox="0 0 100 2" preserveAspectRatio="none" className="w-full h-0.5" aria-hidden="true" focusable="false">
              <line x1="0" y1="1" x2="100" y2="1" pathLength={100} stroke="hsl(var(--border))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                pathLength={100}
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={strokeStyle}
              />
            </svg>
          </div>

          <ol className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <li key={i} className="min-w-0 text-center" style={nodeStyle(i)}>
                  <span
                    className={`mx-auto mb-4 block h-3.5 w-3.5 rounded-full ring-4 ring-background ${
                      isLast ? "bg-orange" : "bg-secondary"
                    }`}
                    aria-hidden="true"
                  />
                  <p className={`text-sm font-bold mb-2 ${isLast ? "text-orange-dark" : "text-accent-strong"}`}>
                    {step.week}
                  </p>
                  <ul className="space-y-1.5">
                    {step.activities.map((activity, j) => (
                      <li key={j} className="text-xs text-muted-foreground leading-snug text-balance">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* ---------- Vertical rail (mobile) ---------- */}
      <div className="sm:hidden">
        <div className="relative pl-7">
          <div className="absolute left-[6px] top-2 bottom-2 w-0.5">
            <svg viewBox="0 0 2 100" preserveAspectRatio="none" className="h-full w-0.5" aria-hidden="true" focusable="false">
              <line x1="1" y1="0" x2="1" y2="100" pathLength={100} stroke="hsl(var(--border))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                pathLength={100}
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={strokeStyle}
              />
            </svg>
          </div>

          <ol className="space-y-6">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <li key={i} className="relative" style={nodeStyle(i)}>
                  <span
                    className={`absolute -left-7 top-1 block h-3.5 w-3.5 rounded-full ring-4 ring-background ${
                      isLast ? "bg-orange" : "bg-secondary"
                    }`}
                    aria-hidden="true"
                  />
                  <p className={`text-sm font-bold mb-2 ${isLast ? "text-orange-dark" : "text-accent-strong"}`}>
                    {step.week}
                  </p>
                  <ul className="space-y-1.5">
                    {step.activities.map((activity, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-secondary/60" aria-hidden="true" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

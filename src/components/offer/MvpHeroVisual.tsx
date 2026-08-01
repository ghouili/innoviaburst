import { useTranslation } from "react-i18next";

/**
 * The MVP hero's animated visual: a wireframe sketch that draws itself, fades
 * out as the finished app composes in behind it, and resolves to a "Live" badge
 * — with a phase rail (Idea → Build → Test → Live) running underneath.
 *
 * Ported from the Claude Design file. Everything is CSS + inline SVG: no raster
 * assets, no external requests, ~0 bytes of image payload. The timeline lives in
 * index.css under `.ib-hero`; per-element offsets are inline `animationDelay`
 * values, which stay inert until the stylesheet attaches an animation (i.e.
 * until the parent is armed).
 *
 * The whole thing is one labelled `img` role with a description of what the
 * animation conveys, so assistive tech gets the meaning without the scaffolding.
 * Every inner shape is aria-hidden decoration.
 */

const WIRE_SHAPES: { d?: string; rect?: [number, number, number, number, number]; delay: string }[] = [
  { rect: [1, 1, 66, 334, 4], delay: "0.3s" },
  { rect: [86, 18, 180, 34, 4], delay: "0.45s" },
  { rect: [86, 66, 152, 58, 4], delay: "0.6s" },
  { rect: [250, 66, 152, 58, 4], delay: "0.68s" },
  { rect: [414, 66, 152, 58, 4], delay: "0.76s" },
  { rect: [86, 138, 480, 110, 5], delay: "0.82s" },
  { d: "M104 226 L176 190 L236 208 L308 172 L372 188 L446 160 L548 152", delay: "1s" },
  { rect: [86, 262, 480, 20, 4], delay: "1.02s" },
  { rect: [86, 290, 480, 20, 4], delay: "1.12s" },
  { rect: [86, 318, 480, 14, 4], delay: "1.22s" },
];

const STATS = [
  { label: 46, value: "1 248", bar: 30, accent: false, delay: "1.9s" },
  { label: 40, value: "98.9%", bar: 36, accent: false, delay: "1.98s" },
  { label: 50, value: "+34%", bar: 26, accent: true, delay: "2.06s" },
];

const PHASES = [
  { key: "idea", left: "0%", nudge: "-1px", delay: "0.5s", live: false },
  { key: "build", left: "33.33%", nudge: "-6.5px", delay: "1.55s", live: false },
  { key: "test", left: "66.66%", nudge: "-6.5px", delay: "2.6s", live: false },
  { key: "live", left: "100%", nudge: "-12px", delay: "3.9s", live: true },
];

export function MvpHeroVisual() {
  const { t } = useTranslation();

  return (
    <div className="relative min-w-0 w-full">
      <div className="ib-frame relative" style={{ animationDelay: "0.1s" }}>
        {/* Soft glow behind the frame */}
        <div
          className="pointer-events-none absolute -inset-x-[6%] -top-[8%] -bottom-[14%] rounded-[34px] blur-[6px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, hsl(var(--accent) / 0.2), hsl(var(--accent) / 0) 70%)",
          }}
          aria-hidden="true"
        />

        <div
          role="img"
          aria-label={t("mvpHero.visualAlt")}
          className="relative rounded-2xl border border-border bg-card shadow-lg"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            ))}
            <div className="flex min-w-0 flex-1 justify-center">
              <span className="inline-flex max-w-full items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-border bg-muted/60 px-3.5 py-1 text-[11.5px] font-semibold tracking-wide text-muted-foreground">
                <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
                  <rect x="2.4" y="5.2" width="7.2" height="5.4" rx="1.3" fill="none" stroke="hsl(var(--secondary))" strokeWidth="1.2" />
                  <path d="M4.1 5.2 V3.9 a1.9 1.9 0 0 1 3.8 0 V5.2" fill="none" stroke="hsl(var(--secondary))" strokeWidth="1.2" />
                </svg>
                app.yourproduct.eu
              </span>
            </div>
            <span
              className="ib-fade inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-deep-blue-dark"
              style={{ animationDelay: "3.5s" }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              v1.0
            </span>
          </div>

          {/* Frame body */}
          <div className="relative flex h-[250px] overflow-hidden rounded-b-2xl sm:h-[336px]">
            {/* Sidebar */}
            <div className="flex w-[68px] shrink-0 flex-col items-center gap-3 border-r border-border bg-muted/30 py-4">
              <span
                className="ib-pop h-[30px] w-[30px] rounded-[9px] bg-gradient-blue shadow-md"
                style={{ animationDelay: "1.5s" }}
                aria-hidden="true"
              />
              {["1.6s", "1.68s", "1.76s", "1.84s"].map((delay, i) => (
                <span
                  key={delay}
                  className={`ib-pop-left h-2 w-[30px] rounded-full ${i === 0 ? "mt-1.5 bg-border" : "bg-muted"}`}
                  style={{ animationDelay: delay }}
                  aria-hidden="true"
                />
              ))}
            </div>

            {/* Main pane */}
            <div className="flex min-w-0 flex-1 flex-col gap-3 px-5 py-4">
              <div className="ib-pop flex items-center justify-between gap-3" style={{ animationDelay: "1.7s" }}>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="block h-2.5 w-[118px] max-w-full rounded-full bg-deep-blue-dark/85" aria-hidden="true" />
                  <span className="block h-[7px] w-[74px] max-w-full rounded-full bg-border" aria-hidden="true" />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="h-[26px] w-[26px] rounded-full border border-border bg-secondary/10" aria-hidden="true" />
                  <span className="h-[26px] w-[26px] rounded-full bg-gradient-blue" aria-hidden="true" />
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {STATS.map((s) => (
                  <div
                    key={s.value}
                    className="ib-pop flex flex-col gap-1.5 rounded-xl border border-border bg-card p-2.5"
                    style={{ animationDelay: s.delay }}
                  >
                    <span className="h-1.5 rounded-full bg-border" style={{ width: s.label }} aria-hidden="true" />
                    <span className={`text-base font-extrabold tracking-tight ${s.accent ? "text-secondary" : "text-foreground"}`}>
                      {s.value}
                    </span>
                    <span className="h-[5px] rounded-full bg-accent/25" style={{ width: s.bar }} aria-hidden="true" />
                  </div>
                ))}
              </div>

              {/* Chart panel */}
              <div
                className="ib-pop relative min-h-0 flex-1 overflow-hidden rounded-[13px] border border-border bg-muted/20 px-3.5 pt-3"
                style={{ animationDelay: "2.2s" }}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span className="h-[7px] w-[84px] rounded-full bg-border" aria-hidden="true" />
                  <div className="flex shrink-0 gap-1.5">
                    <span className="h-1.5 w-[26px] rounded-full bg-secondary/10" aria-hidden="true" />
                    <span className="h-1.5 w-[18px] rounded-full bg-secondary/10" aria-hidden="true" />
                  </div>
                </div>
                <svg
                  viewBox="0 0 300 96"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                  className="mt-2 block h-[calc(100%-26px)] w-full"
                >
                  <defs>
                    <linearGradient id="ibHeroArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.34" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="ib-fade"
                    style={{ animationDelay: "2.95s" }}
                    d="M0 96 L0 74 C 24 74 34 52 56 50 C 80 48 92 64 116 60 C 140 56 150 32 176 30 C 202 28 214 42 238 36 C 262 30 276 14 300 12 L300 96 Z"
                    fill="url(#ibHeroArea)"
                  />
                  <path
                    className="ib-draw-chart"
                    style={{ animationDelay: "2.4s" }}
                    pathLength={1}
                    strokeDasharray={1}
                    d="M0 74 C 24 74 34 52 56 50 C 80 48 92 64 116 60 C 140 56 150 32 176 30 C 202 28 214 42 238 36 C 262 30 276 14 300 12"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle className="ib-pop" style={{ animationDelay: "3.5s" }} cx="300" cy="12" r="4" fill="hsl(var(--orange))" />
                </svg>
              </div>

              {/* List rows */}
              <div className="flex flex-col gap-[7px]">
                {[
                  { delay: "2.9s", w: 34 },
                  { delay: "2.99s", w: 26 },
                  { delay: "3.08s", w: 40 },
                ].map((row) => (
                  <div key={row.delay} className="ib-pop-left flex items-center gap-2.5" style={{ animationDelay: row.delay }}>
                    <span className="h-5 w-5 shrink-0 rounded-full border border-border bg-secondary/10" aria-hidden="true" />
                    <span className="h-[7px] flex-1 rounded-full bg-muted" aria-hidden="true" />
                    <span className="h-[7px] shrink-0 rounded-full bg-accent/25" style={{ width: row.w }} aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>

            {/* Wireframe overlay — drawn first, then faded out as the app composes */}
            <svg
              className="ib-wire pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 620 336"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <g fill="none" stroke="hsl(var(--secondary))" strokeOpacity="0.5" strokeWidth="1.5" strokeLinejoin="round">
                {WIRE_SHAPES.map((s, i) =>
                  s.rect ? (
                    <rect
                      key={i}
                      className="ib-draw"
                      style={{ animationDelay: s.delay }}
                      x={s.rect[0]}
                      y={s.rect[1]}
                      width={s.rect[2]}
                      height={s.rect[3]}
                      rx={s.rect[4]}
                      pathLength={1}
                      strokeDasharray={1}
                    />
                  ) : (
                    <path key={i} className="ib-draw" style={{ animationDelay: s.delay }} d={s.d} pathLength={1} strokeDasharray={1} />
                  ),
                )}
              </g>
            </svg>

            {/* Light sweep as the composition lands */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <div
                className="ib-sweep absolute bottom-0 top-0 w-[28%]"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(var(--accent) / 0) 0%, hsl(var(--accent) / 0.16) 50%, hsl(var(--accent) / 0) 100%)",
                }}
              />
            </div>
          </div>

          {/* Live badge */}
          <div className="ib-live absolute -bottom-[18px] right-3.5 inline-flex items-center gap-2 rounded-full bg-orange px-3.5 py-2 text-[12.5px] font-bold tracking-wide text-[hsl(22_55%_15%)]">
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
              <path d="M3.4 7.4 L5.8 9.8 L10.6 4.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("mvpHero.live")}
          </div>
        </div>
      </div>

      {/* Phase rail */}
      <div className="mt-11 px-1">
        <div className="relative h-1 rounded-full bg-border">
          <div
            className="ib-rail-fill absolute bottom-0 left-0 top-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--deep-blue-dark)), hsl(var(--secondary)) 55%, hsl(var(--accent)) 88%, hsl(var(--orange)) 100%)",
            }}
            aria-hidden="true"
          />
          {PHASES.map((p) => (
            <span
              key={p.key}
              className={`${p.live ? "ib-node-live" : "ib-node"} absolute top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full border-2`}
              style={{ left: p.left, marginLeft: p.nudge, animationDelay: p.delay }}
              aria-hidden="true"
            />
          ))}
        </div>
        <ol className="relative mt-3 h-[18px] whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.09em] sm:text-xs">
          {PHASES.map((p, i) => (
            <li
              key={p.key}
              className={`ib-fade absolute top-0 ${p.live ? "text-orange-dark" : "text-deep-blue-dark"}`}
              style={{
                animationDelay: p.delay,
                ...(i === 0
                  ? { left: 0 }
                  : p.live
                    ? { right: 0 }
                    : { left: p.left, transform: "translateX(-50%)" }),
              }}
            >
              {t(`mvpHero.phases.${p.key}`)}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

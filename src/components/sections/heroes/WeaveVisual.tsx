import { useEffect, useRef } from "react";

/**
 * WeaveVisual
 *
 * Self-contained port of the designed hero's RIGHT-SIDE `.stage` panel: the
 * canvas "weave" animation, the three stat pills and the corner tag. Only the
 * stage is ported (no left copy column, no topbar, no outer hero/grid).
 * Re-skinned to repo design tokens, SSR-safe, reduced-motion aware.
 *
 * SSR notes:
 *  - No window/document/matchMedia/ResizeObserver/rAF/performance at module
 *    scope or during render. The server-rendered DOM is the empty <canvas>
 *    plus the tag and the three pills.
 *  - All canvas/animation code runs inside a single useEffect, operating on a
 *    stage root ref and a <canvas> ref. The per-strand thread params (which use
 *    Math.random) are generated once inside the effect, never at module load.
 *  - Full teardown on unmount: the rAF is cancelled and the ResizeObserver is
 *    disconnected.
 *  - prefers-reduced-motion: a single fully-resolved static frame is painted
 *    (the source's renderStatic) and the rAF loop never starts; the
 *    ResizeObserver still re-renders that static frame on resize. The pills are
 *    shown in static mode.
 */

interface WeaveVisualProps {
  className?: string;
  tagLabel?: string;
  statLabels?: [string, string, string];
}

/* ---------------------------------- types ---------------------------------- */

type RGB = readonly [number, number, number];

interface Harmonic {
  a: number;
  f: number;
  phase: number;
  dir: number;
  spd: number;
}

interface Thread {
  lane: number;
  strand: number;
  off: number;
  bundleJit: number;
  harmonics: Harmonic[];
  jitPhase: number;
  jitSpd: number;
}

interface Lane {
  name: string;
  tool: string;
  accent: RGB;
  lead: boolean;
  checks: number[];
}

interface Geo {
  x0: number;
  x1: number;
  span: number;
  cy: number;
  gap: number;
  top: number;
  laneY: number[];
  band: number;
  tangAmp: number;
  fanEnd: number;
  bundleX: number;
}

interface Phase {
  gp: number;
  jit: number;
  hold: number;
}

/* --------------------------------- styles ---------------------------------- */
/*
 * Every selector is prefixed with `.iaweave` so nothing leaks globally. The
 * source's local color vars are remapped to repo design tokens on `.iaweave`.
 * Gradient / shadow / aspect-ratio / backdrop-filter / media queries are kept
 * intact (just scoped).
 */
const STYLES = `
.iaweave{
  --bg: hsl(var(--background));
  --panel: hsl(var(--card));
  --ink: hsl(var(--foreground));
  --slate: hsl(var(--muted-foreground));
  --hairline: hsl(var(--border));
  --line-soft: hsl(var(--border));
  --accent: hsl(var(--secondary));
  --cyan: hsl(var(--accent));
  --orange: hsl(var(--primary));
  position:relative;
  background:linear-gradient(180deg,var(--panel) 0%,var(--bg) 100%);
  border:1px solid var(--line-soft);
  border-radius:16px;
  box-shadow:0 24px 60px -42px rgba(29,37,48,.5),0 1px 0 rgba(255,255,255,.6) inset;
  overflow:hidden;
  aspect-ratio:16/11;
}
.iaweave canvas{ display:block; width:100%; height:100%; }
.iaweave .stage-tag{
  position:absolute; top:16px; left:18px;
  font-size:0.66rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase;
  color:var(--slate); display:flex; align-items:center; gap:8px; pointer-events:none;
}
.iaweave .stage-tag .dot{
  width:7px; height:7px; border-radius:50%;
  background:var(--accent); box-shadow:0 0 0 4px rgba(34,115,195,.14);
}
.iaweave .stats{
  position:absolute; left:18px; bottom:16px;
  display:flex; gap:9px; flex-wrap:wrap; pointer-events:none;
}
.iaweave .stat{
  display:flex; align-items:center; gap:8px;
  background:rgba(252,254,255,.82); backdrop-filter:blur(6px);
  border:1px solid var(--line-soft); border-radius:999px;
  padding:7px 13px 7px 11px; font-size:0.74rem; font-weight:550; color:var(--ink);
  opacity:0; transform:translateY(6px);
  transition:opacity .6s ease, transform .6s ease; white-space:nowrap;
}
.iaweave .stat i{ width:6px; height:6px; border-radius:50%; flex:none; }
.iaweave .stat.s0 i{ background:var(--accent); }
.iaweave .stat.s1 i{ background:var(--cyan); }
.iaweave .stat.s2 i{ background:var(--orange); }
@media (max-width:900px){ .iaweave{ aspect-ratio:16/12; } }
@media (max-width:520px){ .iaweave .stats .stat:nth-child(3){ display:none; } }
`;

export function WeaveVisual({
  className = "",
  tagLabel = "Operations, in order",
  statLabels = [
    "First delivery in ~10 days",
    "Hours saved every week",
    "EU GDPR-ready",
  ],
}: WeaveVisualProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const statEls = Array.prototype.slice.call(
      stage.querySelectorAll<HTMLElement>(".stat"),
    ) as HTMLElement[];

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Brand RGB palette — hardcoded by design (do NOT read from CSS vars). */
    const COL = {
      ink: [29, 37, 48] as RGB,
      slate: [98, 112, 132] as RGB,
      hair: [223, 232, 236] as RGB,
      accent: [34, 115, 195] as RGB,
      cyan: [19, 193, 236] as RGB,
      orange: [249, 112, 21] as RGB,
    };

    const LANES: Lane[] = [
      { name: "Leads", tool: "CRM", accent: COL.accent, lead: true, checks: [0.5, 0.7, 0.88] },
      { name: "Support", tool: "Helpdesk", accent: COL.cyan, lead: false, checks: [0.46, 0.66, 0.86] },
      { name: "Payments", tool: "Stripe", accent: COL.orange, lead: false, checks: [0.52, 0.72, 0.9] },
      { name: "Onboarding", tool: "Docs", accent: COL.ink, lead: false, checks: [0.48, 0.68, 0.84] },
    ];

    const STRANDS: number = 11;
    const SAMPLES = 66;
    const SPREAD = 0.55;

    const rnd = (a: number, b: number): number => a + Math.random() * (b - a);

    /* ---- per-strand thread params built once, here (uses Math.random) ---- */
    const threads: Thread[] = [];
    for (let li = 0; li < LANES.length; li++) {
      for (let s = 0; s < STRANDS; s++) {
        const harmonics: Harmonic[] = [];
        const n = 3 + (Math.random() < 0.5 ? 0 : 1);
        let ampTotal = 0;
        for (let h = 0; h < n; h++) {
          const a = rnd(0.35, 1);
          ampTotal += a;
          harmonics.push({
            a,
            f: Math.floor(rnd(1, 5)),
            phase: rnd(0, Math.PI * 2),
            dir: Math.random() < 0.5 ? -1 : 1,
            spd: rnd(0.25, 0.7),
          });
        }
        for (let h2 = 0; h2 < harmonics.length; h2++) harmonics[h2].a /= ampTotal;
        threads.push({
          lane: li,
          strand: s,
          off: STRANDS === 1 ? 0 : s / (STRANDS - 1) - 0.5,
          bundleJit: rnd(-1, 1),
          harmonics,
          jitPhase: rnd(0, Math.PI * 2),
          jitSpd: rnd(0.6, 1.3),
        });
      }
    }

    let W = 0;
    let H = 0;
    let dpr = 1;
    const geo = {} as Geo;

    function layout(): void {
      const rect = stage!.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      geo.x0 = W * 0.075;
      geo.x1 = W * 0.965;
      geo.span = geo.x1 - geo.x0;
      geo.cy = H * 0.5;
      const laneSpread = Math.min(H * 0.56, 300);
      geo.gap = laneSpread / (LANES.length - 1);
      geo.top = geo.cy - laneSpread / 2;
      geo.laneY = LANES.map((_, i) => geo.top + i * geo.gap);
      geo.band = Math.min(geo.gap * 0.34, 16);
      geo.tangAmp = laneSpread * 0.62;
      geo.fanEnd = 0.3;
      geo.bundleX = geo.x0;
    }

    const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
    const smooth = (t: number): number => {
      t = clamp(t, 0, 1);
      return t * t * (3 - 2 * t);
    };
    const smoothRange = (t: number, a: number, b: number): number => smooth((t - a) / (b - a));
    const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
    const mix = (c1: RGB, c2: RGB, t: number): string =>
      "rgba(" +
      Math.round(lerp(c1[0], c2[0], t)) +
      "," +
      Math.round(lerp(c1[1], c2[1], t)) +
      "," +
      Math.round(lerp(c1[2], c2[2], t)) +
      ",";

    function tangY(th: Thread, xn: number, time: number): number {
      const env = 0.55 + 0.85 * Math.exp(-Math.pow((xn - 0.32) / 0.34, 2));
      let sum = 0;
      const hs = th.harmonics;
      for (let i = 0; i < hs.length; i++) {
        const hh = hs[i];
        sum += hh.a * Math.sin(hh.f * xn * Math.PI * 2 + hh.phase + hh.dir * time * hh.spd);
      }
      return geo.cy + sum * geo.tangAmp * env;
    }

    function ordY(th: Thread, xn: number): number {
      const laneY = geo.laneY[th.lane];
      const fan = smooth(xn / geo.fanEnd);
      const bundleY = geo.cy + th.off * geo.band * 0.5 + th.bundleJit * 7 * (1 - fan);
      const target = laneY + th.off * geo.band;
      return lerp(bundleY, target, fan);
    }

    const T = 11000;
    function phase(p: number): Phase {
      let gp: number;
      let jit: number;
      let hold: number;
      if (p < 0.12) {
        gp = 0;
        jit = 1;
        hold = 0;
      } else if (p < 0.45) {
        gp = smoothRange(p, 0.12, 0.45);
        jit = 1 - gp * 0.9;
        hold = 0;
      } else if (p < 0.72) {
        gp = 1;
        jit = 0.06;
        hold = smoothRange(p, 0.45, 0.55) * (1 - smoothRange(p, 0.68, 0.72));
      } else if (p < 0.92) {
        gp = 1 - smoothRange(p, 0.72, 0.92);
        jit = 0.1 + (1 - gp) * 0.85;
        hold = 0;
      } else {
        gp = 0;
        jit = 1;
        hold = 0;
      }
      return { gp, jit, hold: clamp(hold, 0, 1) };
    }

    function roundRect(
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ): void {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    /* hoisted from inside the lane loop in the source for cleaner typing */
    function resolveAt(gp: number, xn: number): number {
      return smooth(clamp((gp * (1 + SPREAD) - xn) / SPREAD, 0, 1));
    }

    function render(ph: Phase, time: number): void {
      ctx!.clearRect(0, 0, W, H);
      const gp = ph.gp;
      ctx!.lineCap = "round";
      ctx!.lineJoin = "round";
      for (let t = 0; t < threads.length; t++) {
        const th = threads[t];
        const rRep = smooth(clamp((gp * (1 + SPREAD) - 0.72) / SPREAD, 0, 1));
        const baseTarget = COL.ink;
        const aAlpha = lerp(0.42, 0.9, rRep);
        const lw = lerp(0.8, 1.15, rRep);
        ctx!.lineWidth = lw;
        ctx!.strokeStyle = mix(COL.slate, baseTarget, rRep) + aAlpha.toFixed(3) + ")";
        ctx!.beginPath();
        for (let i = 0; i <= SAMPLES; i++) {
          const xn = i / SAMPLES;
          const x = geo.x0 + xn * geo.span;
          const r = smooth(clamp((gp * (1 + SPREAD) - xn) / SPREAD, 0, 1));
          const ty = tangY(th, xn, time);
          const jit = (1 - r) * ph.jit * 5 * Math.sin(time * th.jitSpd * 3 + th.jitPhase + xn * 9);
          const oy = ordY(th, xn);
          const y = lerp(ty + jit, oy, r);
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
      ctx!.textBaseline = "middle";
      for (let li = 0; li < LANES.length; li++) {
        const L = LANES[li];
        const laneY = geo.laneY[li];
        const rLabel = resolveAt(gp, geo.fanEnd + 0.015);
        const rChip = resolveAt(gp, 0.9);
        if (rLabel > 0.02) {
          ctx!.globalAlpha = rLabel;
          ctx!.fillStyle = "rgba(29,37,48,0.92)";
          ctx!.font = "600 11px Inter, sans-serif";
          ctx!.letterSpacing = "1.5px";
          ctx!.textAlign = "left";
          const lx = geo.x0 + (geo.fanEnd + 0.02) * geo.span;
          ctx!.fillText(L.name.toUpperCase(), lx, laneY - 13);
          ctx!.letterSpacing = "0px";
          ctx!.globalAlpha = 1;
        }
        for (let c = 0; c < L.checks.length; c++) {
          const cxn = L.checks[c];
          const rc = resolveAt(gp, cxn);
          if (rc <= 0.02) continue;
          const cx = geo.x0 + cxn * geo.span;
          const a = smooth(rc);
          ctx!.globalAlpha = a;
          ctx!.beginPath();
          ctx!.arc(cx, laneY, 3.6, 0, Math.PI * 2);
          ctx!.fillStyle = "#FCFEFF";
          ctx!.fill();
          ctx!.beginPath();
          ctx!.arc(cx, laneY, 2.1, 0, Math.PI * 2);
          const dc = c === L.checks.length - 1 ? L.accent : COL.ink;
          ctx!.fillStyle = "rgb(" + dc[0] + "," + dc[1] + "," + dc[2] + ")";
          ctx!.fill();
          ctx!.globalAlpha = 1;
        }
        if (rChip > 0.02) {
          const snap = smooth(rChip);
          const chipX = geo.x0 + 0.93 * geo.span;
          ctx!.save();
          ctx!.globalAlpha = snap;
          ctx!.translate(chipX, laneY);
          const sc = 0.86 + 0.14 * snap;
          ctx!.scale(sc, sc);
          ctx!.font = "600 10.5px Inter, sans-serif";
          ctx!.letterSpacing = "0.2px";
          const tw = ctx!.measureText(L.tool).width;
          const padX = 9;
          const chipW = tw + padX * 2 + 12;
          const chipH = 21;
          roundRect(ctx!, -chipW / 2, -chipH / 2, chipW, chipH, 6);
          ctx!.fillStyle = "#FFFFFF";
          ctx!.fill();
          ctx!.lineWidth = 1;
          ctx!.strokeStyle = "rgba(29,37,48,0.12)";
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(-chipW / 2 + padX + 1, 0, 2.6, 0, Math.PI * 2);
          ctx!.fillStyle = "rgb(" + L.accent[0] + "," + L.accent[1] + "," + L.accent[2] + ")";
          ctx!.fill();
          ctx!.fillStyle = "#1D2530";
          ctx!.textAlign = "left";
          ctx!.fillText(L.tool, -chipW / 2 + padX + 9, 0.5);
          ctx!.letterSpacing = "0px";
          ctx!.restore();
          ctx!.globalAlpha = 1;
        }
      }
      if (ph.hold > 0.01) {
        const ly = geo.laneY[0];
        const travel = ph.hold;
        const pulseXn = clamp(travel * 1.15, 0, 1);
        const px = geo.x0 + (geo.fanEnd + (1 - geo.fanEnd) * pulseXn) * geo.span;
        const glowA = Math.sin(Math.min(travel, 1) * Math.PI);
        ctx!.globalAlpha = glowA;
        const grd = ctx!.createRadialGradient(px, ly, 0, px, ly, 26);
        grd.addColorStop(0, "rgba(34,115,195,0.30)");
        grd.addColorStop(1, "rgba(34,115,195,0)");
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(px, ly, 26, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(px, ly, 3.4, 0, Math.PI * 2);
        ctx!.fillStyle = "rgb(34,115,195)";
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(px, ly, 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = "#fff";
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
    }

    function renderStatic(): void {
      layout();
      render({ gp: 1, jit: 0, hold: 1 }, 6.2);
      statEls.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }

    /* ------------------------------- run loop ------------------------------ */
    let rafId = 0;
    const pillTimers: ReturnType<typeof setTimeout>[] = [];
    let start: number | null = null;
    let lastStat = -1;

    function frame(ts: number): void {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const p = (elapsed % T) / T;
      const ph = phase(p);
      const time = elapsed / 1000;
      render(ph, time);
      const statOn = ph.hold > 0.5 ? 1 : 0;
      if (statOn !== lastStat) {
        lastStat = statOn;
        statEls.forEach((el, i) => {
          pillTimers.push(
            setTimeout(
              () => {
                el.style.opacity = statOn ? "1" : "0";
                el.style.transform = statOn ? "translateY(0)" : "translateY(6px)";
              },
              statOn ? i * 130 : 0,
            ),
          );
        });
      }
      rafId = requestAnimationFrame(frame);
    }

    /* ----------------------- resize: re-layout / re-paint ------------------ */
    const ro = new ResizeObserver(() => {
      layout();
      if (reduceMotion) render({ gp: 1, jit: 0, hold: 1 }, 6.2);
    });
    ro.observe(stage);

    layout();
    if (reduceMotion) {
      renderStatic();
    } else {
      rafId = requestAnimationFrame(frame);
    }

    /* -------------------------------- cleanup ------------------------------ */
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      pillTimers.forEach(clearTimeout);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={stageRef} className={`iaweave ${className}`.trim()}>
      {/* CSS injected raw to avoid JSX text-escaping hydration mismatches. */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <canvas ref={canvasRef} />
      <div className="stage-tag">
        <span className="dot" />
        {tagLabel}
      </div>
      <div className="stats">
        <div className="stat s0">
          <i />
          {statLabels[0]}
        </div>
        <div className="stat s1">
          <i />
          {statLabels[1]}
        </div>
        <div className="stat s2">
          <i />
          {statLabels[2]}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";

/**
 * AutomationLaneVisual
 *
 * Self-contained port of the "Automation lane" right-side panel from the
 * designed hero. Only the `.panel` is ported (no left copy column, no outer
 * hero/wrap). Re-skinned to the repo design tokens, SSR-safe, reduced-motion
 * aware.
 *
 * SSR notes:
 *  - No window/document/matchMedia access at module scope or during render.
 *  - The server-rendered DOM is the panel's resting state (two seeded queue
 *    cards + shown stats) so crawlers see real structure.
 *  - All imperative animation (timers, queue/stat logic, DOM mutation) runs
 *    inside a single useEffect operating on a root ref, and fully tears down
 *    on unmount (every setTimeout cleared, listeners removed, rAF cancelled).
 *  - prefers-reduced-motion: if reduced motion is requested we render a calm
 *    static state and never start the spawn/cycle/scan/heartbeat loops.
 */

interface AutomationLaneVisualProps {
  className?: string;
}

/* ----------------------------- demo micro-copy ----------------------------- */

interface TaskDef {
  t: string;
  src: string;
  tag: string;
  route: string;
}

const TASKS: ReadonlyArray<TaskDef> = [
  { t: "New support ticket", src: "via Helpdesk", tag: "#support", route: "Tier-2 queue" },
  { t: "Unassigned lead", src: "via CRM", tag: "#sales", route: "Rep · West" },
  { t: "Failed payment", src: "via Stripe", tag: "#billing", route: "Retry + notify" },
  { t: "Onboarding step", src: "via Product", tag: "#success", route: "Send setup guide" },
  { t: "Invoice follow-up", src: "via Ledger", tag: "#finance", route: "Schedule reminder" },
];

const ROUTE_SVG =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9a4 4 0 014 4v2m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK_SVG =
  '<svg class="check" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>';

/**
 * Resting-state lane markup as a raw HTML string — byte-identical to what the
 * effect's makeCard() produces. Rendered via dangerouslySetInnerHTML (with
 * suppressHydrationWarning) so React does NOT reconcile the cards' mixed
 * expression/text/element nodes during hydration (that caused #425). The effect
 * clears and re-owns this lane on mount, so it's purely the no-JS/crawler view.
 */
const seededCardHtml = (d: TaskDef, y: number): string =>
  `<div class="card" style="transform:translateY(${y}px)"><div class="scan"></div>` +
  `<div class="card-top"><span class="tdot"></span><span class="ttl">${d.t}</span>` +
  `<span class="status"><span class="spin" style="display:none"></span><span class="slabel">Queued</span>${CHECK_SVG}</span></div>` +
  `<div class="card-meta"><span class="meta-pre">${d.src}<span class="meta-sep"></span>just now</span>` +
  `<span class="meta-auto"><span class="meta-sep"></span><span class="tag">${d.tag}</span>` +
  `<span class="route">${ROUTE_SVG}${d.route}</span></span></div></div>`;

const SEEDED_LANE_HTML = seededCardHtml(TASKS[0], 0) + seededCardHtml(TASKS[1], 88);

/* --------------------------------- styles ---------------------------------- */
/*
 * Every selector is prefixed with `.ialane` so nothing leaks globally.
 * Source local color vars are remapped to the repo design tokens on `.ialane`.
 * radius / shadows / ease / slot / keyframes / transitions are kept intact.
 */
const STYLES = `
.ialane{
  --bg: hsl(var(--background));
  /* White card surfaces. (Was hsl(var(--card)) — a self-referential cycle that
     resolved invalid, so the panel rendered transparent over the hero gradient.) */
  --card: hsl(0 0% 100%);
  --line: hsl(var(--border));
  --ink: hsl(var(--foreground));
  --slate: hsl(var(--muted-foreground));
  /* Logo blue (was hsl(var(--secondary)) = 4.27:1) — darkened so the small
     "Processing"/tag labels on the light-blue chip clear WCAG AA on the now-opaque
     white panel. Also aligns the panel accent with the brand primary. */
  --blue: hsl(210 77% 35%);
  --blue-soft: hsl(var(--secondary) / 0.10);
  --green: hsl(160 84% 39%);
  --green-soft: hsl(160 84% 39% / 0.12);
  /* Brand orange for the panel's manual-mode warnings / overdue states. Literal
     (not hsl(var(--primary))) because --primary is now logo blue. */
  --orange: hsl(24 95% 53%);
  --orange-soft: hsl(24 95% 53% / 0.12);
  --radius: 12px;
  --shadow-sm: 0 1px 2px rgba(29,37,48,.05), 0 1px 1px rgba(29,37,48,.03);
  --shadow-md: 0 10px 30px -12px rgba(29,37,48,.18), 0 2px 6px rgba(29,37,48,.05);
  --ease: cubic-bezier(.45,.05,.25,1);
  --slot: 88px;
}
.ialane.panel{ width:100%; background:var(--card); border:1px solid var(--line); border-radius:18px; box-shadow:var(--shadow-md); overflow:hidden; }
.ialane .panel-head{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:15px 17px; border-bottom:1px solid var(--line); background:var(--card); }
.ialane .ph-left{ display:flex; align-items:center; gap:11px; min-width:0; }
.ialane .live{ display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:600; color:var(--slate); }
.ialane .live .beat{ width:8px; height:8px; border-radius:50%; background:var(--green); position:relative; }
.ialane .live .beat::after{ content:""; position:absolute; inset:0; border-radius:50%; background:var(--green); animation:ialane-beat 2s var(--ease) infinite; }
@keyframes ialane-beat{ 0%{transform:scale(1);opacity:.5} 70%,100%{transform:scale(2.6);opacity:0} }
.ialane .ph-title{ font-size:13.5px; font-weight:600; }
.ialane .ph-titlerow{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.ialane .ill-tag{ font-size:9.5px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--slate); background:var(--bg); border:1px solid var(--line); border-radius:999px; padding:2px 7px; }
.ialane .ph-sub{ font-size:11.5px; color:var(--slate); margin-top:1px; }
.ialane .toggle{ display:inline-flex; background:var(--bg); border:1px solid var(--line); border-radius:10px; padding:3px; gap:2px; flex:none; }
.ialane .toggle button{ font-family:inherit; font-size:11.5px; font-weight:550; border:none; background:transparent; color:var(--slate); padding:6px 11px; border-radius:7px; cursor:pointer; transition:color .2s, background .2s; white-space:nowrap; }
.ialane .toggle button.on{ background:var(--card); color:var(--ink); box-shadow:var(--shadow-sm); }
.ialane .toggle button.on[data-mode="manual"]{ color:var(--orange); }
.ialane .panel-body{ display:grid; grid-template-columns:minmax(0,1fr) 248px; }
.ialane .lane-col{ padding:18px 18px 20px; border-right:1px solid var(--line); position:relative; }
.ialane .lane-label{ display:flex; align-items:center; justify-content:space-between; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--slate); margin-bottom:12px; }
.ialane .lane-label .count{ color:var(--ink); background:var(--bg); border:1px solid var(--line); padding:2px 8px; border-radius:999px; letter-spacing:0; text-transform:none; font-size:11px; font-weight:600; }
.ialane .lane{ position:relative; height:calc(var(--slot) * 4 + 6px); overflow:hidden; -webkit-mask-image:linear-gradient(to bottom, transparent 0, #000 7%, #000 90%, transparent 100%); mask-image:linear-gradient(to bottom, transparent 0, #000 7%, #000 90%, transparent 100%); }
.ialane .lane.manual{ -webkit-mask-image:linear-gradient(to bottom, transparent 0, #000 6%, #000 82%, transparent 100%); mask-image:linear-gradient(to bottom, transparent 0, #000 6%, #000 82%, transparent 100%); }
.ialane .card{ position:absolute; left:2px; right:2px; top:0; height:calc(var(--slot) - 12px); background:var(--card); border:1px solid var(--line); border-radius:var(--radius); box-shadow:var(--shadow-sm); padding:12px 14px; display:flex; flex-direction:column; justify-content:center; gap:7px; overflow:hidden; transition:transform .55s var(--ease), opacity .5s var(--ease), border-color .35s var(--ease), box-shadow .35s var(--ease), background .35s var(--ease); }
.ialane .card.processing{ border-color:hsl(var(--secondary) / .5); box-shadow:0 8px 22px -12px hsl(var(--secondary) / .5), 0 0 0 1px hsl(var(--secondary) / .18); }
.ialane .card.done{ border-color:hsl(160 84% 39% / .5); box-shadow:0 8px 22px -12px hsl(160 84% 39% / .4), 0 0 0 1px hsl(160 84% 39% / .16); animation:ialane-doneflash .55s var(--ease); }
@keyframes ialane-doneflash{ 0%{background:var(--green-soft);} 100%{background:var(--card);} }
.ialane .card.done .status{ animation:ialane-pillpop .42s var(--ease); }
@keyframes ialane-pillpop{ 0%{transform:scale(.85);} 55%{transform:scale(1.08);} 100%{transform:scale(1);} }
.ialane .card.overdue{ border-color:hsl(var(--primary) / .5); background:linear-gradient(to right, var(--orange-soft), var(--card) 55%); }
.ialane .card-top{ display:flex; align-items:center; gap:9px; }
.ialane .card-top .tdot{ width:7px; height:7px; border-radius:50%; flex:none; background:var(--slate); transition:background .3s; }
.ialane .card.processing .tdot{ background:var(--blue); }
.ialane .card.done .tdot{ background:var(--green); }
.ialane .card.overdue .tdot{ background:var(--orange); }
.ialane .card .ttl{ font-size:14px; font-weight:550; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; min-width:0; }
.ialane .status{ flex:none; display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:3px 9px; border-radius:999px; background:var(--bg); color:var(--slate); transition:background .3s, color .3s; }
.ialane .card.processing .status{ background:var(--blue-soft); color:var(--blue); }
.ialane .card.done .status{ background:var(--green-soft); color:var(--green); }
.ialane .card.overdue .status{ background:var(--orange-soft); color:var(--orange); }
.ialane .status .check{ width:12px; height:12px; display:none; }
.ialane .card.done .status .check{ display:block; }
.ialane .check path{ stroke:var(--green); stroke-width:2.6; fill:none; stroke-linecap:round; stroke-linejoin:round; stroke-dasharray:24; stroke-dashoffset:24; }
.ialane .card.done .check path{ animation:ialane-draw .4s var(--ease) forwards; }
@keyframes ialane-draw{ to{stroke-dashoffset:0;} }
.ialane .card.processing .status .spin{ width:9px; height:9px; border-radius:50%; border:1.6px solid hsl(var(--secondary) / .3); border-top-color:var(--blue); animation:ialane-spin .7s linear infinite; }
@keyframes ialane-spin{ to{transform:rotate(360deg);} }
.ialane .card-meta{ display:flex; align-items:center; gap:7px; min-height:16px; font-size:11.5px; color:var(--slate); }
.ialane .meta-pre{ display:inline-flex; align-items:center; gap:7px; }
.ialane .meta-sep{ width:2.5px; height:2.5px; border-radius:50%; background:var(--slate); opacity:.55; flex:none; }
.ialane .meta-auto{ display:inline-flex; align-items:center; gap:6px; opacity:0; transform:translateX(-4px); transition:opacity .4s var(--ease) .05s, transform .4s var(--ease) .05s; }
.ialane .card.processing .meta-auto, .ialane .card.done .meta-auto{ opacity:1; transform:none; }
.ialane .tag{ font-weight:600; color:var(--blue); background:var(--blue-soft); padding:2px 7px; border-radius:6px; font-size:11px; }
.ialane .route{ display:inline-flex; align-items:center; gap:4px; color:var(--ink); font-weight:500; }
.ialane .route svg{ width:11px; height:11px; color:var(--slate); }
.ialane .scan{ position:absolute; left:0; right:0; top:0; height:2px; background:linear-gradient(90deg, transparent, var(--blue), transparent); box-shadow:0 0 10px 1px hsl(var(--secondary) / .45); opacity:0; pointer-events:none; }
.ialane .card.processing .scan{ animation:ialane-sweep 1.3s var(--ease); }
@keyframes ialane-sweep{ 0%{opacity:0; transform:translateY(0);} 12%{opacity:1;} 88%{opacity:1;} 100%{opacity:0; transform:translateY(calc(var(--slot) - 14px));} }
.ialane .card.exit{ opacity:0 !important; }
.ialane .mc{ padding:18px 18px 20px; display:flex; flex-direction:column; gap:13px; }
.ialane .mc-head{ font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:var(--slate); margin-bottom:1px; }
.ialane .stat{ border:1px solid var(--line); border-radius:var(--radius); padding:12px 13px; background:var(--card); transition:border-color .35s, background .35s; }
.ialane .stat-top{ display:flex; align-items:center; justify-content:space-between; gap:8px; }
.ialane .stat-label{ font-size:11.5px; color:var(--slate); font-weight:500; }
.ialane .stat-trend{ display:inline-flex; align-items:center; gap:3px; font-size:10.5px; font-weight:600; color:var(--green); }
.ialane .stat-trend svg{ width:11px; height:11px; }
.ialane .stat-trend.down{ color:var(--orange); }
.ialane .stat-val{ margin-top:5px; font-size:25px; font-weight:650; color:var(--ink); font-variant-numeric:tabular-nums; line-height:1; display:flex; align-items:baseline; gap:7px; }
.ialane .stat-val .from{ font-size:12px; font-weight:500; color:var(--slate); }
.ialane .stat-val .arrow{ font-size:14px; color:var(--slate); opacity:.65; font-weight:500; }
.ialane .stat.warn{ border-color:hsl(var(--primary) / .4); background:linear-gradient(to bottom, var(--card), var(--orange-soft)); }
.ialane .stat.warn .stat-val{ color:var(--orange); }
.ialane .panel-foot{ display:flex; align-items:center; gap:10px; padding:11px 18px; border-top:1px solid var(--line); font-size:11.5px; color:var(--slate); background:var(--card); }
.ialane .panel-foot .fdot{ width:6px; height:6px; border-radius:50%; background:var(--green); }
.ialane .panel-foot.manual .fdot{ background:var(--orange); }
.ialane .panel-foot b{ color:var(--ink); font-weight:600; }
@media (max-width:980px){
  .ialane .panel-body{ grid-template-columns:1fr; }
  .ialane .lane-col{ border-right:none; border-bottom:1px solid var(--line); }
  .ialane .mc{ flex-direction:row; flex-wrap:wrap; }
  .ialane .mc-head{ width:100%; }
  .ialane .stat{ flex:1 1 calc(50% - 7px); }
}
@media (max-width:560px){
  .ialane .panel-head{ flex-wrap:wrap; }
  .ialane .stat{ flex:1 1 100%; }
}
@media (prefers-reduced-motion:reduce){
  .ialane .live .beat::after{ animation:none; }
  .ialane .card.processing .scan{ animation:none; opacity:.4; }
}
`;

export function AutomationLaneVisual({ className = "" }: AutomationLaneVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* ---- scoped element lookups (replaces document.getElementById) ---- */
    const $ = <T extends HTMLElement = HTMLElement>(id: string): T | null =>
      root.querySelector<T>(`#${id}`);

    const lane = $<HTMLDivElement>("ialane-lane");
    const queueCount = $<HTMLSpanElement>("ialane-queueCount");
    const phSub = $<HTMLDivElement>("ialane-phSub");
    const foot = $<HTMLDivElement>("ialane-foot");
    const footText = $<HTMLSpanElement>("ialane-footText");
    const toggle = $<HTMLDivElement>("ialane-toggle");

    if (!lane || !queueCount || !phSub || !foot || !footText || !toggle) return;

    const SLOT = 88;
    const MAX_AUTO = 5;
    const MAX_MANUAL = 9;

    interface Card {
      el: HTMLDivElement;
      data: TaskDef;
      busy: boolean;
      gone: boolean;
    }

    let cards: Card[] = [];
    let timers: ReturnType<typeof setTimeout>[] = [];
    const rafs: number[] = [];
    let mode: "auto" | "manual" = "auto";
    let pickIdx = 0;
    let driftTimer: ReturnType<typeof setTimeout> | null = null;
    let manualTimer: ReturnType<typeof setTimeout> | null = null;

    const stats = { handled: 1248, hours: 37, miss: 0, resolves: 0 };
    let manualAvgMin = 240;

    /* ----------------------------- formatters ----------------------------- */
    const fmtComma = (n: number): string => Math.round(n).toLocaleString("en-US");
    const fmtDur = (min: number): string => {
      if (min < 60) return Math.round(min) + "m";
      const h = Math.floor(min / 60);
      const m = Math.round(min % 60);
      return m ? h + "h " + m + "m" : h + "h";
    };

    /* ------------------------- number roll animation ---------------------- */
    function rollTo(
      el: HTMLElement | null,
      target: number,
      fmt: (v: number) => string,
    ): void {
      if (!el) return;
      const cur = parseFloat(el.getAttribute("data-v") || "0");
      if (cur === target) {
        el.textContent = fmt(target);
        el.setAttribute("data-v", String(target));
        return;
      }
      const start = cur;
      const t0 = performance.now();
      const dur = 520;
      const step = (now: number): void => {
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        const val = start + (target - start) * e;
        el.textContent = fmt(val);
        if (k < 1) {
          rafs.push(requestAnimationFrame(step));
        } else {
          el.textContent = fmt(target);
          el.setAttribute("data-v", String(target));
        }
      };
      rafs.push(requestAnimationFrame(step));
    }

    function renderStats(): void {
      rollTo($("ialane-v-handled"), stats.handled, fmtComma);
      rollTo($("ialane-v-hours"), stats.hours, (v) => String(Math.round(v)));
      rollTo($("ialane-v-miss"), stats.miss, (v) => String(Math.round(v)));

      const resp = $("ialane-v-resp");
      const statResp = $("ialane-stat-resp");
      const trendwrapResp = $("ialane-trendwrap-resp");
      const trendResp = $("ialane-trend-resp");
      const statMiss = $("ialane-stat-miss");
      const trendwrapMiss = $("ialane-trendwrap-miss");
      const trendMiss = $("ialane-trend-miss");

      if (mode === "auto") {
        if (resp) resp.textContent = "3m";
        statResp?.classList.remove("warn");
        trendwrapResp?.classList.remove("down");
        if (trendResp) trendResp.textContent = "93% faster";
        statMiss?.classList.remove("warn");
        trendwrapMiss?.classList.remove("down");
        if (trendMiss) trendMiss.textContent = "held at zero";
      } else {
        if (resp) resp.textContent = fmtDur(manualAvgMin);
        statResp?.classList.add("warn");
        trendwrapResp?.classList.add("down");
        if (trendResp) trendResp.textContent = "climbing";
        statMiss?.classList.toggle("warn", stats.miss > 0);
        trendwrapMiss?.classList.toggle("down", stats.miss > 0);
        if (trendMiss) trendMiss.textContent = stats.miss > 0 ? "rising" : "at risk";
      }
    }

    function bumpResolve(): void {
      stats.handled += 1;
      stats.resolves += 1;
      if (stats.resolves % 3 === 0) stats.hours += 1;
      renderStats();
    }

    function nextTask(): TaskDef {
      const d = TASKS[pickIdx % TASKS.length];
      pickIdx++;
      return d;
    }

    function makeCard(d: TaskDef): Card {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML =
        '<div class="scan"></div><div class="card-top"><span class="tdot"></span><span class="ttl">' +
        d.t +
        '</span><span class="status"><span class="spin" style="display:none"></span><span class="slabel">Queued</span>' +
        CHECK_SVG +
        '</span></div><div class="card-meta"><span class="meta-pre">' +
        d.src +
        '<span class="meta-sep"></span>just now</span><span class="meta-auto"><span class="meta-sep"></span><span class="tag">' +
        d.tag +
        '</span><span class="route">' +
        ROUTE_SVG +
        d.route +
        "</span></span></div>";
      return { el, data: d, busy: false, gone: false };
    }

    function layout(): void {
      for (let i = 0; i < cards.length; i++) {
        cards[i].el.style.transform = "translateY(" + i * SLOT + "px)";
      }
      const n = cards.length;
      if (queueCount) queueCount.textContent = n + " active";
    }

    function spawn(): Card {
      const c = makeCard(nextTask());
      lane!.appendChild(c.el);
      c.el.style.transition = "none";
      c.el.style.transform = "translateY(" + -SLOT + "px)";
      cards.unshift(c);
      // force reflow so the entry transition runs
      void c.el.offsetHeight;
      c.el.style.transition = "";
      layout();
      if (mode === "manual") {
        timers.push(
          setTimeout(
            () => {
              goOverdue(c);
            },
            2200 + Math.random() * 900,
          ),
        );
      }
      return c;
    }

    function setStatus(c: Card, label: string, showSpin: boolean): void {
      const st = c.el.querySelector<HTMLElement>(".slabel");
      if (st) st.textContent = label;
      const sp = c.el.querySelector<HTMLElement>(".spin");
      if (sp) sp.style.display = showSpin ? "inline-block" : "none";
    }

    function goOverdue(c: Card): void {
      if (c.gone || mode !== "manual") return;
      c.el.classList.add("overdue");
      setStatus(c, "Overdue", false);
      const pre = c.el.querySelector<HTMLElement>(".meta-pre");
      if (pre) {
        pre.innerHTML =
          c.data.src +
          '<span class="meta-sep"></span><span style="color:var(--orange);font-weight:600">SLA breached</span>';
      }
      if (c.data.tag === "#success") {
        stats.miss += 1;
        renderStats();
      }
    }

    function exitCard(c: Card): void {
      const idx = cards.indexOf(c);
      if (idx === -1) return;
      const y = idx * SLOT;
      cards.splice(idx, 1);
      c.gone = true;
      c.el.classList.add("exit");
      c.el.style.transform = "translate(135%, " + y + "px)";
      const el = c.el;
      timers.push(
        setTimeout(() => {
          el.remove();
        }, 600),
      );
      layout();
    }

    function cycle(): void {
      if (mode !== "auto") return;
      const c = cards[cards.length - 1];
      if (!c || c.busy) {
        timers.push(setTimeout(cycle, 320));
        return;
      }
      c.busy = true;
      c.el.classList.add("processing");
      setStatus(c, "Processing", true);
      timers.push(
        setTimeout(() => {
          if (c.gone) return;
          c.el.classList.remove("processing");
          c.el.classList.add("done");
          setStatus(c, "Done", false);
          timers.push(
            setTimeout(() => {
              if (c.gone) return;
              exitCard(c);
              bumpResolve();
              timers.push(setTimeout(cycle, 260));
            }, 950),
          );
        }, 1350),
      );
    }

    function spawnLoopAuto(): void {
      if (mode !== "auto") return;
      if (cards.length < MAX_AUTO) spawn();
      const gap = cards.length < 2 ? 700 : 3000;
      timers.push(setTimeout(spawnLoopAuto, gap));
    }

    function spawnLoopManual(): void {
      if (mode !== "manual") return;
      if (cards.length < MAX_MANUAL) spawn();
      timers.push(setTimeout(spawnLoopManual, 780));
    }

    function idleDriftAuto(): void {
      if (mode !== "auto") return;
      stats.handled += 1;
      renderStats();
      driftTimer = setTimeout(idleDriftAuto, 2600);
      timers.push(driftTimer);
    }

    function manualDegrade(): void {
      if (mode !== "manual") return;
      manualAvgMin += 14 + Math.random() * 18;
      renderStats();
      manualTimer = setTimeout(manualDegrade, 1400);
      timers.push(manualTimer);
    }

    function clearAll(): void {
      timers.forEach(clearTimeout);
      timers = [];
      cards = [];
      if (lane) lane.innerHTML = "";
    }

    function startAuto(): void {
      mode = "auto";
      clearAll();
      lane!.classList.remove("manual");
      foot!.classList.remove("manual");
      phSub!.textContent = "Clearing in real time";
      footText!.innerHTML =
        "<b>Nothing piling up.</b> New work is tagged, routed and closed as it arrives.";
      manualAvgMin = 240;
      stats.miss = 0;
      renderStats();
      spawn();
      spawn();
      layout();
      timers.push(setTimeout(spawnLoopAuto, 700));
      timers.push(setTimeout(cycle, 900));
      driftTimer = setTimeout(idleDriftAuto, 2600);
      timers.push(driftTimer);
    }

    function startManual(): void {
      mode = "manual";
      clearAll();
      lane!.classList.add("manual");
      foot!.classList.add("manual");
      phSub!.textContent = "Backlog growing";
      footText!.innerHTML =
        "<b>Work is piling up.</b> Tasks wait, breach SLA and turn overdue — nothing routes itself.";
      renderStats();
      spawn();
      spawn();
      spawn();
      layout();
      timers.push(setTimeout(spawnLoopManual, 500));
      manualTimer = setTimeout(manualDegrade, 1400);
      timers.push(manualTimer);
    }

    /* ----------------------- reduced-motion static state ------------------ */
    function renderReducedMotionStatic(): void {
      // Calm cleared auto layout: a couple of "done"/idle cards, stats shown.
      mode = "auto";
      lane!.classList.remove("manual");
      foot!.classList.remove("manual");
      phSub!.textContent = "Clearing in real time";
      footText!.innerHTML =
        "<b>Nothing piling up.</b> New work is tagged, routed and closed as it arrives.";
      lane!.innerHTML = "";
      cards = [];

      const doneCard = spawn();
      const idleCard = spawn();
      // Drop the entry transform offset so they rest in place immediately.
      layout();

      // Seed one finished card and one idle queued card for a calm snapshot.
      doneCard.el.classList.add("done");
      setStatus(doneCard, "Done", false);
      setStatus(idleCard, "Queued", false);

      renderStats();
    }

    /* ------------------------------ toggle wiring ------------------------- */
    const onToggleClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>("button");
      if (!btn) return;
      const m = btn.getAttribute("data-mode");
      if (m === mode) return;
      toggle.querySelectorAll<HTMLButtonElement>("button").forEach((b) => {
        b.classList.remove("on");
      });
      btn.classList.add("on");
      if (m === "auto") startAuto();
      else startManual();
    };

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Calm static state, no loops / heartbeat. Toggle stays inert but harmless.
      renderStats();
      renderReducedMotionStatic();
    } else {
      toggle.addEventListener("click", onToggleClick);
      renderStats();
      startAuto();
    }

    /* -------------------------------- cleanup ----------------------------- */
    return () => {
      toggle.removeEventListener("click", onToggleClick);
      timers.forEach(clearTimeout);
      timers = [];
      if (driftTimer) clearTimeout(driftTimer);
      if (manualTimer) clearTimeout(manualTimer);
      rafs.forEach((id) => cancelAnimationFrame(id));
      cards = [];
      if (lane) lane.innerHTML = "";
    };
  }, []);

  /* ------------------------------ resting DOM ---------------------------- */
  /*
   * Server-rendered resting state: real, crawlable structure. Two seeded
   * queue cards in the lane, stats visible. The effect takes over on mount
   * and replaces the lane contents with the live (or reduced-motion) state.
   */
  return (
    // Decorative, explicitly "Illustrative" mockup — its message is conveyed by
    // the hero copy, so it's aria-hidden (keeps its animated micro-labels out of
    // the a11y tree / contrast audits). The demo toggle below is tabIndex={-1}
    // so there's no focusable element inside an aria-hidden subtree.
    <div ref={rootRef} aria-hidden="true" className={`ialane panel ${className}`.trim()}>
      {/* CSS injected raw — a JSX text child gets HTML-escaped (content:"" -> &quot;),
          which mismatches the client on hydration (#425). */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="panel-head">
        <div className="ph-left">
          <span className="live">
            <span className="beat" />
          </span>
          <div>
            <div className="ph-titlerow">
              <span className="ph-title">Automation lane</span>
              <span className="ill-tag">Illustrative</span>
            </div>
            <div className="ph-sub" id="ialane-phSub">
              Clearing in real time
            </div>
          </div>
        </div>
        <div className="toggle" id="ialane-toggle">
          <button type="button" tabIndex={-1} data-mode="manual">
            Without automation
          </button>
          <button type="button" tabIndex={-1} data-mode="auto" className="on">
            With Innoviaburst
          </button>
        </div>
      </div>

      <div className="panel-body">
        <div className="lane-col">
          <div className="lane-label">
            <span>Incoming queue</span>
            <span className="count" id="ialane-queueCount">
              2 active
            </span>
          </div>
          {/* Seeded resting cards so crawlers / no-JS see real structure.
              Rendered as opaque HTML (suppressHydrationWarning) — the effect
              clears and re-owns this lane on mount. */}
          <div
            className="lane"
            id="ialane-lane"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: SEEDED_LANE_HTML }}
          />
        </div>

        <div className="mc">
          <div className="mc-head">Mission control</div>

          <div className="stat" id="ialane-stat-handled">
            <div className="stat-top">
              <span className="stat-label">Tasks handled today</span>
              <span className="stat-trend">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 18L11 9l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span id="ialane-trend-handled">live</span>
              </span>
            </div>
            <div className="stat-val">
              <span id="ialane-v-handled">1,248</span>
            </div>
          </div>

          <div className="stat" id="ialane-stat-resp">
            <div className="stat-top">
              <span className="stat-label">Avg response time</span>
              <span className="stat-trend down" id="ialane-trendwrap-resp">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6l7 9 4-4 6 8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span id="ialane-trend-resp">93% faster</span>
              </span>
            </div>
            <div className="stat-val">
              <span className="from">4h</span>
              <span className="arrow">→</span>
              <span id="ialane-v-resp">3m</span>
            </div>
          </div>

          <div className="stat" id="ialane-stat-hours">
            <div className="stat-top">
              <span className="stat-label">Hours saved this week</span>
              <span className="stat-trend">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 18L11 9l4 4 6-8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>+ rising</span>
              </span>
            </div>
            <div className="stat-val">
              <span id="ialane-v-hours">37</span>
            </div>
          </div>

          <div className="stat" id="ialane-stat-miss">
            <div className="stat-top">
              <span className="stat-label">Onboarding misses</span>
              <span className="stat-trend" id="ialane-trendwrap-miss">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M12 5l-5 5M12 5l5 5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(180 12 12)"
                  />
                </svg>
                <span id="ialane-trend-miss">held at zero</span>
              </span>
            </div>
            <div className="stat-val">
              <span id="ialane-v-miss">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-foot" id="ialane-foot">
        <span className="fdot" />
        <span id="ialane-footText">
          <b>Nothing piling up.</b> New work is tagged, routed and closed as it
          arrives.
        </span>
      </div>
    </div>
  );
}

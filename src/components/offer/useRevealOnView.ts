import { useEffect, useRef, useState } from "react";

/**
 * Arms a CSS animation timeline once the element scrolls into view.
 *
 * Returns `[ref, playing]`. Put the ref on the section and render
 * `data-play={playing ? "on" : undefined}` — the stylesheet keys every
 * `animation:` declaration off that attribute.
 *
 * Three properties make this safe against the hydration errors that animated
 * heroes usually trip (React #418 text mismatch / #425 hydration mismatch):
 *
 *  - It never touches `window` or `document` during render. The observer is
 *    created inside `useEffect`, which does not run on the server at all.
 *  - The server and the first client render both produce `playing === false`,
 *    so the markup React hydrates against is byte-identical to the markup the
 *    server emitted. State only flips on a later commit.
 *  - The un-armed state is the FINAL composed state in CSS, not a hidden one.
 *    Without JS — crawler, JS disabled, effect never fires — the hero is fully
 *    visible. Animation is decoration layered on top, never a gate on content.
 *
 * `prefers-reduced-motion: reduce` returns before observing, so nothing is ever
 * armed and no animation or transition is attached. The stylesheet carries the
 * same guard, so the two can't disagree.
 */
export function useRevealOnView<T extends HTMLElement>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // matchMedia is guarded rather than assumed: jsdom and some embedded
    // webviews don't implement it.
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: play immediately rather than never.
      setPlaying(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, playing];
}

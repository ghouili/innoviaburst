import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Render element (default div). */
  as?: ElementType;
  /** Stagger the reveal by N ms (for grids). */
  delay?: number;
  /** How much of the element must be visible before revealing (0–1). */
  threshold?: number;
}

type Phase = "visible" | "hidden" | "revealed";

/**
 * Scroll-reveal wrapper — plays the homepage's `fadeInUp` motion once, the
 * moment the element scrolls into view (IntersectionObserver).
 *
 * Progressive enhancement, bulletproof AND cheap on the main thread:
 *  - SSR and the first client render emit NO reveal class → content is fully
 *    VISIBLE. So no-JS, crawlers, and hydration all see real content, and
 *    hydration matches byte-for-byte. Nothing is ever left permanently hidden.
 *  - A post-paint `useEffect` (never a layout effect, and NO getBoundingClientRect)
 *    attaches one IntersectionObserver. Its FIRST callback decides cheaply:
 *      • already on screen → stay visible, stop observing (no animation, no flash);
 *      • off screen → hide (safe: it isn't visible to the user), then reveal on
 *        the next intersection.
 *  - Reduced motion / no IntersectionObserver → stays visible.
 *
 * Deciding from the observer entry (not a measured rect) avoids forcing a layout
 * reflow per instance, keeping the largest-contentful paint and TBT low even
 * with many Reveals on the page.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typeof IntersectionObserver === "undefined" || prefersReduced) {
      return; // leave it visible
    }

    let decided = false;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!decided) {
          decided = true;
          if (entry.isIntersecting) {
            // Already on screen at load — keep it visible, don't animate.
            io.disconnect();
          } else {
            // Off screen — safe to hide, then reveal when it scrolls in.
            setPhase("hidden");
          }
          return;
        }
        if (entry.isIntersecting) {
          setPhase("revealed");
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const revealClass =
    phase === "hidden" ? "lp-reveal" : phase === "revealed" ? "lp-reveal-in" : undefined;

  return (
    <Tag
      ref={ref}
      className={cn(revealClass, className)}
      style={delay && phase !== "visible" ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

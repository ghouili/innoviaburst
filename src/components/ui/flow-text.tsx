import { Fragment } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface FlowTextProps {
  /** The (already-translated) string that may contain → / ← flow arrows. */
  text: string;
  /**
   * When true the arrows are purely decorative (e.g. the swipe hint, where the
   * sentence already reads "Swipe to compare") and carry no screen-reader text.
   * Default false: a → conveys "to" and is announced as such.
   */
  decorative?: boolean;
}

/*
 * Renders copy that uses → / ← as inline "A → B" flow arrows.
 *
 * Why this exists: the self-hosted Inter subset does not include the arrow
 * glyphs (U+2192 / U+2190), so a literal "→" in copy falls back to a system
 * font and sits at a different weight/color next to Inter. Splitting on the
 * arrow and rendering a lucide SVG icon instead keeps the arrow crisp, scales
 * it to the surrounding text (0.8em), and inherits currentColor — no font
 * dependency, consistent weight. Non-arrow strings pass straight through, so
 * this is safe to apply to any shared render path (only some values in a set
 * actually contain an arrow).
 *
 * Accessibility: the icon is aria-hidden; for semantic arrows a visually
 * hidden " to " is emitted so screen readers still hear the relationship
 * ("hours to minutes"). Decorative arrows emit nothing.
 */
const ICON_CLASS = "inline-block h-[0.8em] w-[0.8em] align-[-0.08em] opacity-70";

export function FlowText({ text, decorative = false }: FlowTextProps) {
  if (!text.includes("→") && !text.includes("←")) {
    return <>{text}</>;
  }

  const parts = text.split(/([→←])/);

  return (
    <>
      {parts.map((part, i) => {
        if (part === "→") {
          return (
            <Fragment key={i}>
              {!decorative && <span className="sr-only">to</span>}
              <ArrowRight aria-hidden="true" className={ICON_CLASS} />
            </Fragment>
          );
        }
        if (part === "←") {
          return <ArrowLeft key={i} aria-hidden="true" className={ICON_CLASS} />;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

import { useTranslation } from "react-i18next";
import { PillBadge } from "@/components/ui/pill-badge";

/**
 * CredibilityStrip — the slot directly under the hero that will hold a real
 * testimonial or client logo strip.
 *
 * It ships as an explicitly-labelled placeholder rather than as invented logos
 * or an unattributed quote: the "Placeholder" chip and the copy both say so in
 * plain language. Swapping in real proof is a content change — replace the
 * dashed slots with real logo images (or a quote + attribution), drop the chip.
 *
 * Kept deliberately slim (one row on desktop) so it reads as a supporting line
 * under the hero, not as another section competing with it.
 */
export function CredibilityStrip() {
  const { t } = useTranslation();

  return (
    <section
      className="border-b border-border bg-background"
      aria-label={t("credibility.label")}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-muted-foreground">
            <PillBadge variant="meta" size="sm" className="uppercase tracking-wide">
              {t("credibility.badge")}
            </PillBadge>
            <span>{t("credibility.note")}</span>
          </p>

          {/* Reserved logo slots — decorative until real marks replace them. */}
          <ul
            className="flex shrink-0 items-center gap-2.5"
            aria-hidden="true"
          >
            {[0, 1, 2].map((i) => (
              <li
                key={i}
                className="h-7 w-20 rounded-md border border-dashed border-border/80 bg-muted/40 sm:w-24"
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

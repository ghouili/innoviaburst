import { useTranslation } from "react-i18next";

/**
 * Founder's-note trust card (spec P1-10).
 *
 * Deliberately NOT a testimonial: it is a signed statement about how we work,
 * which is a claim we can stand behind today, rather than a quote attributed to
 * a client we don't have permission to name. The proof placeholder underneath is
 * explicitly labelled so nobody mistakes the holding line for a real case study.
 *
 * When real quotes exist, this card is the container: swap the note for the
 * quote, the monogram for the client's avatar, and delete the placeholder block.
 */
export function FounderNote({ note, placeholder }: { note: string; placeholder: string }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Monogram — an SVG mark, not a stock portrait of a person who doesn't exist */}
        <svg
          viewBox="0 0 56 56"
          className="h-14 w-14 shrink-0"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="56" height="56" rx="16" fill="hsl(var(--deep-blue-dark))" />
          <text
            x="28"
            y="34"
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill="hsl(0 0% 100%)"
            fontFamily="Inter, system-ui, sans-serif"
          >
            IB
          </text>
          <circle cx="43" cy="14" r="4" fill="hsl(var(--orange))" />
        </svg>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-2">
            {t("offerPage.ui.founderNoteLabel")}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">{note}</p>

          {/* Clearly-marked placeholder — swapped for a real case study later */}
          <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t("offerPage.ui.proofPlaceholderLabel")}
            </p>
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

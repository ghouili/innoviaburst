import { useTranslation } from "react-i18next";
import { Check, Circle } from "lucide-react";
import { FeatureRow } from "./FeatureRow";

export type ScopeItem = string | { title: string; body: string };

const rowProps = (item: ScopeItem) =>
  typeof item === "string" ? { body: item } : { title: item.title, body: item.body };

/**
 * "What's included" and "What's not included" merged into a single comparison
 * card (spec P0-3).
 *
 * They were two blocks a full section apart, which made the exclusions read as a
 * disclaimer buried down the page. Side by side they read as what they actually
 * are — a deliberate scope boundary, and the intro line says so outright: a tight
 * scope is the thing that makes a weeks-long timeline possible.
 *
 * Items accept either a plain string or a {title, body} pair, so offers whose
 * copy has been rewritten get the bold-lead treatment while the others keep
 * rendering their existing single-line deliverables.
 */
export function OfferComparisonCard({
  included,
  excluded,
  excludedIntro,
}: {
  included: ScopeItem[];
  excluded: ScopeItem[];
  excludedIntro?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Included */}
        <div className="p-5 lg:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
            <Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
            {t("offerPage.ui.comparison.included")}
          </h2>
          <ul className="space-y-3">
            {included.map((item, i) => (
              <FeatureRow key={i} Icon={Check} {...rowProps(item)} />
            ))}
          </ul>
        </div>

        {/* Out of scope, on purpose */}
        <div className="p-5 lg:p-6 bg-muted/30">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
            <Circle className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
            {t("offerPage.ui.comparison.excluded")}
          </h2>
          {excludedIntro && (
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{excludedIntro}</p>
          )}
          <ul className={`space-y-3 ${excludedIntro ? "" : "mt-4"}`}>
            {excluded.map((item, i) => (
              <FeatureRow
                key={i}
                Icon={Circle}
                iconClassName="text-muted-foreground/70"
                muted
                {...rowProps(item)}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

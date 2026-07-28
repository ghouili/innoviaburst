import { useTranslation } from "react-i18next";
import { TrendingUp, Layers, Users } from "lucide-react";

/*
 * Proof points with i18n keys.
 *
 * `compliance` ("UK/EU data compliance built-in") and `delivery` ("Delivery in
 * weeks, not months") were dropped: the hero chips already carry the GDPR and
 * timeline claims a screen higher, so repeating them here read as filler rather
 * than as proof. Each remaining point says something the hero does not.
 *
 * The three that stayed are phrased as specific, checkable commitments (named
 * tools, a named artefact, a named approval step) rather than as adjectives —
 * "Measurable ROI from day one" is a claim anyone can make, "hours saved,
 * measured before and after, in writing" is one a client can hold us to.
 */
const proofPointKeys = [
  { icon: TrendingUp, key: "proofStrip.roi" },
  { icon: Layers, key: "proofStrip.tools" },
  { icon: Users, key: "proofStrip.oversight" },
];

export function ProofStrip() {
  const { t } = useTranslation();

  return (
    <section 
      className="py-6 lg:py-8 bg-card border-y border-border"
      aria-label={t("proofStrip.label", "Key benefits")}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4" role="list">
          {proofPointKeys.map((point, index) => (
            <li
              key={index}
              className="flex max-w-full items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-muted rounded-2xl sm:rounded-full text-xs sm:text-sm font-medium text-foreground text-balance"
            >
              <point.icon className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
              <span>{t(point.key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
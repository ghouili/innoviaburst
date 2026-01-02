import { useTranslation } from "react-i18next";
import { Clock, TrendingUp, Shield, Layers, Users } from "lucide-react";

// Proof points with i18n keys
const proofPointKeys = [
  { icon: Clock, key: "proofStrip.delivery" },
  { icon: TrendingUp, key: "proofStrip.roi" },
  { icon: Shield, key: "proofStrip.compliance" },
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
        <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-6" role="list">
          {proofPointKeys.map((point, index) => (
            <li
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-muted rounded-full text-xs sm:text-sm font-medium text-foreground"
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
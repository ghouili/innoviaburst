import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Zap, Settings, Rocket, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Offer keys for i18n lookup
const offerKeys = [
  { slug: "ai-ops-sprint", key: "sprint", icon: Zap, featured: false },
  { slug: "automation-build", key: "build", icon: Settings, featured: true },
  { slug: "mvp-launch", key: "mvp", icon: Rocket, featured: false },
];

interface OffersSectionProps {
  onBookingClick?: () => void;
}

const featuredIndex = Math.max(
  0,
  offerKeys.findIndex((o) => o.featured)
);

// Row keys for comparison table
const rowKeys = [
  { labelKey: "offers.table.timeline", valueKey: "timeline" },
  { labelKey: "offers.table.startingPrice", valueKey: "price" },
  { labelKey: "offers.table.multiSystem", valueKey: "multiSystem" },
  { labelKey: "offers.table.documentation", valueKey: "documentation" },
  { labelKey: "offers.table.bestFor", valueKey: "bestForShort" },
];

function OffersComparisonTable() {
  const { t } = useTranslation();
  
  return (
    <div className="min-w-[560px]">
      <table className="w-full text-sm">
      <thead className="bg-muted/30">
        <tr className="border-b border-border">
          <th
            scope="col"
            className="py-3 px-3 sm:py-4 sm:px-4 text-left font-semibold text-foreground text-xs sm:text-sm"
          >
            {t("offers.table.feature", "Feature")}
          </th>

          {offerKeys.map((offer, idx) => (
            <th
              key={offer.slug}
              scope="col"
              className={[
                "py-3 px-2 sm:py-4 sm:px-4 text-center font-semibold text-xs sm:text-sm",
                idx === featuredIndex ? "text-accent" : "text-foreground",
              ].join(" ")}
            >
              {t(`offers.${offer.key}.title`)}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="text-muted-foreground">
        {rowKeys.map((row, rowIdx) => (
          <tr
            key={row.labelKey}
            className={
              rowIdx < rowKeys.length - 1 ? "border-b border-border/50" : ""
            }
          >
            <td className="py-2 px-3 sm:py-3 sm:px-4 text-foreground/90 text-xs sm:text-sm">{t(row.labelKey)}</td>

            {offerKeys.map((offer, idx) => (
              <td
                key={`${row.labelKey}-${offer.slug}`}
                className={[
                  "py-2 px-2 sm:py-3 sm:px-4 text-center text-xs sm:text-sm",
                  row.valueKey === "bestForShort" ? "text-xs" : "",
                  idx === featuredIndex ? "text-foreground" : "",
                ].join(" ")}
              >
                {t(`offers.${offer.key}.${row.valueKey}`)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export function OffersSection({ onBookingClick }: OffersSectionProps) {
  const { t } = useTranslation();
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleOfferClick = (offerTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "offer_click", offer: offerTitle },
      })
    );
  };

  return (
    <section id="offers" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("offers.title", "Productised")} <span className="text-gradient-brand">{t("offers.titleHighlight", "Offers")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("offers.subtitle", "Fixed scope. Clear timelines. Predictable outcomes.")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {offerKeys.map((offer, index) => {
            const IconComponent = offer.icon;
            const deliverables = t(`offers.${offer.key}.deliverables`, { returnObjects: true }) as string[];
            
            return (
            <div
              key={offer.slug}
              className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                offer.featured
                  ? "bg-card border-accent shadow-glow"
                  : "bg-card border-border shadow-card hover:shadow-card-hover"
              }`}
            >
              {offer.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  {t("offers.mostPopular")}
                </div>
              )}

              <div className="flex flex-col justify-between h-full gap-6">
                <div className="space-y-6">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        offer.featured ? "bg-accent/20" : "bg-muted"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${
                          offer.featured ? "text-accent" : "text-secondary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {t(`offers.${offer.key}.title`)}
                      </h3>
                      <p className="text-sm text-accent font-medium">
                        {t(`offers.${offer.key}.timeline`)}
                      </p>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="py-3 px-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {t("offers.bestFor")}:
                      </span>{" "}
                      {t(`offers.${offer.key}.bestFor`)}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      {t("offers.deliverables")}:
                    </p>
                    <ul className="space-y-2">
                      {Array.isArray(deliverables) && deliverables.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Metrics */}
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      {t("offers.successMetrics")}:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {t(`offers.${offer.key}.metrics`)}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Price */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-2xl font-bold text-gradient-orange">
                      {t(`offers.${offer.key}.price`)}
                    </p>
                  </div>

                  {/* CTA - Links to offer page */}
                  <Button
                    variant={offer.featured ? "hero" : "outline"}
                    size="lg"
                    className="w-full min-h-[48px]"
                    onClick={() => handleOfferClick(t(`offers.${offer.key}.title`))}
                    asChild
                  >
                    <Link to={`/${offer.slug}`}>{t("offers.getScope")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          )})}
        </div>
        {/* Disclaimer under the pricing cards */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("offers.disclaimer", "All costs subject to scope — priced from £450/day (tools & subscriptions billed separately).")}
        </p>

        {/* Comparison Accordion */}
        <Collapsible
          open={isCompareOpen}
          onOpenChange={setIsCompareOpen}
          className="max-w-4xl mx-auto"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {t("offers.compareOffers")}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCompareOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {/* Scroll hint for mobile users */}
            <p className="text-xs text-muted-foreground text-center mb-2 sm:hidden">
              {t("offers.swipeHint", "← Swipe to compare →")}
            </p>
            <div className="overflow-x-auto bg-card rounded-xl border border-border p-4 scrollbar-hide">
              {/* <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-4 text-left font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-foreground">
                      AI Ops Sprint
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-accent">
                      Automation Build
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-foreground">
                      MVP Launch
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Timeline</td>
                    <td className="py-3 px-4 text-center">10 days</td>
                    <td className="py-3 px-4 text-center">4–6 weeks</td>
                    <td className="py-3 px-4 text-center">6–10 weeks</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Starting price</td>
                    <td className="py-3 px-4 text-center">£5k</td>
                    <td className="py-3 px-4 text-center">£15k</td>
                    <td className="py-3 px-4 text-center">£25k</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Multi-system integration</td>
                    <td className="py-3 px-4 text-center">1 system</td>
                    <td className="py-3 px-4 text-center">Multiple</td>
                    <td className="py-3 px-4 text-center">Multiple</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Documentation</td>
                    <td className="py-3 px-4 text-center">Lightweight</td>
                    <td className="py-3 px-4 text-center">Full</td>
                    <td className="py-3 px-4 text-center">Full</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Best for</td>
                    <td className="py-3 px-4 text-center text-xs">
                      Quick wins
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      Complex workflows
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      New products
                    </td>
                  </tr>
                </tbody>
              </table> */}
              <OffersComparisonTable />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroVisual } from "./HeroVisual";
// import { Hero3DVisual } from "./Hero3DVisual";

interface HeroSectionProps {
  onBookingClick?: () => void;
  onRequestClick?: () => void;
}

export function HeroSection({ onBookingClick, onRequestClick }: HeroSectionProps) {
  const { t } = useTranslation();

  const handlePrimaryClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_primary" } }));
    if (onRequestClick) {
      onRequestClick();
    } else if (onBookingClick) {
      onBookingClick();
    }
  }, [onBookingClick, onRequestClick]);

  const handleSecondaryClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_secondary" } }));
  }, []);

    return (
    <section className="relative min-h-[90vh] pt-20 lg:pt-24 overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Visual - Hidden on mobile for performance, shown on lg+ (order-2 on desktop = RIGHT side) */}
          <div className="hidden lg:flex order-2 justify-center lg:justify-end">
            <HeroVisual className="animate-slide-in-right" />
          </div>

          {/* Text content - order-1 on desktop = LEFT side */}
          <div className="order-1 space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                {t("hero.headlinePre", "Ship")} <span className="text-gradient-brand">{t("hero.headlineHighlight", "AI & automation")}</span> {t("hero.headlinePost", "in weeks, not months.")}
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                {t("hero.subheadline")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handlePrimaryClick} 
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] gap-2 text-sm sm:text-base px-5 sm:px-8"
              >
                {t("hero.primaryCta", "Request an automation plan")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              <Button 
                variant="hero-outline" 
                size="lg" 
                onClick={handleSecondaryClick} 
                asChild 
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8"
              >
                <Link to="/automations">{t("hero.secondaryCta", "See automations")}</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                {t("hero.trustPoints.delivery", "First delivery in ~10 days")}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                {t("hero.trustPoints.gdpr", "UK GDPR ready")}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent shrink-0" aria-hidden="true" />
                {t("hero.trustPoints.agnostic", "Tool-agnostic")}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

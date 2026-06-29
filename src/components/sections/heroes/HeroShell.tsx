import type { ReactNode } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/pill-badge";

interface HeroShellProps {
  /** Right-column visual (Design 1 panel or Design 2 canvas). Swap this to switch heroes. */
  visual: ReactNode;
  /** Secondary CTA ("Get a fixed scope in 48h") opens the scope/request flow. */
  onScopeClick?: () => void;
}

const CHIPS = [
  { key: "delivery", Icon: Clock, variant: "info" as const },
  { key: "compliance", Icon: ShieldCheck, variant: "success" as const },
  { key: "price", Icon: Sparkles, variant: "category" as const },
  { key: "residency", Icon: MapPin, variant: "neutral" as const },
];

/**
 * Shared hero scaffold: compliance-native copy + CTAs + trust chips on the left,
 * a configurable animated `visual` on the right. Home uses the Automation-lane
 * panel; the /lp/ai-automation landing page uses the Weave canvas — swapping the
 * two designs between routes is a one-line change to the `visual` prop.
 */
export function HeroShell({ visual, onScopeClick }: HeroShellProps) {
  const { t } = useTranslation();

  const handleScope = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_scope" } }),
    );
    onScopeClick?.();
  }, [onScopeClick]);

  const handleShipped = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_shipped" } }),
    );
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-hero pt-20 lg:pt-24">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-6 py-10 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT — copy */}
          <div className="order-1 space-y-7 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
              {t("hero.eyebrow")}
            </span>

            <h1 className="text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-[3.4rem]">
              {t("hero.h1Pre")}
              <span className="text-gradient-brand">{t("hero.h1Accent")}</span>
              {t("hero.h1Post")}
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("hero.lede")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="hero"
                size="lg"
                asChild
                onClick={handleShipped}
                className="min-h-[48px] gap-2 text-sm sm:text-base"
              >
                <Link to="/works">
                  {t("hero.ctaShipped")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={handleScope}
                className="min-h-[48px] text-sm sm:text-base"
              >
                {t("hero.ctaScope")}
              </Button>
            </div>

            <ul className="flex flex-wrap gap-2.5 pt-1" aria-label="Trust signals">
              {CHIPS.map(({ key, Icon, variant }) => (
                <li key={key}>
                  <PillBadge variant={variant}>
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {t(`hero.chips.${key}`)}
                  </PillBadge>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — configurable visual */}
          <div className="order-2 w-full">{visual}</div>
        </div>
      </div>
    </section>
  );
}

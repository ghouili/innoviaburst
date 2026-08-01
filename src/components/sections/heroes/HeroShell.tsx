import type { ReactNode } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/pill-badge";

interface HeroShellProps {
  /** Right-column visual (Design 1 panel or Design 2 canvas). Swap this to switch heroes. */
  visual: ReactNode;
  /** Primary CTA ("Get a fixed scope in 48h") opens the scope/request flow. */
  onScopeClick?: () => void;
  /** Secondary CTA ("Book a 15-min call") opens the booking flow. */
  onBookClick?: () => void;
}

/*
 * Three chips only. The dropped "Scoped in 48h" chip said the same thing as the
 * primary CTA one line above it; each remaining chip carries a claim nothing
 * else on the page makes.
 */
const CHIPS = [
  { key: "delivery", Icon: Clock, variant: "info" as const },
  { key: "compliance", Icon: ShieldCheck, variant: "success" as const },
  { key: "residency", Icon: MapPin, variant: "neutral" as const },
];

/**
 * Shared hero scaffold: compliance-native copy + CTAs + trust chips on the left,
 * a configurable animated `visual` on the right. Home uses the Automation-lane
 * panel; the /lp/ai-automation landing page uses the Weave canvas — swapping the
 * two designs between routes is a one-line change to the `visual` prop.
 */
export function HeroShell({ visual, onScopeClick, onBookClick }: HeroShellProps) {
  const { t } = useTranslation();

  const handleScope = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_scope" } }),
    );
    onScopeClick?.();
  }, [onScopeClick]);

  const handleBook = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_book" } }),
    );
    onBookClick?.();
  }, [onBookClick]);

  const handleBrowse = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_automations" } }),
    );
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-hero pt-20 lg:pt-24">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      {/*
        Blueprint grid backdrop, the one piece of the "Innoviaburst Hero" design
        file that wasn't already in AutomationLaneVisual. Two soft radial tints
        plus a 48px rule grid, masked to fade out behind the copy column so it
        never competes with the headline. Re-skinned to the brand tokens and
        purely decorative: no motion, so nothing to disable under reduced
        motion.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1200px 600px at 85% -10%, hsl(24 95% 53% / 0.06), transparent 60%)," +
            "radial-gradient(900px 500px at -5% 110%, hsl(var(--secondary) / 0.05), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground) / 0.025) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(var(--foreground) / 0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(900px 700px at 70% 40%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(900px 700px at 70% 40%, #000, transparent 75%)",
        }}
      />

      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
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

            {/*
              One primary verb + one secondary, matched by StickyNextStep so the
              same two actions follow the visitor down the page. The old primary
              ("See what we've shipped") pointed at /works, which is a
              coming-soon placeholder — it's now a tertiary link to the real
              automation library instead.
            */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleScope}
                  className="min-h-[48px] gap-2 text-sm sm:text-base"
                >
                  {t("hero.ctaScope")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="hero-outline"
                  size="lg"
                  onClick={handleBook}
                  className="min-h-[48px] gap-2 text-sm sm:text-base"
                >
                  <Calendar className="h-4 w-4" />
                  {t("hero.ctaBook")}
                </Button>
              </div>

              <Link
                to="/automations"
                onClick={handleBrowse}
                className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("hero.ctaBrowse")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <ul className="flex flex-wrap gap-2.5 pt-1" aria-label={t("hero.chipsLabel")}>
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

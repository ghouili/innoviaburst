import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Rocket, Code2, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Icons map 1:1 to mvpSection.points (build/deploy/analytics · code & IP · compliance).
const POINT_ICONS = [Rocket, Code2, ShieldCheck];

/**
 * Homepage MVP band — surfaces the MVP Launch service alongside automation so it
 * doesn't read as secondary. Reuses the standard section rhythm (gradient-brand
 * heading + card grid + hero CTA) and internal-links to /mvp-launch.
 */
export function MvpSection() {
  const { t } = useTranslation();
  const points = t("mvpSection.points", { returnObjects: true }) as string[];

  return (
    <section id="mvp" className="py-20 lg:py-28 bg-gradient-hero">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("mvpSection.title")}{" "}
            <span className="text-gradient-brand">{t("mvpSection.titleHighlight")}</span>
            {t("mvpSection.titleAfter")}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("mvpSection.subtitle")}
          </p>
        </div>

        {/* 3 points */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {Array.isArray(points) &&
            points.map((point, i) => {
              const Icon = POINT_ICONS[i] ?? Rocket;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-4 p-6 bg-card rounded-2xl border border-border shadow-card"
                >
                  <div className="p-3 rounded-xl bg-secondary/10">
                    <Icon className="w-6 h-6 text-secondary" aria-hidden="true" />
                  </div>
                  <p className="text-base font-semibold text-foreground">{point}</p>
                </div>
              );
            })}
        </div>

        {/* CTA — internal link to the MVP Launch offer page */}
        <div className="text-center">
          <Button variant="hero" size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
            <Link to="/mvp-launch">
              {t("mvpSection.cta")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

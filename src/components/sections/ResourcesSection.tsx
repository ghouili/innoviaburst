import { Calculator, CheckSquare, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Resource cards: icons/keys stay in TS; copy comes from `resourcesSection.cards.<key>.*`.
const resources = [
  { icon: Calculator, key: "roi" },
  { icon: CheckSquare, key: "checklist" },
  { icon: Shield, key: "compliance" },
] as const;

export function ResourcesSection() {
  const { t } = useTranslation();

  const handleResourceClick = (resourceTitle: string) => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "resource_click", resource: resourceTitle } }));
  };

  return (
    <section id="resources" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            <span className="text-gradient-brand">{t("resourcesSection.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("resourcesSection.subtitle")}
          </p>
        </div>

        {/* Resources Grid - 3 featured cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {resources.map((resource) => {
            const title = t(`resourcesSection.cards.${resource.key}.title`);

            return (
              <a
                key={resource.key}
                href="#contact"
                onClick={() => handleResourceClick(title)}
                className="group p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-muted group-hover:bg-accent/20 transition-colors">
                      <resource.icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                    </div>
                    <span className="text-xs font-semibold text-accent-strong bg-accent/10 px-3 py-1 rounded-full">
                      {t(`resourcesSection.cards.${resource.key}.tag`)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t(`resourcesSection.cards.${resource.key}.description`)}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                    {t("resourcesSection.getAccess")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/resources">
              {t("resourcesSection.browseAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

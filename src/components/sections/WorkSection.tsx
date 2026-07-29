import { ArrowRight, FileText, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Case study slugs map to copy under `caseStudies.<slug>.*` in i18n.
const caseStudySlugs = [
  "professional-services-client-onboarding",
  "saas-support-ticket-triage",
] as const;

interface CaseStudyResult {
  metric: string;
  label: string;
}

export function WorkSection() {
  const { t } = useTranslation();

  const handleRequestBreakdown = (caseTitle: string) => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "case_study_click", case: caseTitle } }));
  };

  return (
    <section id="work" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            <span className="text-gradient-brand">{t("work.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("work.subtitle")}
          </p>
        </div>

        {/* Case Studies */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {caseStudySlugs.map((slug) => {
            const title = t(`caseStudies.${slug}.title`);
            const results = t(`caseStudies.${slug}.results`, { returnObjects: true }) as CaseStudyResult[];

            return (
              <Link
                key={slug}
                to={`/work/${slug}`}
                className="p-6 lg:p-8 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
                onClick={() => handleRequestBreakdown(title)}
              >
                <div className="space-y-6">
                  {/* Label */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
                    <FileText className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent-strong">{t(`caseStudies.${slug}.label`)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">{title}</h3>

                  {/* Problem */}
                  <div>
                    <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">{t("workPage.labelProblem")}</p>
                    <p className="text-sm text-muted-foreground">{t(`caseStudies.${slug}.cardProblem`)}</p>
                  </div>

                  {/* Solution */}
                  <div>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">{t("workPage.labelSolution")}</p>
                    <p className="text-sm text-muted-foreground">{t(`caseStudies.${slug}.cardSolution`)}</p>
                  </div>

                  {/* Results */}
                  <div>
                    <p className="text-xs font-semibold text-accent-strong uppercase tracking-wide mb-3">{t("workPage.labelResults")}</p>
                    <div className="grid grid-cols-3 gap-4">
                      {Array.isArray(results) && results.map((result, i) => (
                        <div key={i} className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-accent" />
                            <p className="text-lg font-bold text-foreground">{result.metric}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{result.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-xs text-muted-foreground italic">{t(`caseStudies.${slug}.note`)}</p>

                  {/* CTA */}
                  <div className="flex items-center text-sm font-medium text-secondary group-hover:text-accent-strong transition-colors">
                    {t("work.viewCaseStudy")}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/works">
              {t("work.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

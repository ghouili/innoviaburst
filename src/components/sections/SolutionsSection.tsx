import { useTranslation } from "react-i18next";
import {
  DollarSign,
  Headphones,
  BarChart3,
  Calculator,
  Brain,
  Code,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

/**
 * Top Workflows — a category explorer, not a card grid.
 *
 * The homepage already stacks three card grids (offers, MVP, training); a fourth
 * one made the page read as a single long deck. The same six workflows are now
 * grouped under three category tabs, and each panel lays them out as detail rows
 * (title + KPI on the left, "fixes" / "tools" on the right) so the section has a
 * different rhythm from the bands above it.
 *
 * SSG note: every panel is `forceMount`ed so all six workflows are in the
 * pre-rendered HTML (nothing is hidden behind a click for crawlers). Radix drops
 * its `hidden` attribute when forceMount is set, so inactive panels are hidden by
 * `data-[state=inactive]:hidden` instead — same result, content still in the DOM.
 */

type WorkflowKey =
  | "leadToMeeting"
  | "demoQualification"
  | "supportTriage"
  | "dunning"
  | "onboarding"
  | "knowledgeBase";

const categories: { key: string; workflows: { key: WorkflowKey; icon: LucideIcon }[] }[] = [
  {
    key: "revenue",
    workflows: [
      { key: "leadToMeeting", icon: DollarSign },
      { key: "demoQualification", icon: BarChart3 },
    ],
  },
  {
    key: "support",
    workflows: [
      { key: "supportTriage", icon: Headphones },
      { key: "knowledgeBase", icon: Brain },
    ],
  },
  {
    key: "ops",
    workflows: [
      { key: "dunning", icon: Calculator },
      { key: "onboarding", icon: Code },
    ],
  },
];

export function SolutionsSection() {
  const { t } = useTranslation();

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("solutions.title", "Top")} <span className="text-gradient-brand">{t("solutions.titleHighlight", "Workflows")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("solutions.subtitle", "Pre-built patterns for common automation challenges.")}
          </p>
        </div>

        <Tabs defaultValue={categories[0].key} className="max-w-4xl mx-auto">
          <TabsList
            aria-label={t("solutions.categoriesLabel", "Workflow categories")}
            className="grid w-full grid-cols-3 h-auto gap-1 rounded-xl bg-muted p-1"
          >
            {categories.map((category) => (
              <TabsTrigger
                key={category.key}
                value={category.key}
                className="min-h-[44px] whitespace-normal rounded-lg px-2 py-2 text-[11px] leading-tight sm:text-sm"
              >
                {t(`solutions.categories.${category.key}.label`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.key}
              value={category.key}
              forceMount
              className="mt-6 data-[state=inactive]:hidden"
            >
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t(`solutions.categories.${category.key}.hint`)}
              </p>

              <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
                {category.workflows.map((workflow) => {
                  const IconComponent = workflow.icon;
                  return (
                    <li
                      key={workflow.key}
                      className="grid gap-4 p-5 sm:p-6 md:grid-cols-12 md:gap-6"
                    >
                      {/* Identity + outcome */}
                      <div className="md:col-span-5">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 p-2.5 rounded-xl bg-gradient-blue">
                            <IconComponent className="w-5 h-5 text-secondary-foreground" aria-hidden="true" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-foreground text-balance">
                            {t(`solutions.items.${workflow.key}.title`)}
                          </h3>
                        </div>
                        <p className="mt-3 text-xs font-semibold text-accent-strong uppercase tracking-wide">
                          {t("solutions.exampleKpi")}
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gradient-orange">
                          {t(`solutions.items.${workflow.key}.kpi`)}
                        </p>
                      </div>

                      {/* Detail */}
                      <dl className="md:col-span-7 grid gap-4 sm:grid-cols-2 md:border-l md:border-border md:pl-6">
                        <div>
                          <dt className="text-xs font-semibold text-accent-strong uppercase tracking-wide mb-1">
                            {t("solutions.whatItFixes")}
                          </dt>
                          <dd className="text-sm text-muted-foreground">
                            {t(`solutions.items.${workflow.key}.fixes`)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold text-accent-strong uppercase tracking-wide mb-1">
                            {t("solutions.typicalTools")}
                          </dt>
                          <dd className="text-sm text-muted-foreground">
                            {t(`solutions.items.${workflow.key}.tools`)}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  );
                })}
              </ul>
            </TabsContent>
          ))}
        </Tabs>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Button
            variant="hero"
            size="lg"
            asChild
            className="w-full sm:w-auto min-h-[48px]"
          >
            <Link to="/automations">
              {t("solutions.cta", "See full Automations Library")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

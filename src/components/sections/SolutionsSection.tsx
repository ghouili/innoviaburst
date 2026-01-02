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

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// const solutions = [
//   {
//     icon: DollarSign,
//     title: "Lead-to-Cash Automation",
//     fixes: "Manual CRM updates, missed follow-ups, invoice delays",
//     tools: "HubSpot, Salesforce, Xero, Stripe",
//     kpi: "40% faster deal-to-invoice cycle",
//   },
//   {
//     icon: Headphones,
//     title: "Support Automation",
//     fixes: "Slow ticket triage, repeated questions, context switching",
//     tools: "Zendesk, Intercom, Freshdesk, Slack",
//     kpi: "60% reduction in first-response time",
//   },
//   {
//     icon: BarChart3,
//     title: "RevOps Automation",
//     fixes: "Lead routing chaos, stale data, manual enrichment",
//     tools: "HubSpot, Clearbit, Slack, Notion",
//     kpi: "3x faster lead-to-SDR handoff",
//   },
//   {
//     icon: Calculator,
//     title: "Finance Ops",
//     fixes: "Approval bottlenecks, reconciliation delays, reporting gaps",
//     tools: "Xero, QuickBooks, Expensify, Slack",
//     kpi: "80% reduction in reconciliation time",
//   },
//   {
//     icon: Brain,
//     title: "Knowledge Copilots",
//     fixes: "Information silos, repeated questions, slow onboarding",
//     tools: "Google Drive, Notion, Confluence, Teams",
//     kpi: "50% fewer internal support queries",
//   },
//   {
//     icon: Code,
//     title: "Integrations & Internal Tooling",
//     fixes: "Disconnected systems, manual data entry, no visibility",
//     tools: "Custom APIs, webhooks, Retool, Supabase",
//     kpi: "Zero manual data entry between systems",
//   },
// ];

// Solution keys for i18n lookup
const solutionKeys = [
  { key: "leadToMeeting", icon: DollarSign },
  { key: "demoQualification", icon: BarChart3 },
  { key: "supportTriage", icon: Headphones },
  { key: "dunning", icon: Calculator },
  { key: "onboarding", icon: Code },
  { key: "knowledgeBase", icon: Brain },
];

export function SolutionsSection() {
  const { t } = useTranslation();

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("solutions.title", "Top")} <span className="text-gradient-brand">{t("solutions.titleHighlight", "Workflows")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("solutions.subtitle", "Pre-built patterns for common automation challenges.")}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutionKeys.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
            <div
              key={solution.key}
              className="group flex flex-col justify-between gap-10 p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-blue">
                    <IconComponent className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t(`solutions.items.${solution.key}.title`)}
                  </h3>
                </div>

                {/* What it fixes */}
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                    {t("solutions.whatItFixes")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`solutions.items.${solution.key}.fixes`)}
                  </p>
                </div>

                {/* Typical tools */}
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                    {t("solutions.typicalTools")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`solutions.items.${solution.key}.tools`)}
                  </p>
                </div>
              </div>
                {/* Example KPI */}
                <div className="pt-4 border-t border-border min-h-20 flex flex-col justify-start">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">
                    {t("solutions.exampleKpi")}
                  </p>
                  <p className="text-base font-semibold text-gradient-orange">
                    {t(`solutions.items.${solution.key}.kpi`)}
                  </p>
                </div>
            </div>
          )})}
        </div>

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

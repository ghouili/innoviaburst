import { DollarSign, Headphones, BarChart3, Calculator, Brain, Code, ArrowRight } from "lucide-react";

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

const solutions = [
  {
    icon: DollarSign,
    title: "Lead-to-Meeting in 60 Seconds",
    fixes: "Leads sit unassigned, follow-ups are slow, and hot prospects drop.",
    tools: "HubSpot, Slack, Calendly, Webhook",
    kpi: "Response time reduced from hours to minutes",
  },
  {
    icon: BarChart3,
    title: "Website Demo Requests → Qualification → Routing",
    fixes: "Low-context demo requests waste time and slow response to good-fit leads.",
    tools: "HubSpot, Slack, Calendly, Gmail",
    kpi: "More qualified calls + fewer no-shows",
  },
  {
    icon: Headphones,
    title: "AI Support Triage + Draft Reply",
    fixes: "Repetitive tickets and manual routing slow teams down and break SLAs.",
    tools: "Zendesk (or Gmail), Slack, OpenAI, Notion (KB)",
    kpi: "30–60% faster first response",
  },
  {
    icon: Calculator,
    title: "Stripe Payment Failed → Smart Dunning + CRM Update",
    fixes: "Failed payments cause churn and revenue leakage; follow-up is inconsistent.",
    tools: "Stripe, HubSpot, Gmail, Slack",
    kpi: "Higher recovery rate + fewer manual chases",
  },
  {
    icon: Code,
    title: "Sales Handoff → Onboarding Checklist Automation",
    fixes: "Post-sale onboarding steps get missed, delaying value and increasing churn risk.",
    tools: "HubSpot, Notion (or Asana), Slack, Gmail",
    kpi: "Fewer onboarding misses + faster time-to-value",
  },
  {
    icon: Brain,
    title: "AI Knowledge Base Builder (Tickets/Docs → FAQ Suggestions)",
    fixes: "Knowledge is scattered/outdated, answers repeat, and onboarding is slow.",
    tools: "Notion, Zendesk (or Gmail), OpenAI, Slack",
    kpi: "Fewer repetitive tickets + faster onboarding",
  },
];

export function SolutionsSection() {
  return (
    <section id="solutions" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Top <span className="text-gradient-brand">Workflows</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pre-built patterns for common automation challenges.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-blue">
                    <solution.icon className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{solution.title}</h3>
                </div>

                {/* What it fixes */}
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">What it fixes</p>
                  <p className="text-sm text-muted-foreground">{solution.fixes}</p>
                </div>

                {/* Typical tools */}
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Typical tools</p>
                  <p className="text-sm text-muted-foreground">{solution.tools}</p>
                </div>

                {/* Example KPI */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-1">Example KPI</p>
                  <p className="text-base font-semibold text-gradient-orange">{solution.kpi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-10">
          <Button variant="hero" size="lg" asChild className="min-h-[48px]">
            <Link to="/automations">
              See full Automations Library
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight, FileText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const caseStudies = [
  {
    slug: "professional-services-client-onboarding",
    label: "Pilot Case Study",
    title: "Professional Services Firm — Client Onboarding",
    problem: "Manual client intake taking 4+ hours per new client. Documents scattered across email, shared drives, and CRM.",
    solution: "Automated intake form → HubSpot deal creation → Document generation → Task assignment in Asana.",
    results: [
      { metric: "~6–12 hrs/week", label: "Time saved" },
      { metric: "80%", label: "Fewer manual steps" },
      { metric: "2 days", label: "Faster client start" },
    ],
    note: "Example outcome — actual results may vary",
  },
  {
    slug: "saas-support-ticket-triage",
    label: "Pilot Case Study",
    title: "B2B SaaS — Support Ticket Triage",
    problem: "Support team spending 2+ hours daily on manual ticket categorisation and routing to specialists.",
    solution: "AI-powered ticket analysis → Auto-categorisation → Smart routing → Slack notifications.",
    results: [
      { metric: "~8–10 hrs/week", label: "Time saved" },
      { metric: "60%", label: "Faster first response" },
      { metric: "95%", label: "Routing accuracy" },
    ],
    note: "Example outcome — actual results may vary",
  },
];

export function WorkSection() {
  const handleRequestBreakdown = (caseTitle: string) => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "case_study_click", case: caseTitle } }));
  };

  return (
    <section id="work" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our <span className="text-gradient-brand">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real automation projects with measurable outcomes.
          </p>
        </div>

        {/* Case Studies */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {caseStudies.map((study, index) => (
            <Link
              key={index}
              to={`/work/${study.slug}`}
              className="p-6 lg:p-8 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              onClick={() => handleRequestBreakdown(study.title)}
            >
              <div className="space-y-6">
                {/* Label */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-semibold text-accent">{study.label}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">{study.title}</h3>

                {/* Problem */}
                <div>
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">Problem</p>
                  <p className="text-sm text-muted-foreground">{study.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Solution</p>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>

                {/* Results */}
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">Results</p>
                  <div className="grid grid-cols-3 gap-4">
                    {study.results.map((result, i) => (
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
                <p className="text-xs text-muted-foreground italic">{study.note}</p>

                {/* CTA */}
                <div className="flex items-center text-sm font-medium text-secondary group-hover:text-accent transition-colors">
                  View full case study
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/work">
              View all case studies
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Calculator, CheckSquare, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const resources = [
  {
    icon: Calculator,
    title: "Automation ROI Calculator",
    description: "Estimate time and cost savings from automating your workflows.",
    tag: "Calculator",
  },
  {
    icon: CheckSquare,
    title: "AI Copilot Rollout Checklist",
    description: "Step-by-step guide to deploying AI assistants in your organisation.",
    tag: "Checklist",
  },
  {
    icon: Shield,
    title: "UK/EU Compliance Basics for AI",
    description: "Plain-English guide to GDPR, AI Act, and data handling requirements.",
    tag: "Guide",
  },
];

export function ResourcesSection() {
  const handleResourceClick = (resourceTitle: string) => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "resource_click", resource: resourceTitle } }));
  };

  return (
    <section id="resources" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            <span className="text-gradient-brand">Resources</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Free tools and guides to help you plan your automation journey.
          </p>
        </div>

        {/* Resources Grid - 3 featured cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {resources.map((resource, index) => (
            <a
              key={index}
              href="#contact"
              onClick={() => handleResourceClick(resource.title)}
              className="group p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-muted group-hover:bg-accent/20 transition-colors">
                    <resource.icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    {resource.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                  Get access
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/resources">
              Browse all resources
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

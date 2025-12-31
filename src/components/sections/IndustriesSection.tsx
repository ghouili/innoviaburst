import { Briefcase, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const industries = [
  {
    icon: Briefcase,
    title: "Professional Services SMEs",
    description: "Legal, accounting, and consulting firms with complex client workflows and compliance requirements.",
    examples: [
      "Client onboarding automation",
      "Document generation & routing",
      "Time tracking integrations",
      "Compliance reporting",
    ],
  },
  {
    icon: Rocket,
    title: "B2B SaaS & Funded Startups",
    description: "Fast-growing companies that need to scale operations without scaling headcount.",
    examples: [
      "Customer success automation",
      "Product-led growth workflows",
      "Revenue operations",
      "Internal tools & dashboards",
    ],
  },
];

export function IndustriesSection() {
  return (
    <section id="industries" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Industries We <span className="text-gradient-brand">Serve</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Deep expertise in high-value automation for UK/EU businesses.
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="p-8 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-blue">
                    <industry.icon className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{industry.title}</h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{industry.description}</p>

                {/* Examples */}
                <div className="grid grid-cols-2 gap-3">
                  {industry.examples.map((example, i) => (
                    <div key={i} className="px-4 py-2.5 bg-muted rounded-lg text-sm text-foreground">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 space-y-3">
          <Button variant="outline" size="lg" asChild>
            <Link to="/industries">
              View all industries
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            More industries coming soon
          </p>
        </div>
      </div>
    </section>
  );
}

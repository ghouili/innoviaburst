import { Clock, TrendingUp, Shield, Layers, Users } from "lucide-react";

// Anonymised proof points - no customer claims without permission
const proofPoints = [
  {
    icon: Clock,
    text: "Delivery in weeks, not months",
  },
  {
    icon: TrendingUp,
    text: "Measurable ROI from day one",
  },
  {
    icon: Shield,
    text: "UK/EU data compliance built-in",
  },
  {
    icon: Layers,
    text: "Works with your existing tools",
  },
  {
    icon: Users,
    text: "Human oversight on every project",
  },
];

export function ProofStrip() {
  return (
    <section 
      className="py-6 lg:py-8 bg-card border-y border-border"
      aria-label="Key benefits"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <ul className="flex flex-wrap justify-center gap-3 lg:gap-6" role="list">
          {proofPoints.map((point, index) => (
            <li
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 bg-muted rounded-full text-sm font-medium text-foreground"
            >
              <point.icon className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
              <span>{point.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
import { useState } from "react";
import { Zap, Settings, Rocket, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const offers = [
  {
    slug: "ai-ops-sprint",
    icon: Zap,
    title: "AI Ops Sprint",
    timeline: "10 business days",
    bestFor: "Ops teams drowning in manual steps",
    deliverables: [
      "1 workflow automated OR 1 copilot shipped (scoped)",
      "Lightweight documentation + handover",
    ],
    metrics: "Hours saved/week, faster response time",
    price: "From £3k",
    cta: "Get a scope in 48h",
  },
  {
    slug: "automation-build",
    icon: Settings,
    title: "Automation Build",
    timeline: "4–6 weeks",
    bestFor: "Cross-tool automation + approvals + reporting",
    deliverables: [
      "Multi-system workflow (CRM/helpdesk/invoicing)",
      "Logging + alerts + retry strategy",
    ],
    metrics: "Cycle-time reduction, fewer errors",
    price: "From £7k",
    cta: "Get a scope in 48h",
    featured: true,
  },
  {
    slug: "mvp-launch",
    icon: Rocket,
    title: "MVP Launch",
    timeline: "6–10 weeks",
    bestFor: "Startups & SMEs launching a new product",
    deliverables: ["MVP build + deploy + analytics", "Basic security + roles"],
    metrics: "Time-to-market, activation rate",
    price: "From £13k",
    cta: "Get a scope in 48h",
  },
];

interface OffersSectionProps {
  onBookingClick?: () => void;
}

const featuredIndex = Math.max(
  0,
  offers.findIndex((o) => o.featured)
);

const getMultiSystemLabel = (offer) => {
  // derived ONLY from offer data (deliverables/titles), no extra hardcoding
  const text = [offer.title, ...(offer.deliverables || [])]
    .join(" ")
    .toLowerCase();
  if (text.includes("multi-system") || text.includes("multi system"))
    return "Multiple";
  if (
    text.includes("crm/") ||
    text.includes("helpdesk/") ||
    text.includes("invoicing")
  )
    return "Multiple";
  return "1 system";
};

const getDocumentationLabel = (offer) => {
  const text = (offer.deliverables || []).join(" ").toLowerCase();
  if (text.includes("lightweight documentation")) return "Lightweight";
  if (text.includes("documentation")) return "Full";
  // fallback based on scope implied by deliverables length
  return (offer.deliverables?.length || 0) >= 2 ? "Full" : "Lightweight";
};

const rows = [
  { label: "Timeline", value: (o) => o.timeline },
  { label: "Starting price", value: (o) => o.price },
  { label: "Multi-system integration", value: (o) => getMultiSystemLabel(o) },
  { label: "Documentation", value: (o) => getDocumentationLabel(o) },
  { label: "Best for", value: (o) => o.bestFor },
];

function OffersComparisonTable() {
  return (
    <div className="min-w-[600px]">
      <table className="w-full text-sm">
      <thead className="bg-muted/30">
        <tr className="border-b border-border">
          <th
            scope="col"
            className="py-4 px-4 text-left font-semibold text-foreground"
          >
            Feature
          </th>

          {offers.map((offer, idx) => (
            <th
              key={offer.slug}
              scope="col"
              className={[
                "py-4 px-4 text-center font-semibold",
                idx === featuredIndex ? "text-accent" : "text-foreground",
              ].join(" ")}
            >
              {offer.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="text-muted-foreground">
        {rows.map((row, rowIdx) => (
          <tr
            key={row.label}
            className={
              rowIdx < rows.length - 1 ? "border-b border-border/50" : ""
            }
          >
            <td className="py-3 px-4 text-foreground/90">{row.label}</td>

            {offers.map((offer, idx) => (
              <td
                key={`${row.label}-${offer.slug}`}
                className={[
                  "py-3 px-4 text-center",
                  row.label === "Best for" ? "text-xs" : "",
                  idx === featuredIndex ? "text-foreground" : "",
                ].join(" ")}
              >
                {row.value(offer)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export function OffersSection({ onBookingClick }: OffersSectionProps) {
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleOfferClick = (offerTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "offer_click", offer: offerTitle },
      })
    );
  };

  return (
    <section id="offers" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Productised <span className="text-gradient-brand">Offers</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Fixed scope. Clear timelines. Predictable outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {offers.map((offer, index) => (
            <div
              key={index}
              className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                offer.featured
                  ? "bg-card border-accent shadow-glow"
                  : "bg-card border-border shadow-card hover:shadow-card-hover"
              }`}
            >
              {offer.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className=" flex flex-col justify-between h-full gap-6">
                <div className=" space-y-6">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        offer.featured ? "bg-accent/20" : "bg-muted"
                      }`}
                    >
                      <offer.icon
                        className={`w-6 h-6 ${
                          offer.featured ? "text-accent" : "text-secondary"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-accent font-medium">
                        {offer.timeline}
                      </p>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="py-3 px-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Best for:
                      </span>{" "}
                      {offer.bestFor}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Deliverables:
                    </p>
                    <ul className="space-y-2">
                      {offer.deliverables.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success Metrics */}
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      Success metrics:{" "}
                    </span>
                    <span className="text-muted-foreground">
                      {offer.metrics}
                    </span>
                  </div>
                </div>
                <div className=" space-y-6">
                  {/* Price */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-2xl font-bold text-gradient-orange">
                      {offer.price}
                    </p>
                  </div>

                  {/* CTA - Links to offer page */}
                  <Button
                    variant={offer.featured ? "hero" : "outline"}
                    size="lg"
                    className="w-full min-h-[48px]"
                    onClick={() => handleOfferClick(offer.title)}
                    asChild
                  >
                    <Link to={`/${offer.slug}`}>{offer.cta}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Disclaimer under the pricing cards */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          All costs subject to scope — priced from £450/day (tools &amp;
          subscriptions billed separately).
        </p>

        {/* Comparison Accordion */}
        <Collapsible
          open={isCompareOpen}
          onOpenChange={setIsCompareOpen}
          className="max-w-4xl mx-auto"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Compare offers
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCompareOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="overflow-x-auto bg-card rounded-xl border border-border p-4">
              {/* <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-4 text-left font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-foreground">
                      AI Ops Sprint
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-accent">
                      Automation Build
                    </th>
                    <th className="py-4 px-4 text-center font-semibold text-foreground">
                      MVP Launch
                    </th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Timeline</td>
                    <td className="py-3 px-4 text-center">10 days</td>
                    <td className="py-3 px-4 text-center">4–6 weeks</td>
                    <td className="py-3 px-4 text-center">6–10 weeks</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Starting price</td>
                    <td className="py-3 px-4 text-center">£5k</td>
                    <td className="py-3 px-4 text-center">£15k</td>
                    <td className="py-3 px-4 text-center">£25k</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Multi-system integration</td>
                    <td className="py-3 px-4 text-center">1 system</td>
                    <td className="py-3 px-4 text-center">Multiple</td>
                    <td className="py-3 px-4 text-center">Multiple</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3 px-4">Documentation</td>
                    <td className="py-3 px-4 text-center">Lightweight</td>
                    <td className="py-3 px-4 text-center">Full</td>
                    <td className="py-3 px-4 text-center">Full</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Best for</td>
                    <td className="py-3 px-4 text-center text-xs">
                      Quick wins
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      Complex workflows
                    </td>
                    <td className="py-3 px-4 text-center text-xs">
                      New products
                    </td>
                  </tr>
                </tbody>
              </table> */}
              <OffersComparisonTable />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
}

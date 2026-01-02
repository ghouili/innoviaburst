import { useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Briefcase, Rocket, Building2, Stethoscope, ShoppingCart, Check } from "lucide-react";

const industries = [
  {
    icon: Briefcase,
    title: "Professional Services SMEs",
    description: "Legal, accounting, and consulting firms with complex client workflows and compliance requirements.",
    typicalWorkflows: [
      "Client onboarding & intake forms",
      "Document generation & routing",
      "Time tracking integrations",
      "Compliance reporting & audits",
      "Invoice generation & follow-up",
    ],
    toolStacks: ["HubSpot", "Xero/QuickBooks", "Google Workspace", "Asana/Monday", "DocuSign"],
    buyingTriggers: [
      "Growing client base but can't hire fast enough",
      "Too much time on admin vs. billable work",
      "Compliance pressure increasing",
      "Client onboarding taking too long",
    ],
    exampleKPIs: [
      "40% reduction in client onboarding time",
      "8–12 hrs/week saved on admin",
      "50% faster invoice cycle",
    ],
    primary: true,
  },
  {
    icon: Rocket,
    title: "B2B SaaS & Funded Startups",
    description: "Fast-growing companies that need to scale operations without scaling headcount proportionally.",
    typicalWorkflows: [
      "Customer success automation",
      "Product-led growth workflows",
      "Revenue operations (RevOps)",
      "Support ticket triage & routing",
      "Internal tools & dashboards",
    ],
    toolStacks: ["HubSpot/Salesforce", "Zendesk/Intercom", "Slack", "Notion", "Stripe"],
    buyingTriggers: [
      "Series A/B pressure to improve unit economics",
      "Support team overwhelmed",
      "Lead routing chaos",
      "Manual reporting taking too long",
    ],
    exampleKPIs: [
      "60% faster first response time",
      "3x faster lead-to-SDR handoff",
      "20% reduction in churn",
    ],
    primary: true,
  },
  {
    icon: Building2,
    title: "Property & Real Estate",
    description: "Estate agents, property managers, and developers with high-volume client communication.",
    typicalWorkflows: [
      "Lead capture & qualification",
      "Viewing scheduling automation",
      "Tenant communication",
      "Maintenance request routing",
      "Document management",
    ],
    toolStacks: ["Property CRMs", "Microsoft 365", "WhatsApp Business", "Calendly"],
    buyingTriggers: [
      "High lead volume, low conversion",
      "Agents spending too much time on admin",
      "Tenant communication gaps",
    ],
    exampleKPIs: [
      "2x lead response speed",
      "30% more viewings scheduled",
      "50% reduction in missed follow-ups",
    ],
    primary: false,
  },
  {
    icon: Stethoscope,
    title: "Healthcare & Clinics",
    description: "Private clinics and healthcare providers with patient communication and scheduling needs.",
    typicalWorkflows: [
      "Appointment booking & reminders",
      "Patient intake forms",
      "Prescription reminders",
      "Feedback collection",
      "Referral management",
    ],
    toolStacks: ["Practice management systems", "NHS integrations", "SMS platforms"],
    buyingTriggers: [
      "High no-show rates",
      "Staff overwhelmed with phone calls",
      "Patient communication gaps",
    ],
    exampleKPIs: [
      "40% reduction in no-shows",
      "60% fewer phone calls",
      "Faster patient intake",
    ],
    primary: false,
  },
  {
    icon: ShoppingCart,
    title: "E-commerce & DTC Brands",
    description: "Online retailers with customer service, inventory, and marketing automation needs.",
    typicalWorkflows: [
      "Order status automation",
      "Customer service triage",
      "Inventory alerts",
      "Review collection",
      "Return processing",
    ],
    toolStacks: ["Shopify/WooCommerce", "Gorgias/Zendesk", "Klaviyo", "Google Sheets"],
    buyingTriggers: [
      "Customer service backlog",
      "Manual order tracking",
      "High return rates",
    ],
    exampleKPIs: [
      "50% faster customer response",
      "20% reduction in returns queries",
      "Automated order updates",
    ],
    primary: false,
  },
];

export default function IndustriesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const primaryIndustries = industries.filter(i => i.primary);
  const comingIndustries = industries.filter(i => !i.primary);

  return (
    <>
      <SeoHead
        title="Industries We Serve | Innoviaburst"
        description="Deep expertise in automation for Professional Services SMEs, B2B SaaS, and more. UK/EU focused delivery with compliance awareness."
        path="/industries"
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Industries We <span className="text-gradient-brand">Serve</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Deep expertise in high-value automation for UK/EU businesses. We understand your workflows, tools, and compliance needs.
            </p>
          </div>
        </section>

        {/* Primary Industries */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">Primary Focus</h2>
            <div className="space-y-12">
              {primaryIndustries.map((industry, index) => (
                <div key={index} className="p-8 bg-card rounded-2xl border border-border shadow-card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-blue">
                      <industry.icon className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{industry.title}</h3>
                      <p className="text-muted-foreground">{industry.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Workflows */}
                    <div>
                      <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Typical Workflows</h4>
                      <ul className="space-y-2">
                        {industry.typicalWorkflows.map((workflow, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {workflow}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tool Stacks */}
                    <div>
                      <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Common Tools</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.toolStacks.map((tool, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Buying Triggers */}
                    <div>
                      <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">When to Automate</h4>
                      <ul className="space-y-2">
                        {industry.buyingTriggers.map((trigger, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {trigger}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Example KPIs */}
                    <div>
                      <h4 className="text-sm font-semibold text-accent uppercase tracking-wide mb-3">Example Results</h4>
                      <ul className="space-y-2">
                        {industry.exampleKPIs.map((kpi, i) => (
                          <li key={i} className="text-sm font-medium text-foreground">{kpi}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="outline" onClick={() => setBookingOpen(true)}>
                      Discuss {industry.title.split(' ')[0]} automation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Industries */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Expanding to More Industries</h2>
            <p className="text-muted-foreground mb-8">
              We're actively building expertise in these sectors. Get in touch if you're in one of these industries.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {comingIndustries.map((industry, index) => (
                <div key={index} className="p-6 bg-card rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <industry.icon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{industry.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{industry.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {industry.typicalWorkflows.slice(0, 3).map((workflow, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {workflow}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic">Coming soon</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Don't see your industry?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Our automation patterns often transfer across industries. Let's discuss your specific workflows.
            </p>
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto">
              Book a 15-min call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, TrendingUp, Briefcase, Rocket, User, Linkedin } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

const caseStudies = [
  {
    slug: "professional-services-client-onboarding",
    label: "Pilot Case Study",
    industry: "Professional Services",
    icon: Briefcase,
    title: "Professional Services Firm — Client Onboarding",
    problem: "Manual client intake taking 4+ hours per new client. Documents scattered across email, shared drives, and CRM.",
    solution: "Automated intake form → HubSpot deal creation → Document generation → Task assignment in Asana.",
    results: [
      { metric: "~6–12 hrs/week", label: "Time saved" },
      { metric: "80%", label: "Fewer manual steps" },
      { metric: "2 days", label: "Faster client start" },
    ],
    tools: ["HubSpot", "Asana", "Google Docs", "Zapier"],
    note: "Example outcome — actual results may vary",
  },
  {
    slug: "saas-support-ticket-triage",
    label: "Pilot Case Study",
    industry: "B2B SaaS",
    icon: Rocket,
    title: "B2B SaaS — Support Ticket Triage",
    problem: "Support team spending 2+ hours daily on manual ticket categorisation and routing to specialists.",
    solution: "AI-powered ticket analysis → Auto-categorisation → Smart routing → Slack notifications.",
    results: [
      { metric: "~8–10 hrs/week", label: "Time saved" },
      { metric: "60%", label: "Faster first response" },
      { metric: "95%", label: "Routing accuracy" },
    ],
    tools: ["Zendesk", "OpenAI", "Slack", "Make"],
    note: "Example outcome — actual results may vary",
  },
];

export default function WorkPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  const breadcrumbSchema = useMemo(
    () =>
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Work", url: `${siteUrl}/works` },
      ]),
    []
  );

  const workListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Case Studies",
      itemListOrder: "Unordered",
      itemListElement: caseStudies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: study.title,
        url: `${siteUrl}/work/${study.slug}`,
      })),
    }),
    []
  );

  return (
    <>
      <SeoHead
        title="Our Work — Case Studies | Innoviaburst"
        description="Real automation projects with measurable outcomes. See how we've helped UK/EU businesses save time, reduce errors, and scale operations."
        canonicalPath="/works"
        alternates={buildAlternates("/works")}
        jsonLd={[orgJsonLd(), websiteJsonLd(), breadcrumbSchema, workListSchema]}
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
              Our <span className="text-gradient-brand">Work</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Real automation projects with measurable outcomes. We believe in showing, not telling.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-4">
              <Link to="/automations" className="text-secondary hover:underline">
                Explore the automation library
              </Link>
              <Link to="/trust" className="text-secondary hover:underline">
                Review trust & compliance approach
              </Link>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {caseStudies.map((study, index) => (
                <Link
                  key={index}
                  to={`/work/${study.slug}`}
                  className="p-6 lg:p-8 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="space-y-6">
                    {/* Label & Industry */}
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full">
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-semibold text-accent">{study.label}</span>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                        <study.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{study.industry}</span>
                      </div>
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

                    {/* Tools */}
                    <div className="flex flex-wrap gap-2">
                      {study.tools.map((tool, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                          {tool}
                        </span>
                      ))}
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

            {/* Founder Credibility Block */}
            <div className="max-w-2xl mx-auto mb-16">
              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-secondary/20 shrink-0">
                    <User className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Built by Engineers, for Business Impact</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 10+ years of software engineering and automation experience</li>
                      <li>• Proven delivery process: scope → build → handover → support</li>
                      <li>• Deep expertise in integration patterns and AI/ML workflows</li>
                    </ul>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          Founder LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More coming note */}
            <div className="text-center p-0 bg-muted/30 rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-2">More case studies coming</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're actively working with UK/EU clients on new automation projects. Full details available on request.
              </p>
              {/* <Button variant="hero" onClick={() => setBookingOpen(true)}>
                Discuss your project
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button> */}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to start your automation project?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Let's discuss how we can help you achieve similar results.
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
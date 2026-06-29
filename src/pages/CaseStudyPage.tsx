import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, Clock, Users, Wrench, FileText, Lock } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, localizedUrl } from "@/seo/jsonld";

const caseStudies: Record<string, {
  title: string;
  industry: string;
  teamSize: string;
  problem: string;
  solution: string;
  workflow: string[];
  timeline: string;
  results: { metric: string; label: string }[];
  tools: string[];
  confidentialNote: string;
}> = {
  "professional-services-client-onboarding": {
    title: "Professional Services Firm — Client Onboarding",
    industry: "Professional Services (Consulting)",
    teamSize: "15–30 employees",
    problem: "Client onboarding was taking 4+ hours per new client. Documents were scattered across email, shared drives, and CRM. Admin staff spent significant time on manual data entry and follow-ups.",
    solution: "We built an automated client intake workflow that captures form submissions, creates CRM deals, generates standard documents, and assigns tasks to the right team members.",
    workflow: [
      "Client completes intake form (branded, mobile-friendly)",
      "Form data validated and enriched",
      "HubSpot deal created with all client details",
      "Welcome documents generated from templates",
      "Tasks assigned to relevant team members in Asana",
      "Automated follow-up sequence started",
    ],
    timeline: "Delivered in 8 business days",
    results: [
      { metric: "~6–12 hrs/week", label: "Time saved" },
      { metric: "80%", label: "Fewer manual steps" },
      { metric: "2 days", label: "Faster client start" },
    ],
    tools: ["HubSpot CRM", "Google Forms", "Google Docs", "Asana", "Zapier"],
    confidentialNote: "Full client details available on request under NDA. Numbers shown are representative of typical outcomes.",
  },
  "saas-support-ticket-triage": {
    title: "B2B SaaS — Support Ticket Triage",
    industry: "B2B SaaS (Software)",
    teamSize: "50–100 employees",
    problem: "Support team spending 2+ hours daily on manual ticket categorisation and routing. First response times were slow, and specialist tickets often went to generalists first.",
    solution: "We implemented an AI-powered ticket analysis system that automatically categorises, prioritises, and routes tickets to the right specialist, with smart auto-responses for common queries.",
    workflow: [
      "Ticket received in Zendesk",
      "AI analyses ticket content and sentiment",
      "Category and priority automatically assigned",
      "Routed to appropriate specialist queue",
      "Auto-response sent for common queries",
      "Slack notification to on-call team",
    ],
    timeline: "Delivered in 12 business days",
    results: [
      { metric: "~8–10 hrs/week", label: "Time saved" },
      { metric: "60%", label: "Faster first response" },
      { metric: "95%", label: "Routing accuracy" },
    ],
    tools: ["Zendesk", "OpenAI API", "Slack", "Make (Integromat)"],
    confidentialNote: "Full client details available on request under NDA. Numbers shown are representative of typical outcomes.",
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingOpen, setBookingOpen] = useState(false);

  const study = slug ? caseStudies[slug] : null;

  if (!study) {
    return (
      <>
        <Navbar onBookingClick={() => setBookingOpen(true)} />
        <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Case study not found</h1>
            <Link to="/" className="text-accent hover:underline">Return to home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={`${study.title} | Case Study | Innoviaburst`}
        description={`${study.problem.slice(0, 150)}... See how we automated this workflow for UK/EU teams with AI copilots and resilient workflow automations.`}
        canonicalPath={`/work/${slug}`}
        alternates={buildAlternates(`/work/${slug}`)}
        ogType="article"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Work", url: `${siteUrl}/works` },
            { name: study.title, url: `${siteUrl}/work/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: study.title,
            description: study.problem,
            articleSection: study.industry,
            author: { "@type": "Organization", name: "Innoviaburst", url: siteUrl },
            mainEntityOfPage: localizedUrl(`/work/${slug}`),
            datePublished: "2025-01-01",
          },
        ]}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/#work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Our Work
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full mb-4">
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">Pilot Case Study</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {study.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{study.teamSize}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                <span>{study.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{study.timeline}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Problem */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center text-destructive text-sm font-bold">1</span>
                    The Problem
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{study.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">2</span>
                    What We Built
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{study.solution}</p>
                  
                  {/* Workflow diagram */}
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4">Workflow Steps</h3>
                    <div className="space-y-3">
                      {study.workflow.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">3</span>
                    Results
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {study.results.map((result, i) => (
                      <div key={i} className="p-4 bg-card rounded-xl border border-border text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <p className="text-2xl font-bold text-foreground">{result.metric}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confidential note */}
                <div className="p-4 bg-muted rounded-xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground italic">{study.confidentialNote}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tools used */}
                <div className="p-6 bg-card rounded-2xl border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Stack / Tools Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {study.tools.map((tool) => (
                      <span key={tool} className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-lg">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="p-6 bg-gradient-hero rounded-2xl border border-accent/20">
                  <h3 className="text-lg font-bold text-foreground mb-2">Want similar results?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let's discuss how we can automate your workflows.
                  </p>
                  <Button variant="hero" className="w-full" onClick={() => setBookingOpen(true)}>
                    Book a 15-min call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

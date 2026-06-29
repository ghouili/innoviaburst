import { useState } from "react";
import { useTranslation } from "react-i18next";
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

// Route keys (slugs) stay in TS; the human-readable COPY lives in i18n
// under `caseStudies.<slug>.*` (shared with WorkPage). See en.json.
const CASE_STUDY_SLUGS = [
  "professional-services-client-onboarding",
  "saas-support-ticket-triage",
] as const;

interface CaseStudyDetail {
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
}

export default function CaseStudyPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [bookingOpen, setBookingOpen] = useState(false);

  const isKnownSlug = !!slug && (CASE_STUDY_SLUGS as readonly string[]).includes(slug);
  const study: CaseStudyDetail | null = isKnownSlug
    ? {
        title: t(`caseStudies.${slug}.title`),
        industry: t(`caseStudies.${slug}.detailIndustry`),
        teamSize: t(`caseStudies.${slug}.teamSize`),
        problem: t(`caseStudies.${slug}.problem`),
        solution: t(`caseStudies.${slug}.solution`),
        workflow: t(`caseStudies.${slug}.workflow`, { returnObjects: true }) as string[],
        timeline: t(`caseStudies.${slug}.timeline`),
        results: t(`caseStudies.${slug}.results`, { returnObjects: true }) as { metric: string; label: string }[],
        tools: t(`caseStudies.${slug}.tools`, { returnObjects: true }) as string[],
        confidentialNote: t(`caseStudies.${slug}.confidentialNote`),
      }
    : null;

  if (!study) {
    return (
      <>
        <Navbar onBookingClick={() => setBookingOpen(true)} />
        <main className="pt-20 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t("caseStudyPage.notFoundTitle")}</h1>
            <Link to="/" className="text-accent hover:underline">{t("caseStudyPage.returnHome")}</Link>
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
              {t("caseStudyPage.backToWork")}
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 rounded-full mb-4">
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">{t("caseStudyPage.pilotBadge")}</span>
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
                    {t("caseStudyPage.problemHeading")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{study.problem}</p>
                </div>

                {/* Solution */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">2</span>
                    {t("caseStudyPage.solutionHeading")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{study.solution}</p>

                  {/* Workflow diagram */}
                  <div className="p-6 bg-card rounded-2xl border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-4">{t("caseStudyPage.workflowStepsHeading")}</h3>
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
                    {t("caseStudyPage.resultsHeading")}
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
                  <h3 className="text-sm font-semibold text-foreground mb-4">{t("caseStudyPage.toolsHeading")}</h3>
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
                  <h3 className="text-lg font-bold text-foreground mb-2">{t("caseStudyPage.ctaHeading")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("caseStudyPage.ctaText")}
                  </p>
                  <Button variant="hero" className="w-full" onClick={() => setBookingOpen(true)}>
                    {t("caseStudyPage.ctaButton")}
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

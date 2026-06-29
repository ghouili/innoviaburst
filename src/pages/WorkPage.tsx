import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText, TrendingUp, Briefcase, Rocket, User, Linkedin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, localizedUrl } from "@/seo/jsonld";

interface CaseStudyCard {
  slug: string;
  label: string;
  industry: string;
  icon: LucideIcon;
  title: string;
  problem: string;
  solution: string;
  results: { metric: string; label: string }[];
  tools: string[];
  note: string;
}

// Slugs + icons stay in TS (structural / non-copy). The card COPY is shared
// with CaseStudyPage under `caseStudies.<slug>.*` in en.json.
const CASE_STUDY_SLUGS = [
  "professional-services-client-onboarding",
  "saas-support-ticket-triage",
] as const;

const CASE_STUDY_ICONS: Record<string, LucideIcon> = {
  "professional-services-client-onboarding": Briefcase,
  "saas-support-ticket-triage": Rocket,
};

export default function WorkPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  const caseStudies: CaseStudyCard[] = CASE_STUDY_SLUGS.map((slug) => ({
    slug,
    icon: CASE_STUDY_ICONS[slug],
    label: t(`caseStudies.${slug}.label`),
    industry: t(`caseStudies.${slug}.industry`),
    title: t(`caseStudies.${slug}.title`),
    problem: t(`caseStudies.${slug}.cardProblem`),
    solution: t(`caseStudies.${slug}.cardSolution`),
    results: t(`caseStudies.${slug}.results`, { returnObjects: true }) as { metric: string; label: string }[],
    tools: t(`caseStudies.${slug}.cardTools`, { returnObjects: true }) as string[],
    note: t(`caseStudies.${slug}.note`),
  }));

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
        url: localizedUrl(`/work/${study.slug}`),
      })),
    }),
    [caseStudies]
  );

  return (
    <>
      <SeoHead
        title={t("seo.works.title")}
        description={t("seo.works.description")}
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
              {t("workPage.backToHome")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("workPage.headingPrefix")}<span className="text-gradient-brand">{t("workPage.headingHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t("workPage.intro")}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-4">
              <Link to="/automations" className="text-secondary hover:underline">
                {t("workPage.exploreLibrary")}
              </Link>
              <Link to="/trust" className="text-secondary hover:underline">
                {t("workPage.reviewTrust")}
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
                      <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">{t("workPage.labelProblem")}</p>
                      <p className="text-sm text-muted-foreground">{study.problem}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">{t("workPage.labelSolution")}</p>
                      <p className="text-sm text-muted-foreground">{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-3">{t("workPage.labelResults")}</p>
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
                      {t("workPage.viewFullCaseStudy")}
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
                    <h3 className="text-lg font-bold text-foreground">{t("workPage.founderHeading")}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(t("workPage.founderBullets", { returnObjects: true }) as string[]).map((bullet, i) => (
                        <li key={i}>• {bullet}</li>
                      ))}
                    </ul>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-4 h-4 mr-2" />
                          {t("workPage.founderLinkedin")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* More coming note */}
            <div className="text-center p-0 bg-muted/30 rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-2">{t("workPage.moreComingHeading")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("workPage.moreComingText")}
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
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("workPage.ctaHeading")}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t("workPage.ctaText")}
            </p>
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto">
              {t("workPage.ctaButton")}
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
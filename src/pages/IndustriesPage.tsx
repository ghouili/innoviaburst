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
import { ArrowLeft, ArrowRight, Briefcase, Rocket, Building2, Stethoscope, ShoppingCart, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

interface Industry {
  id: string;
  icon: LucideIcon;
  primary: boolean;
  title: string;
  description: string;
  typicalWorkflows: string[];
  toolStacks: string[];
  buyingTriggers: string[];
  exampleKPIs: string[];
}

// Icons + primary/coming flag stay in TS (structural, non-copy). The display
// COPY lives in i18n under `industriesPage.items.<id>.*` (see en.json).
const INDUSTRY_META: { id: string; icon: LucideIcon; primary: boolean }[] = [
  { id: "professional-services", icon: Briefcase, primary: true },
  { id: "b2b-saas", icon: Rocket, primary: true },
  { id: "property-real-estate", icon: Building2, primary: false },
  { id: "healthcare-clinics", icon: Stethoscope, primary: false },
  { id: "ecommerce-dtc", icon: ShoppingCart, primary: false },
];

export default function IndustriesPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  const industries: Industry[] = INDUSTRY_META.map((meta) => ({
    id: meta.id,
    icon: meta.icon,
    primary: meta.primary,
    title: t(`industriesPage.items.${meta.id}.title`),
    description: t(`industriesPage.items.${meta.id}.description`),
    typicalWorkflows: t(`industriesPage.items.${meta.id}.typicalWorkflows`, { returnObjects: true }) as string[],
    toolStacks: t(`industriesPage.items.${meta.id}.toolStacks`, { returnObjects: true }) as string[],
    buyingTriggers: t(`industriesPage.items.${meta.id}.buyingTriggers`, { returnObjects: true }) as string[],
    exampleKPIs: t(`industriesPage.items.${meta.id}.exampleKPIs`, { returnObjects: true }) as string[],
  }));

  const primaryIndustries = industries.filter(i => i.primary);
  const comingIndustries = industries.filter(i => !i.primary);

  const jsonLd = useMemo(
    () => [
      orgJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Industries", url: `${siteUrl}/industries` },
      ]),
    ],
    []
  );

  return (
    <>
      <SeoHead
        title={t("seo.industries.title")}
        description={t("seo.industries.description")}
        canonicalPath="/industries"
        alternates={buildAlternates("/industries")}
        jsonLd={jsonLd}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t("industriesPage.backToHome")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t("industriesPage.headingPrefix")}<span className="text-gradient-brand">{t("industriesPage.headingHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t("industriesPage.intro")}
            </p>
          </div>
        </section>

        {/* Primary Industries */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">{t("industriesPage.primaryHeading")}</h2>
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
                      <h4 className="text-sm font-semibold text-accent-strong uppercase tracking-wide mb-3">{t("industriesPage.workflowsHeading")}</h4>
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
                      <h4 className="text-sm font-semibold text-accent-strong uppercase tracking-wide mb-3">{t("industriesPage.toolsHeading")}</h4>
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
                      <h4 className="text-sm font-semibold text-accent-strong uppercase tracking-wide mb-3">{t("industriesPage.triggersHeading")}</h4>
                      <ul className="space-y-2">
                        {industry.buyingTriggers.map((trigger, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {trigger}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Example KPIs */}
                    <div>
                      <h4 className="text-sm font-semibold text-accent-strong uppercase tracking-wide mb-3">{t("industriesPage.kpisHeading")}</h4>
                      <ul className="space-y-2">
                        {industry.exampleKPIs.map((kpi, i) => (
                          <li key={i} className="text-sm font-medium text-foreground">{kpi}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Button variant="outline" onClick={() => setBookingOpen(true)}>
                      {t("industriesPage.discussPrefix")}{industry.title.split(' ')[0]}{t("industriesPage.discussSuffix")}
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
            <h2 className="text-2xl font-bold text-foreground mb-2">{t("industriesPage.comingHeading")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("industriesPage.comingText")}
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
                  <p className="text-xs text-muted-foreground italic">{t("industriesPage.comingSoon")}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("industriesPage.ctaHeading")}</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t("industriesPage.ctaText")}
            </p>
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto">
              {t("industriesPage.ctaButton")}
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
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SectionHeader } from "@/components/ui/section-header";
import {
  UnifiedCard,
  UnifiedCardHeader,
  UnifiedCardTitle,
  UnifiedCardDescription,
} from "@/components/ui/unified-card";
import { CTABox } from "@/components/ui/cta-box";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ListChecks, Clock, Rocket } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

type FeatureKey = "clearOptions" | "realExamples" | "fastScoping";

const featureKeys: { key: FeatureKey; icon: typeof ListChecks }[] = [
  { key: "clearOptions", icon: ListChecks },
  { key: "realExamples", icon: Sparkles },
  { key: "fastScoping", icon: Clock },
];

export default function ComingSoonPage() {
  const { t, i18n } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  const featureCards = useMemo(
    () =>
      featureKeys.map((item) => ({
        key: item.key,
        icon: item.icon,
        title: t(`comingSoon.features.${item.key}.title`),
        description: t(`comingSoon.features.${item.key}.description`),
      })),
    [t]
  );

  return (
    <>
      <SeoHead
        title={t("comingSoon.seo.title")}
        description={t("comingSoon.seo.description")}
        canonicalPath="/coming-soon"
        alternates={buildAlternates("/coming-soon")}
        lang={i18n.language}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Coming Soon", url: `${siteUrl}/coming-soon` },
          ]),
        ]}
        robots="noindex, nofollow"
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        {t("comingSoon.skipLink")}
      </a>

      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="min-h-screen bg-gradient-hero">
        {/* Background glow */}
        <div
          className="absolute inset-0 bg-gradient-glow pointer-events-none"
          aria-hidden="true"
        />

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-6 animate-fade-in-up">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {t("comingSoon.badge")}
                </p>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                  {t("comingSoon.headline")}{" "}
                  <span className="text-gradient-brand">{t("comingSoon.headlineHighlight")}</span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  {t("comingSoon.subheadline")}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => setBookingOpen(true)}
                    className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] gap-2 text-sm sm:text-base px-5 sm:px-8"
                  >
                    {t("comingSoon.primaryCta")}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant="hero-outline"
                    size="lg"
                    asChild
                    className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8"
                  >
                    <Link to="/automations">{t("comingSoon.secondaryCta")}</Link>
                  </Button>
                </div>
              </div>

              {/* Visual Placeholder */}
              <div className="flex items-center justify-center animate-slide-in-right">
                <div className="relative w-full max-w-md aspect-square">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 via-secondary/10 to-primary/10 blur-3xl" />
                  <div className="relative flex items-center justify-center h-full rounded-3xl border border-border bg-card/50 backdrop-blur-sm">
                    <div className="text-center p-8">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
                        <Rocket className="h-10 w-10 text-accent" />
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {t("comingSoon.visual.title")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("comingSoon.visual.subtitle")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What you'll get Section */}
        <section className="section-padding-sm">
          <div className="container mx-auto px-4 lg:px-6">
            <SectionHeader
              title={t("comingSoon.features.title")}
              subtitle={t("comingSoon.features.subtitle")}
              align="center"
              className="mb-12"
            />

            <div className="grid md:grid-cols-3 gap-6">
              {featureCards.map((card) => (
                <UnifiedCard
                  key={card.key}
                  variant="interactive"
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <card.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <UnifiedCardHeader>
                    <UnifiedCardTitle className="text-lg">
                      {card.title}
                    </UnifiedCardTitle>
                    <UnifiedCardDescription>
                      {card.description}
                    </UnifiedCardDescription>
                  </UnifiedCardHeader>
                </UnifiedCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Box Section */}
        <section className="section-padding">
          <div className="container mx-auto px-4 lg:px-6">
            <CTABox
              title={t("comingSoon.cta.title")}
              subtitle={t("comingSoon.cta.subtitle")}
              primaryCta={{
                label: t("comingSoon.cta.primaryLabel"),
                onClick: () => setBookingOpen(true),
              }}
              secondaryCta={{
                label: t("comingSoon.cta.secondaryLabel"),
                href: "/automations",
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowRight, Workflow, Bot, Rocket, ShieldCheck, Scale, Eye, Clock, GraduationCap } from "lucide-react";
import { orgJsonLd, websiteJsonLd, founderJsonLd, breadcrumbJsonLd, localizedUrl, ORG_ID } from "@/seo/jsonld";
import { ORG_FACTS, hasFounder } from "@/seo/org-facts";

const WHAT_ICONS = [Workflow, Bot, Rocket, GraduationCap];
const APPROACH_ICONS = [Scale, ShieldCheck, Eye, Clock];
const stripUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function AboutPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  const whatItems = t("about.what.items", { returnObjects: true }) as { title: string; body: string }[];
  const approachItems = t("about.approach.items", { returnObjects: true }) as { title: string; body: string }[];

  const founderSchema = founderJsonLd();

  return (
    <>
      <SeoHead
        title={t("about.seo.title")}
        description={t("about.seo.description")}
        canonicalPath="/about"
        alternates={buildAlternates("/about")}
        ogType="website"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          ...(founderSchema ? [founderSchema] : []),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: t("about.hero.title"), url: `${siteUrl}/about` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: localizedUrl("/about"),
            name: t("about.seo.title"),
            mainEntity: { "@id": ORG_ID },
          },
        ]}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-4">{t("about.hero.eyebrow")}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t("about.hero.title")}</h1>
            <p className="text-lg text-muted-foreground">{t("about.hero.lede")}</p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12 lg:py-16 border-b border-border">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("about.mission.title")}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">{t("about.mission.body")}</p>
          </div>
        </section>

        {/* What we do */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-3">{t("about.what.title")}</h2>
            <p className="text-base text-muted-foreground mb-8 max-w-2xl">{t("about.what.body")}</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {whatItems.map((item, i) => {
                const Icon = WHAT_ICONS[i] ?? Workflow;
                return (
                  <div key={i} className="p-6 bg-card rounded-xl border border-border">
                    <Icon className="w-6 h-6 text-accent mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How we work */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">{t("about.approach.title")}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {approachItems.map((item, i) => {
                const Icon = APPROACH_ICONS[i] ?? ShieldCheck;
                return (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-secondary/15 shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership / founder */}
        <section className="py-12 lg:py-16 border-t border-border">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("about.founder.title")}</h2>
            {hasFounder() ? (
              <div className="p-6 bg-card rounded-2xl border border-border">
                <p className="text-lg font-bold text-foreground">{ORG_FACTS.founder.name}</p>
                {ORG_FACTS.founder.jobTitle && (
                  <p className="text-sm text-accent-strong mb-2">{ORG_FACTS.founder.jobTitle}</p>
                )}
                {ORG_FACTS.founder.sameAs.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-3 text-sm">
                    <span className="text-muted-foreground">{t("about.founder.connectLabel")}:</span>
                    {ORG_FACTS.founder.sameAs.map((u) => (
                      <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                        {stripUrl(u)}
                      </a>
                    ))}
                  </p>
                )}
              </div>
            ) : (
              // No invented founder: a clearly-marked placeholder until org-facts.ts
              // is populated. Renders the real card automatically once a name is set.
              <p className="text-sm text-muted-foreground italic">{t("about.founder.placeholder")}</p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{t("about.cta.title")}</h2>
            <p className="text-muted-foreground mb-8">{t("about.cta.body")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="min-h-[48px] sm:min-h-[52px] px-5 sm:px-8">
                {t("about.cta.button")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="hero-outline" size="lg" asChild className="min-h-[48px] sm:min-h-[52px] px-5 sm:px-8">
                <Link to="/works">{t("about.cta.secondary")}</Link>
              </Button>
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

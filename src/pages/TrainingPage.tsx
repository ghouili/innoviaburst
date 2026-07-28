import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Workflow,
  Bot,
  ShieldCheck,
  Scale,
  MonitorPlay,
  Users,
  Award,
  Cog,
  Code2,
  Rocket,
  Check,
  Handshake,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { TrainingRequestModal } from "@/components/training/TrainingRequestModal";
import type { TrainingModalMode } from "@/components/training/TrainingRequestModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { UnifiedCard } from "@/components/ui/unified-card";
import { PillBadge } from "@/components/ui/pill-badge";
import {
  breadcrumbJsonLd,
  orgJsonLd,
  websiteJsonLd,
  serviceJsonLd,
  faqJsonLd,
} from "@/seo/jsonld";

interface CopyItem {
  title: string;
  description: string;
}
interface TrackItem extends CopyItem {
  topics: string[];
}
interface FaqItem {
  question: string;
  answer: string;
}

// Structural metadata (icons only) stays in TS. All display COPY lives in i18n
// under `trainingPage.*` so it localizes. Order maps 1:1 to the i18n arrays.
const TRACK_ICONS: LucideIcon[] = [Bot, Code2, Workflow, Scale];
const FORMAT_ICONS: LucideIcon[] = [MonitorPlay, Users, Award];
const AUDIENCE_ICONS: LucideIcon[] = [Cog, Code2, Rocket, ShieldCheck];

const PARTNER_PLACEHOLDER_COUNT = 5;

export default function TrainingPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);
  // One modal, two modes: `null` is closed, otherwise the active flow.
  const [trainingModal, setTrainingModal] = useState<TrainingModalMode | null>(null);

  const tracks = t("trainingPage.tracks.items", { returnObjects: true }) as TrackItem[];
  const formats = t("trainingSection.formats", { returnObjects: true }) as CopyItem[];
  const audience = t("trainingPage.audience.items", { returnObjects: true }) as CopyItem[];
  const steps = t("trainingPage.how.steps", { returnObjects: true }) as CopyItem[];
  const faq = t("trainingPage.faq.items", { returnObjects: true }) as FaqItem[];

  const jsonLd = useMemo(
    () => [
      orgJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Training", url: `${siteUrl}/training` },
      ]),
      serviceJsonLd({
        name: t("trainingPage.schema.serviceName"),
        description: t("trainingPage.schema.serviceDescription"),
        url: "/training",
        serviceType: [
          "AI training",
          "Software development training",
          "Automation training",
          "AI governance training",
        ],
      }),
      ...(Array.isArray(faq) && faq.length
        ? [faqJsonLd(faq.map((f) => ({ question: f.question, answer: f.answer })))]
        : []),
    ],
    [t, faq]
  );

  return (
    <>
      <SeoHead
        title={t("seo.training.title")}
        description={t("seo.training.description")}
        canonicalPath="/training"
        alternates={buildAlternates("/training")}
        jsonLd={jsonLd}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {t("trainingPage.backToHome")}
            </Link>

            <PillBadge variant="category" size="lg">
              <span className="w-2 h-2 rounded-full bg-orange shrink-0" aria-hidden="true" />
              {t("trainingPage.eyebrow")}
            </PillBadge>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground max-w-3xl text-balance">
              {t("trainingPage.headingPrefix")}
              <span className="text-gradient-brand">{t("trainingPage.headingHighlight")}</span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              {t("trainingPage.intro")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <Button
                variant="hero"
                size="lg"
                onClick={() => setTrainingModal("booking")}
                className="w-full sm:w-auto min-h-[48px]"
              >
                {t("trainingPage.ctaPrimary")}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => setTrainingModal("partner")}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <Handshake className="w-4 h-4 mr-2" aria-hidden="true" />
                {t("trainingPage.ctaPartner")}
              </Button>
            </div>
          </div>
        </section>

        {/* Training tracks — absorbed the old six-item "what you will learn"
            list, whose entries are now topics under the track they belong to. */}
        <section id="tracks" className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("trainingPage.tracks.heading")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-10">{t("trainingPage.tracks.intro")}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {Array.isArray(tracks) &&
                tracks.map((track, i) => {
                  const Icon = TRACK_ICONS[i] ?? Bot;
                  return (
                    <UnifiedCard key={track.title} variant="default" padding="none" className="p-6">
                      <div className="w-11 h-11 rounded-xl bg-gradient-blue flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">{track.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {track.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {track.topics.map((topic) => (
                          <li key={topic} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </UnifiedCard>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Ways to learn (formats) */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              {t("trainingPage.formatsHeading")}
            </h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {Array.isArray(formats) &&
                formats.map((format, i) => {
                  const Icon = FORMAT_ICONS[i] ?? MonitorPlay;
                  const isAccent = i === 2;
                  return (
                    <UnifiedCard key={format.title} variant="default" padding="none" className="p-6">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          isAccent ? "bg-gradient-cta" : "bg-gradient-blue"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-foreground">{format.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {format.description}
                      </p>
                    </UnifiedCard>
                  );
                })}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              {t("trainingPage.audience.heading")}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.isArray(audience) &&
                audience.map((item, i) => {
                  const Icon = AUDIENCE_ICONS[i] ?? Cog;
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent-strong" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* How a session works */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              {t("trainingPage.how.heading")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Array.isArray(steps) &&
                steps.map((step, i) => (
                  <div key={step.title} className="p-6 bg-card rounded-2xl border border-border shadow-card">
                    <span className="text-sm font-bold text-accent-strong">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("trainingSection.partnersLabel")}
            </p>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 list-none p-0">
              {Array.from({ length: PARTNER_PLACEHOLDER_COUNT }).map((_, i) => (
                <li
                  key={i}
                  className="h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center gap-2 px-3"
                >
                  <span className="w-4 h-4 rounded bg-accent/15 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-muted-foreground truncate">
                    {t("trainingSection.partnerPlaceholder")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {t("trainingSection.partnersNote")}
            </p>
          </div>
        </section>

        {/* FAQ — visible content mirrors the FAQPage schema 1:1 */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              {t("trainingPage.faq.heading")}
            </h2>
            <div className="space-y-6">
              {Array.isArray(faq) &&
                faq.map((item) => (
                  <div key={item.question} className="pb-6 border-b border-border last:border-0">
                    <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t("trainingPage.finalHeading")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">{t("trainingPage.finalText")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="hero" size="lg" onClick={() => setTrainingModal("booking")} className="w-full sm:w-auto">
                {t("trainingPage.ctaPrimary")}
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={() => setTrainingModal("partner")}
                className="w-full sm:w-auto"
              >
                <Handshake className="w-4 h-4 mr-2" aria-hidden="true" />
                {t("trainingPage.ctaPartner")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer onBookingClick={() => setBookingOpen(true)} />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      <TrainingRequestModal
        isOpen={trainingModal !== null}
        mode={trainingModal ?? "booking"}
        onClose={() => setTrainingModal(null)}
      />
    </>
  );
}

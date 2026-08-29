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
  BadgeCheck,
  ChevronDown,
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
import { FourTracksVisual } from "@/components/sections/heroes/FourTracksVisual";
import { TrackExplorer } from "@/components/training/TrackExplorer";
import { BookingProcessRail } from "@/components/training/BookingProcessRail";
import {
  breadcrumbJsonLd,
  orgJsonLd,
  websiteJsonLd,
  serviceJsonLd,
  faqJsonLd,
  howToJsonLd,
  courseListJsonLd,
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

// Two honest "named once signed" slots. The other three former slots became
// the vetting statements below, which are true today.
const PARTNER_PLACEHOLDER_COUNT = 2;

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
  const vetting = t("trainingPage.vetting.items", { returnObjects: true }) as CopyItem[];
  const compliance = t("trainingPage.vetting.compliance", { returnObjects: true }) as string[];

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
      ...(Array.isArray(steps) && steps.length
        ? [
            howToJsonLd({
              name: t("trainingPage.how.heading"),
              description: t("trainingPage.schema.serviceDescription"),
              steps: steps.map((s) => ({ name: s.title, text: s.description })),
            }),
          ]
        : []),
      ...(Array.isArray(tracks) && tracks.length
        ? courseListJsonLd({
            url: "/training",
            courses: tracks.map((tr) => ({ name: tr.title, description: tr.description })),
          })
        : []),
    ],
    [t, faq, steps, tracks]
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

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="min-w-0">
                <PillBadge variant="category" size="lg">
                  <span className="w-2 h-2 rounded-full bg-orange shrink-0" aria-hidden="true" />
                  {t("trainingPage.eyebrow")}
                </PillBadge>

                <h1 className="mt-6 text-4xl md:text-5xl font-bold text-foreground text-balance">
                  {t("trainingPage.headingPrefix")}
                  <span className="text-gradient-brand">{t("trainingPage.headingHighlight")}</span>
                </h1>

                <p className="mt-5 text-lg text-muted-foreground">
                  {t("trainingPage.intro")}
                </p>

                {/* One prominent CTA. The partner journey is a different
                    audience entirely, so it drops to a labelled text link here
                    and gets its own strip further down rather than competing
                    with the booking action. */}
                <div className="mt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                    {t("trainingPage.forTeamsEyebrow")}
                  </p>
                  <div className="mt-3">
                    <Button
                      variant="hero"
                      size="lg"
                      onClick={() => setTrainingModal("booking")}
                      className="w-full sm:w-auto min-h-[48px]"
                    >
                      {t("trainingPage.ctaPrimary")}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </div>

                  <p className="mt-5 text-sm text-muted-foreground">
                    {t("trainingPage.partnerLinkPrefix")}{" "}
                    <button
                      type="button"
                      onClick={() => setTrainingModal("partner")}
                      className="inline-flex items-center gap-1 font-semibold text-secondary underline underline-offset-4 hover:text-deep-blue-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    >
                      {t("trainingPage.partnerLinkCta")}
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </p>
                </div>
              </div>

              <div className="min-w-0 hidden lg:block">
                <FourTracksVisual className="w-full max-w-[520px] mx-auto lg:ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Training tracks as a tabbed explorer. Every panel is force-mounted
            so all four tracks stay in the pre-rendered HTML. */}
        <section id="tracks" className="py-16 lg:py-20 bg-muted/20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("trainingPage.tracks.heading")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mb-8">{t("trainingPage.tracks.intro")}</p>
            <TrackExplorer tracks={tracks} icons={TRACK_ICONS} />
          </div>
        </section>

        {/* Ways to learn (formats) */}
        <section className="py-16 lg:py-20">
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
                      <div className="flex items-center justify-between gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            isAccent ? "bg-gradient-cta" : "bg-gradient-blue"
                          }`}
                        >
                          <Icon className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
                        </div>
                        {/* No /60 opacity: it measured 2.37:1. aria-hidden hides
                            it from AT but sighted users still read it. */}
                        <span className="text-sm font-bold tabular-nums text-muted-foreground" aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
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
        <section className="py-16 lg:py-20 bg-muted/30">
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
                      <div className="w-10 h-10 rounded-xl bg-gradient-blue flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
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

        {/* Booking process rail */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10">
              {t("trainingPage.how.heading")}
            </h2>
            <BookingProcessRail steps={steps} />
          </div>
        </section>

        {/* Partners: two honest placeholder slots plus the standard every
            partner has to meet. No stars, no logo wall, no named quotes. */}
        {/* <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t("trainingSection.partnersLabel")}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-3 list-none p-0 sm:max-w-sm">
              {Array.from({ length: PARTNER_PLACEHOLDER_COUNT }).map((_, i) => (
                <li
                  key={i}
                  className="h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center gap-2 px-3"
                >
                  <span className="w-4 h-4 rounded-sm bg-accent/15 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-muted-foreground truncate">
                    {t("trainingSection.partnerPlaceholder")}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t("trainingSection.partnersNote")}
            </p>

            <h2 className="mt-10 text-xl font-bold text-foreground">{t("trainingPage.vetting.heading")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("trainingPage.vetting.intro")}
            </p>

            <ul className="mt-6 grid gap-5 sm:grid-cols-3">
              {Array.isArray(vetting) &&
                vetting.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                      <BadgeCheck className="h-4 w-4 text-secondary" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
            </ul>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {Array.isArray(compliance) &&
                compliance.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-muted-foreground"
                  >
                    <ShieldCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    {chip}
                  </li>
                ))}
            </ul>
          </div>
        </section> */}

        {/* Partner journey: one visually distinct strip, kept away from the
            booking CTA so the two audiences never compete. */}
        <section className="pb-16 lg:pb-20">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <UnifiedCard variant="highlight" padding="none" className="p-6 lg:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                {t("trainingPage.forProvidersEyebrow")}
              </p>
              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-blue">
                    <Handshake className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-foreground">
                      {t("trainingPage.partnerStrip.heading")}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {t("trainingPage.partnerStrip.body")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="hero-outline"
                  size="lg"
                  onClick={() => setTrainingModal("partner")}
                  className="w-full shrink-0 sm:w-auto min-h-[48px]"
                >
                  <Handshake className="w-4 h-4 mr-2" aria-hidden="true" />
                  {t("trainingPage.ctaPartner")}
                </Button>
              </div>
            </UnifiedCard>
          </div>
        </section>

        {/* FAQ — visible content mirrors the FAQPage schema 1:1 */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
              {t("trainingPage.faq.heading")}
            </h2>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {Array.isArray(faq) &&
                faq.map((item) => (
                  <details key={item.question} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-[0.95rem] font-semibold text-foreground">{item.question}</h3>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-transform duration-200 group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  </details>
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

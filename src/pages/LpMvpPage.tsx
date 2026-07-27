import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock,
  Code2,
  FileSearch,
  Gift,
  Hammer,
  KeyRound,
  LayoutGrid,
  Lock,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { SeoHead, siteUrl } from "@/components/SeoHead";
import { orgJsonLd, websiteJsonLd, breadcrumbJsonLd } from "@/seo/jsonld";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { MvpAppPreview } from "@/components/lp/MvpAppPreview";
import { LpNavbar } from "@/components/lp/LpNavbar";
import { LpFooter } from "@/components/lp/LpFooter";
import { LpScopeForm } from "@/components/lp/LpScopeForm";
import { Reveal } from "@/components/lp/Reveal";
import { trackLpConversion } from "@/lib/lp-tracking";
import {
  DEFAULT_VARIANT,
  LP_MVP_VARIANTS,
  variantFromSearch,
  type LpHeroVariant,
} from "@/pages/lp-mvp.config";

// Icons paired positionally with the i18n content arrays (copy in i18n, icons
// in code — same split the homepage MvpSection uses).
const WHAT_YOU_GET_ICONS = [Rocket, KeyRound, LayoutGrid, ShieldCheck, BarChart3, Smartphone];
const HOW_ICONS = [FileSearch, Hammer, Rocket];
const RISK_ICONS = [Gift, BadgeCheck, KeyRound];
const HERO_CHIP_ICONS = [ShieldCheck, Code2, Clock];

// One shared icon-chip recipe so the card sections read as one system.
const ICON_CHIP = "inline-flex rounded-xl bg-gradient-to-br from-secondary/15 to-accent/15 p-3";

const HERO_FORM_ID = "lp-scope";

export default function LpMvpPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [variant, setVariant] = useState(DEFAULT_VARIANT);
  const [showSticky, setShowSticky] = useState(false);

  // Message-match: pick the campaign variant from `?v=` AFTER hydration so the
  // server-rendered default and the first client render stay identical.
  useEffect(() => {
    setVariant(variantFromSearch(window.location.search));
  }, []);

  // Reveal the sticky CTA bar once the hero form has scrolled away.
  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hero: LpHeroVariant = LP_MVP_VARIANTS[variant] ?? LP_MVP_VARIANTS[DEFAULT_VARIANT];
  const fallback = LP_MVP_VARIANTS[DEFAULT_VARIANT];
  // Resolve a variant key, falling back to the default variant's copy when a
  // campaign hasn't overridden that particular line.
  const hv = (key: keyof LpHeroVariant) => t(hero[key], { defaultValue: t(fallback[key]) });

  const primaryCta = hv("primaryCtaKey");
  const navCta = t("lpMvp.sticky.primary"); // short label for nav + sticky (both scroll to the form)

  const scrollToForm = () => {
    const el = document.getElementById(HERO_FORM_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openBooking = (placement: string) => {
    trackLpConversion("booking_click", { variant, placement });
    setBookingOpen(true);
  };

  const trustChips = t("lpMvp.chips", { returnObjects: true }) as string[];
  const proofStats = t("lpMvp.proof.stats", { returnObjects: true }) as { value: string; label: string }[];
  const whatYouGet = t("lpMvp.whatYouGet.items", { returnObjects: true }) as { title: string; body: string }[];
  const howSteps = t("lpMvp.how.steps", { returnObjects: true }) as { title: string; body: string }[];
  const timeline = t("lpMvp.timeline.steps", { returnObjects: true }) as { week: string; label: string }[];
  const riskItems = t("lpMvp.risk.items", { returnObjects: true }) as { title: string; body: string }[];
  const faqItems = t("lpMvp.faq.items", { returnObjects: true }) as { q: string; a: string }[];
  const notIncluded = t("lpMvp.details.notIncluded", { returnObjects: true }) as string[];
  const weNeed = t("lpMvp.details.need", { returnObjects: true }) as string[];

  return (
    <>
      <SeoHead
        title={t("seo.lpMvp.title")}
        description={t("seo.lpMvp.description")}
        canonicalPath="/lp/mvp"
        // Paid-ads page: keep it out of the index (and out of the sitemap via the
        // noindex flag in scripts/site-content.mjs).
        robots="noindex, nofollow"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Build your MVP", url: `${siteUrl}/lp/mvp` },
          ]),
        ]}
      />

      <SkipLink />

      <div className="min-h-screen bg-background">
        <LpNavbar ctaLabel={navCta} onCtaClick={scrollToForm} />

        <main id="main-content">
          {/* ===================== ABOVE THE FOLD ===================== */}
          <section className="relative overflow-hidden bg-gradient-hero pt-24 lg:pt-28">
            <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
            <div className="container mx-auto px-4 py-10 lg:px-6 lg:py-16">
              <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                {/* LEFT — copy + form */}
                <div className="order-1 space-y-6 animate-fade-in-up">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden="true" />
                    {hv("eyebrowKey")}
                  </span>

                  <h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                    {hv("headlinePreKey")}
                    <span className="text-gradient-brand">{hv("headlineAccentKey")}</span>
                    <span className="whitespace-nowrap">{hv("headlinePostKey")}</span>
                  </h1>

                  <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {hv("subheadKey")}
                  </p>

                  {/* 3 trust chips */}
                  <ul className="flex flex-wrap gap-2.5" aria-label={t("lpMvp.a11y.trustSignals")}>
                    {trustChips.map((chip, i) => {
                      const Icon = HERO_CHIP_ICONS[i] ?? ShieldCheck;
                      return (
                        <li
                          key={chip}
                          className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-card/70 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm"
                        >
                          <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                          {chip}
                        </li>
                      );
                    })}
                  </ul>

                  {/* PRIMARY CTA — inline scope form */}
                  <div id={HERO_FORM_ID} className="scroll-mt-28">
                    <LpScopeForm
                      submitLabel={primaryCta}
                      onBookCall={() => openBooking("hero_form")}
                      variant={variant}
                      placement="hero"
                    />
                  </div>
                </div>

                {/* RIGHT — on-message product preview (CSS/SVG, localized,
                    decorative). Reads as "your live MVP", not ops automation. */}
                <div className="order-2 w-full lg:pt-6">
                  <MvpAppPreview />
                </div>
              </div>
            </div>
          </section>

          {/* ===================== PROOF STRIP (placeholders) ===================== */}
          <section className="border-y border-border bg-card py-10">
            <div className="container mx-auto px-4 lg:px-6">
              <Reveal className="flex flex-col items-center gap-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("lpMvp.proof.logosLabel")}
                </p>
                {/* Clearly-marked placeholders until real logos land. */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="flex h-10 w-28 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                    >
                      {t("lpMvp.proof.logoPlaceholder")}
                    </span>
                  ))}
                </div>
                <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                  {proofStats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-background p-4">
                      <p className="text-2xl font-extrabold text-gradient-brand">{stat.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs italic text-muted-foreground">— {t("lpMvp.proof.note")}</p>
              </Reveal>
            </div>
          </section>

          {/* ===================== WHAT YOU GET ===================== */}
          <section className="bg-background py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-6">
              <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.whatYouGet.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {t("lpMvp.whatYouGet.title")}
                </h2>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {whatYouGet.map((item, i) => {
                  const Icon = WHAT_YOU_GET_ICONS[i] ?? Sparkles;
                  return (
                    <Reveal
                      key={item.title}
                      delay={(i % 3) * 80}
                      className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                    >
                      <div className={`mb-4 ${ICON_CHIP}`}>
                        <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                      </div>
                      <h3 className="mb-1.5 text-base font-bold text-foreground">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===================== HOW IT WORKS ===================== */}
          <section className="border-y border-border bg-muted/60 py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-6">
              <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.how.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("lpMvp.how.title")}</h2>
              </Reveal>
              <div className="grid gap-6 md:grid-cols-3">
                {howSteps.map((step, i) => {
                  const Icon = HOW_ICONS[i] ?? Sparkles;
                  return (
                    <Reveal
                      key={step.title}
                      delay={i * 90}
                      className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card"
                    >
                      <span className="pointer-events-none absolute -right-1 top-2 text-7xl font-black leading-none text-secondary/10">
                        {i + 1}
                      </span>
                      <div className={`relative mb-4 ${ICON_CHIP}`}>
                        <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                      </div>
                      <h3 className="relative mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                      <p className="relative text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===================== TIMELINE (one horizontal strip) ===================== */}
          <section className="bg-background py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-6">
              <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.timeline.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {t("lpMvp.timeline.title")}
                </h2>
              </Reveal>
              <Reveal className="relative">
                {/* Connecting rail (blue → orange for a warm speed cue) */}
                <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-gradient-to-r from-secondary/40 via-accent/40 to-orange/50 lg:block" aria-hidden="true" />
                <ol className="flex snap-x gap-4 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible">
                  {timeline.map((step, i) => (
                    <li
                      key={step.week}
                      className="relative min-w-[210px] snap-start rounded-2xl border border-border bg-card p-5 shadow-card lg:min-w-0"
                    >
                      <span className="relative z-10 mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-orange text-base font-bold text-white shadow-md">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-foreground">{step.week}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.label}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </section>

          {/* ===================== RISK REVERSAL ===================== */}
          <section className="border-y border-border bg-gradient-hero py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-6">
              <Reveal className="mx-auto mb-12 max-w-2xl text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.risk.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("lpMvp.risk.title")}</h2>
              </Reveal>
              <div className="grid gap-5 md:grid-cols-3">
                {riskItems.map((item, i) => {
                  const Icon = RISK_ICONS[i] ?? ShieldCheck;
                  return (
                    <Reveal
                      key={item.title}
                      delay={i * 90}
                      className="flex h-full items-start gap-4 rounded-2xl border border-secondary/20 bg-card p-6 shadow-card"
                    >
                      <div className={`shrink-0 ${ICON_CHIP}`}>
                        <Icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="mb-1 text-base font-bold text-foreground">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===================== FAQ (4 objections) ===================== */}
          <section className="bg-background py-16 lg:py-24">
            <div className="container mx-auto max-w-3xl px-4 lg:px-6">
              <Reveal className="mb-12 text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.faq.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("lpMvp.faq.title")}</h2>
              </Reveal>
              <Reveal>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqItems.map((item, i) => (
                    <AccordionItem
                      key={item.q}
                      value={`faq-${i}`}
                      className="rounded-2xl border border-border bg-card px-5 shadow-sm data-[state=open]:shadow-card"
                    >
                      <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>

              {/* Lower-priority detail, collapsed for cold traffic. */}
              <Reveal className="mt-6">
                <Accordion type="single" collapsible className="rounded-2xl border border-border bg-muted/20">
                  <AccordionItem value="details" className="border-none px-5">
                    <AccordionTrigger className="text-sm font-semibold text-foreground">
                      {t("lpMvp.details.title")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-6 pt-1 sm:grid-cols-2">
                        <div>
                          <h3 className="mb-3 text-sm font-bold text-foreground">
                            {t("lpMvp.details.notIncludedTitle")}
                          </h3>
                          <ul className="space-y-2">
                            {notIncluded.map((x) => (
                              <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                                {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="mb-3 text-sm font-bold text-foreground">
                            {t("lpMvp.details.needTitle")}
                          </h3>
                          <ul className="space-y-2">
                            {weNeed.map((x, i) => (
                              <li key={x} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                                  {i + 1}
                                </span>
                                {x}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Reveal>
            </div>
          </section>

          {/* ===================== FINAL CTA (repeat form) ===================== */}
          <section className="border-t border-border bg-gradient-hero py-16 lg:py-24">
            <div className="container mx-auto grid max-w-5xl items-start gap-10 px-4 lg:grid-cols-2 lg:px-6">
              <Reveal>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                  {t("lpMvp.finalCta.eyebrow")}
                </p>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {t("lpMvp.finalCta.title")}
                </h2>
                <p className="mt-4 max-w-md text-base text-muted-foreground">
                  {t("lpMvp.finalCta.subtitle")}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {trustChips.map((chip, i) => {
                    const Icon = HERO_CHIP_ICONS[i] ?? ShieldCheck;
                    return (
                      <li key={chip} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                        {chip}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
              <Reveal>
                <LpScopeForm
                  submitLabel={primaryCta}
                  onBookCall={() => openBooking("final_form")}
                  variant={variant}
                  placement="final"
                  showHeader={false}
                />
              </Reveal>
            </div>
          </section>
        </main>

        <LpFooter />
      </div>

      {/* ===================== STICKY CTA BAR (desktop + mobile) ===================== */}
      <div
        role="region"
        aria-label={t("lpMvp.sticky.message")}
        aria-hidden={!showSticky}
        className={`fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-card/95 backdrop-blur-md transition-transform duration-300 ${
          showSticky ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
      >
        <div className="container mx-auto flex items-center gap-3 px-4 py-3 lg:px-6">
          <p className="hidden min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:block">
            {t("lpMvp.sticky.message")}
          </p>
          <Button
            variant="outline"
            size="default"
            onClick={() => openBooking("sticky_bar")}
            tabIndex={showSticky ? undefined : -1}
            className="min-h-[44px] flex-1 sm:flex-none"
          >
            {t("lpMvp.sticky.secondary")}
          </Button>
          <Button
            variant="cta"
            size="default"
            onClick={scrollToForm}
            tabIndex={showSticky ? undefined : -1}
            className="min-h-[44px] flex-1 sm:flex-none"
          >
            {navCta}
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      <CookieConsent />
    </>
  );
}

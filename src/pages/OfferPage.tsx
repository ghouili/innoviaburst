import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { RequestModal } from "@/components/RequestModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";





import { ArrowLeft, ArrowRight, Check, Clock, ChevronDown, ChevronUp, CreditCard, ShieldCheck, Scale, Lock, CalendarClock, Search, Wrench, Rocket, ClipboardCheck } from "lucide-react";
import { OfferProductVisual } from "@/components/offer/OfferProductVisual";
import { OfferComparisonCard } from "@/components/offer/OfferComparisonCard";
import { OfferTimelineRail } from "@/components/offer/OfferTimelineRail";
import { OfferProofStrip } from "@/components/offer/OfferProofStrip";
import { FounderNote } from "@/components/offer/FounderNote";
import { RepresentativeBuilds } from "@/components/offer/RepresentativeBuilds";
import { FeatureRow } from "@/components/offer/FeatureRow";
import { MvpHero } from "@/components/offer/MvpHero";
import { breadcrumbJsonLd, faqJsonLd, howToJsonLd, orgJsonLd, serviceJsonLd, websiteJsonLd } from "@/seo/jsonld";
// Phase 8: pricing comes from the single source of truth (EUR primary + GBP).
import { OFFERS, priceEUR, priceGBP, priceInline, schemaOffers, SHOW_PRICING } from "@/data/offers";

/**
 * Publishing gate for the per-offer tech-stack claim in the proof strip.
 *
 * The MVP stack copy is written and sitting in en.json, but naming the stack we
 * build on is a factual claim about delivery that hasn't been confirmed yet.
 * Until it is, the strip renders its compliance-columns form instead — claims we
 * already stand behind. Flip to `true` once the stack is verified; nothing else
 * needs to change.
 */
const PROOF_STACK_CONFIRMED = false;

/** Optional rewritten copy: present for offers the copy pass has reached. */
interface RichPair { title: string; body: string }

interface OfferContent {
  title: string;
  h1: string;
  eyebrow: string;
  subheading: string;
  howWeBuild: { title: string; intro: string; stages: RichPair[] } | null;
  whatYouGet: { items: RichPair[] } | null;
  outOfScope: { intro: string; items: RichPair[] } | null;
  objections: { q: string; a: string }[] | null;
  stickyCard: { label: string; line1: string; line2: string; priceLine: string; note: string } | null;
  credibilityNote: string;
  proofPlaceholder: string;
  representativeBuilds: {
    heading: string;
    disclaimer: string;
    items: { tag: string; desc: string; scope: string; timeline: string }[];
  } | null;
  finalCta: { title: string; body: string; trustLine: string } | null;
  proofStack: { headline: string; items: string[] } | null;
  timeline: string;
  bestFor: string;
  heroDescription: string;
  summaryFacts: string[];
  deliverables: string[];
  exclusions: string[];
  successMetrics: { metric: string; example: string }[];
  weekByWeek: { week: string; activities: string[] }[];
  clientInputs: string[];
  aeo: { q: string; a: string }[];
  faq: { q: string; a: string }[];
}

export default function OfferPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const meta = slug ? OFFERS[slug] : null;

  /** Offers whose hero has been rebuilt from a design file. */
  const hasAnimatedHero = slug === "mvp-launch";

  // Rewritten blocks exist per offer. `null` when the copy pass hasn't reached an
  // offer yet, and every consumer below falls back to the original content — so
  // /ai-ops-sprint and /automation-build keep working untouched rather than
  // rendering half-empty sections or borrowed MVP wording.
  const optional = <T,>(key: string): T | null => {
    const v = t(`offerDetails.${slug}.${key}`, { returnObjects: true, defaultValue: null });
    return v && typeof v === "object" ? (v as T) : null;
  };

  const offer: OfferContent | null = meta
    ? {
        title: t(`offerDetails.${slug}.title`),
        // Outcome headline when supplied, else the product name. `title` itself is
        // never repointed — Service schema, breadcrumbs and the request modal all
        // read it, and those must stay byte-identical.
        h1: t(`offerDetails.${slug}.h1`, { defaultValue: t(`offerDetails.${slug}.title`) }),
        howWeBuild: optional<{ title: string; intro: string; stages: RichPair[] }>("howWeBuild"),
        whatYouGet: optional<{ items: RichPair[] }>("whatYouGet"),
        outOfScope: optional<{ intro: string; items: RichPair[] }>("outOfScope"),
        objections: optional<{ q: string; a: string }[]>("objections"),
        stickyCard: optional<{ label: string; line1: string; line2: string; priceLine: string; note: string }>("stickyCard"),
        credibilityNote: t(`offerDetails.${slug}.credibilityNote`, { defaultValue: "" }),
        proofPlaceholder: t(`offerDetails.${slug}.proofPlaceholder`, { defaultValue: "" }),
        representativeBuilds: optional<{
          heading: string;
          disclaimer: string;
          items: { tag: string; desc: string; scope: string; timeline: string }[];
        }>("representativeBuilds"),
        finalCta: optional<{ title: string; body: string; trustLine: string }>("finalCta"),
        proofStack: optional<{ headline: string; items: string[] }>("proofStack"),
        // Empty default: an offer without spec-approved eyebrow copy renders no
        // eyebrow rather than a placeholder or an invented one.
        eyebrow: t(`offerDetails.${slug}.eyebrow`, { defaultValue: "" }),
        // Keyword-rich deck under the H1 — the H1 itself is a bare product name
        // ("MVP Launch"), which carries no search intent on its own.
        subheading: t(`offerDetails.${slug}.subheading`),
        timeline: t(`offerDetails.${slug}.timeline`),
        bestFor: t(`offerDetails.${slug}.bestFor`),
        heroDescription: t(`offerDetails.${slug}.heroDescription`),
        summaryFacts: t(`offerDetails.${slug}.summaryFacts`, { returnObjects: true }) as string[],
        deliverables: t(`offerDetails.${slug}.deliverables`, { returnObjects: true }) as string[],
        exclusions: t(`offerDetails.${slug}.exclusions`, { returnObjects: true }) as string[],
        successMetrics: t(`offerDetails.${slug}.successMetrics`, { returnObjects: true }) as { metric: string; example: string }[],
        weekByWeek: t(`offerDetails.${slug}.weekByWeek`, { returnObjects: true }) as { week: string; activities: string[] }[],
        clientInputs: t(`offerDetails.${slug}.clientInputs`, { returnObjects: true }) as string[],
        // Phase 6 AEO: answer-first Q&A. {{price}} -> EUR primary + GBP from
        // offers.ts. These map 1:1 into the FAQPage schema below.
        aeo: (t(`offerDetails.${slug}.aeo`, { returnObjects: true }) as { q: string; a: string }[]).map((x) => ({
          q: x.q,
          // Pricing hidden → swap the {{price}} ("how much") answer for a no-figure
          // reply (used for BOTH display and the FAQPage schema). Never leak {{price}}.
          a: SHOW_PRICING
            ? x.a.replace(/\{\{price\}\}/g, priceInline(slug))
            : x.a.includes("{{price}}")
              // Per-offer, figure-free process answer (unique per page, keeps the
              // "how much" answer rich). Falls back to the generic sentence.
              ? t(`offerDetails.${slug}.noPriceAnswer`, { defaultValue: t("offers.noPriceAnswer") })
              : x.a,
        })),
        faq: t(`offerDetails.${slug}.faq`, { returnObjects: true }) as { q: string; a: string }[],
      }
    : null;

  const canonicalPath = offer ? `/${slug}` : undefined;

  // FAQPage schema = the answer-first AEO blocks + the detailed FAQ. Every entry
  // here is rendered visibly on the page (AEO section + FAQ accordion, which keeps
  // answers in the DOM), so schema maps 1:1 to on-page content.
  const faqSchema = offer
    ? faqJsonLd(
        [...offer.aeo, ...offer.faq].map((item) => ({
          question: item.q,
          answer: item.a,
        }))
      )
    : null;

  // EUR-primary Service/Offer schema (EUR + explicit GBP), straight from offers.ts.
  // Service description mirrors the visible hero subhead, so the schema always
  // describes the service the way the page does.
  const serviceSchema = offer
    ? serviceJsonLd({
        name: offer.title,
        description: offer.heroDescription,
        url: `${siteUrl}/${slug}`,
        offers: schemaOffers(slug),
      })
    : null;

  const breadcrumbSchema = offer
    ? breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Offers", url: `${siteUrl}/#offers` },
        { name: offer.title, url: `${siteUrl}/${slug}` },
      ])
    : null;

  // HowTo schema for the delivery process — mirrors the visible "how it works"
  // steps 1:1 (per-offer stages when written, else the generic steps).
  const processSteps: { title: string; body: string }[] = offer
    ? offer.howWeBuild?.stages ??
      (t("offerPage.ui.howItWorks.steps", { returnObjects: true }) as string[]).map((s) => ({ title: "", body: s }))
    : [];
  const howToSchema =
    offer && processSteps.length
      ? howToJsonLd({
          name: offer.howWeBuild?.title ?? t("offerPage.ui.howItWorks.title"),
          description: offer.heroDescription,
          steps: processSteps.map((s) => ({ name: s.title, text: s.body })),
        })
      : null;

  if (!offer) {
    return (
      <>
        <SeoHead
          title={t("offerPage.notFound.seoTitle")}
          description={t("offerPage.notFound.seoDescription")}
          robots="noindex, nofollow"
        />
        <SkipLink />
        <Navbar onBookingClick={() => setBookingOpen(true)} />
        <main id="main-content" className="pt-20 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t("offerPage.notFound.heading")}</h1>
            <Link to="/" className="text-accent-strong hover:underline">{t("offerPage.notFound.returnHome")}</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SeoHead
        // Per-offer SEO override (falls back to the generic pattern). MVP Launch
        // uses this to target MVP-development / "build an MVP in weeks" intent.
        title={t(`offerDetails.${slug}.seoTitle`, { defaultValue: `${offer.title} | InnoviaBurst` })}
        description={t(`offerDetails.${slug}.seoDescription`, { defaultValue: `${offer.heroDescription} Timeline: ${offer.timeline}.` })}
        canonicalPath={canonicalPath}
        alternates={canonicalPath ? buildAlternates(canonicalPath) : undefined}
        ogType="website"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          ...(breadcrumbSchema ? [breadcrumbSchema] : []),
          ...(serviceSchema ? [serviceSchema] : []),
          ...(faqSchema ? [faqSchema] : []),
          ...(howToSchema ? [howToSchema] : []),
        ]}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/*
          /mvp-launch runs the ported animated hero; the other offers keep the
          original one until their own design lands. Everything below the hero is
          shared, so only this one branch differs.
        */}
        {hasAnimatedHero ? (
          <MvpHero
            slug={slug}
            onScopeClick={() => setRequestOpen(true)}
            onBookClick={() => setBookingOpen(true)}
          />
        ) : (
        <section className="py-16 lg:py-24 bg-gradient-hero relative">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/#offers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t("offerPage.ui.backToOffers")}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {/* Eyebrow — renders only where the copy pass has supplied one, so
                    no offer gets an invented label in the meantime. */}
                {offer.eyebrow && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-3">
                    {offer.eyebrow}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance">
                  {offer.h1}
                </h1>
                {/* Keyword-rich deck: the H1 is a product name, so the search
                    intent ("MVP development for European startups") lives here. */}
                <h2 className="text-lg md:text-xl font-medium text-secondary mb-4">
                  {offer.subheading}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">{offer.heroDescription}</p>

                {/* Fact chips */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                    <Clock className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium">{offer.timeline}</span>
                  </div>
                  {offer.summaryFacts.slice(0, 1).map((fact) => (
                    <div key={fact} className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                      <Check className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                      <span className="text-sm font-medium">{fact}</span>
                    </div>
                  ))}
                  {/* Pricing hidden → hide the price badge; the timeline chip + CTA remain. */}
                  {SHOW_PRICING && (
                    <div className="px-4 py-2 bg-accent/20 rounded-lg">
                      <span className="text-lg font-bold text-gradient-orange">{priceEUR(slug)}</span>
                      <span className="ml-2 text-sm font-medium text-muted-foreground">{priceGBP(slug)}</span>
                    </div>
                  )}
                </div>

                {/* Primary conversion path sits above the fold, ahead of the
                    supporting detail — it used to be buried under the "how it
                    works" list, several hundred pixels down. */}
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <Button variant="hero" size="lg" onClick={() => setRequestOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
                    {t("offerPage.ui.ctaPrimary")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="hero-outline" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
                    {t("offerPage.ui.ctaSecondary")}
                  </Button>
                </div>

                {/* Reframes the CTA from "sales call" to "free deliverable" */}
                <p className="text-xs text-muted-foreground mb-6">{t("offerPage.ui.ctaMicrocopy")}</p>

                {/* Compliance trust row — the only honest above-the-fold
                    credibility signal available: a claim about how we work, not
                    a client we can't name. */}
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-xs text-muted-foreground">
                  <li className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
                    {t("offerPage.ui.trustRow.gdpr")}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
                    {t("offerPage.ui.trustRow.aiAct")}
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />
                    {t("offerPage.ui.trustRow.ip")}
                  </li>
                </ul>

                <p className="text-sm text-muted-foreground">
                  <strong>{t("offerPage.ui.bestForLabel")}</strong> {offer.bestFor}
                </p>
              </div>

              {/* Scope boundary, stated as one thing rather than two blocks a
                  section apart. Sits where the old deliverables-only card was. */}
              <OfferComparisonCard
                included={offer.whatYouGet?.items ?? offer.deliverables}
                excluded={offer.outOfScope?.items ?? offer.exclusions}
                excludedIntro={offer.outOfScope?.intro}
              />
            </div>
          </div>
        </section>
        )}

        <OfferProofStrip
          headline={PROOF_STACK_CONFIRMED ? offer.proofStack?.headline : undefined}
          items={PROOF_STACK_CONFIRMED ? offer.proofStack?.items : offer.proofStack ? [] : undefined}
        />

        {/* Sticky CTA for mobile — safe-area aware, carries the PRIMARY action.
            Pure CSS `fixed`; nothing measures the viewport, so it pre-renders
            identically at SSG time and needs no JS to appear. */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-card/95 backdrop-blur-sm border-t border-border z-[80] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2">
            <Button variant="hero" className="flex-1 min-h-[48px]" onClick={() => setRequestOpen(true)}>
              {t("offerPage.ui.ctaPrimary")}
            </Button>
            <Button
              variant="hero-outline"
              className="min-h-[48px] px-4 shrink-0"
              onClick={() => setBookingOpen(true)}
              aria-label={t("offerPage.ui.ctaSecondary")}
            >
              <CalendarClock className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* How we build it — icon row (P1-7). Uses the offer-specific three
            stages where the copy pass has written them, else the generic steps. */}
        <section className="py-12 lg:py-16 bg-muted/20 border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              {offer.howWeBuild?.title ?? t("offerPage.ui.howItWorks.title")}
            </h2>
            {offer.howWeBuild && (
              <p className="text-base text-muted-foreground mb-8 max-w-3xl">{offer.howWeBuild.intro}</p>
            )}
            <ol className={`grid gap-6 sm:grid-cols-3 ${offer.howWeBuild ? "" : "mt-6"}`}>
              {(
                offer.howWeBuild?.stages ??
                (t("offerPage.ui.howItWorks.steps", { returnObjects: true }) as string[]).map((s) => ({ title: "", body: s }))
              ).map((stage, i) => {
                const StepIcon = [Search, Wrench, Rocket][i] ?? Search;
                return (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-blue">
                      <StepIcon className="w-5 h-5 text-secondary-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-accent-strong mb-1">
                        {t("offerPage.ui.howItWorks.stepLabel", { n: i + 1 })}
                      </p>
                      {stage.title && <p className="font-semibold text-foreground mb-1">{stage.title}</p>}
                      <p className="text-sm text-muted-foreground leading-relaxed">{stage.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <Link to="/automations" className="text-secondary hover:underline">
                {t("offerPage.ui.links.automations")}
              </Link>
              <Link to="/works" className="text-secondary hover:underline">
                {t("offerPage.ui.links.caseStudies")}
              </Link>
              <Link to="/trust" className="text-secondary hover:underline">
                {t("offerPage.ui.links.trust")}
              </Link>
            </div>
          </div>
        </section>

        {/*
          Body: a content column paired with a sticky summary card.

          These sections used to run full-bleed one after another, which left the
          right half of the page empty on desktop (the AEO and FAQ blocks are
          max-w-3xl text). They now share a two-column grid so the conversion card
          tracks the reader down the page. The card is desktop-only — on mobile
          the existing fixed bottom bar already carries the CTA.
        */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:gap-16">
            <div className="min-w-0">
              {/* The animated hero takes the column the comparison card used to
                  occupy, so on that page the scope boundary leads the body
                  instead — same card, same position in the reading order. */}
              {hasAnimatedHero && (
                <section className="py-12 lg:py-16 border-b border-border">
                  <OfferComparisonCard
                    included={offer.whatYouGet?.items ?? offer.deliverables}
                    excluded={offer.outOfScope?.items ?? offer.exclusions}
                    excludedIntro={offer.outOfScope?.intro}
                  />
                </section>
              )}

              {/* AEO: answer-first, question-led blocks (mapped 1:1 to FAQPage schema) */}
              <section className="py-12 lg:py-16 border-b border-border">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-8">{t("offerPage.ui.aeoEyebrow")}</p>
                  <div className="space-y-8">
                    {offer.aeo.map((item, i) => (
                      <div key={i}>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{item.q}</h2>
                        <p className="text-base text-muted-foreground leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Timeline — promoted to sit directly under the answer-first block:
                  "how long does this take" is the question that follows "what is
                  it", and the rail answers it visually. The AEO answer stays short
                  and defers here rather than restating every week range. */}
              <section className="py-12 lg:py-16 border-b border-border">
                <h2 className="text-xl font-bold text-foreground mb-8">{t("offerPage.ui.timeline")}</h2>
                <OfferTimelineRail steps={offer.weekByWeek} />

                {/* Primary CTA repeated at peak desire — right after the reader
                    has seen the whole delivery arc end at "live" (spec CTA rules). */}
                <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3">
                  <Button variant="hero" size="lg" onClick={() => setRequestOpen(true)} className="w-full sm:w-auto min-h-[48px]">
                    {t("offerPage.ui.ctaPrimary")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-xs text-muted-foreground">{t("offerPage.ui.ctaMicrocopy")}</p>
                </div>
              </section>

              {/* Objection handling — plain content, deliberately NOT wired into
                  the FAQPage schema: that schema is locked byte-identical, and
                  these are sales objections rather than the indexed Q&A set. */}
              {offer.objections && (
                <section className="py-12 lg:py-16 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">{t("offerPage.ui.objectionsTitle")}</h2>
                  <dl className="space-y-6 max-w-3xl">
                    {offer.objections.map((item, i) => (
                      <div key={i}>
                        <dt className="font-semibold text-foreground mb-1">{item.q}</dt>
                        <dd className="text-sm text-muted-foreground leading-relaxed">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* Founder's note + clearly-marked proof placeholder (spec P1-10) */}
              {offer.credibilityNote && (
                <section className="py-12 lg:py-16 border-b border-border">
                  <FounderNote note={offer.credibilityNote} placeholder={offer.proofPlaceholder} />
                </section>
              )}

              {/* Representative (illustrative) builds — not named case studies */}
              {offer.representativeBuilds && (
                <section className="py-12 lg:py-16 border-b border-border">
                  <RepresentativeBuilds data={offer.representativeBuilds} />
                </section>
              )}

              {/* Success Metrics — big-number cards (P1) */}
              <section className="py-12 lg:py-16 border-b border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">{t("offerPage.ui.successMetrics")}</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {offer.successMetrics.map((metric, i) => (
                    <div key={i} className="p-5 bg-card rounded-xl border border-border">
                      <p className="text-2xl font-extrabold text-gradient-orange leading-tight mb-1 text-balance">
                        {metric.example}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">{metric.metric}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Inputs */}
              <section className="py-12 lg:py-16 border-b border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">{t("offerPage.ui.clientInputs")}</h2>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {offer.clientInputs.map((input, i) => (
                    <FeatureRow key={i} Icon={ClipboardCheck} body={input} />
                  ))}
                </ul>
              </section>

              {/* FAQ */}
              <section className="py-12 lg:py-16">
                <h2 className="text-xl font-bold text-foreground mb-6">{t("offerPage.ui.faq")}</h2>
                <div className="space-y-3 max-w-3xl">
                  {offer.faq.map((item, i) => (
                    <div key={i} className="border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        aria-expanded={openFaq === i}
                        className="w-full p-4 flex items-center justify-between text-left bg-card hover:bg-muted/50 transition-colors min-h-[48px]"
                      >
                        <span className="font-medium text-foreground">{item.q}</span>
                        {openFaq === i ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {/* Answer stays in the DOM (CSS-hidden) so it is crawlable and
                          maps 1:1 to the FAQPage schema, even while collapsed. */}
                      <div className={`p-4 bg-muted/30 border-t border-border ${openFaq === i ? "" : "hidden"}`}>
                        <p className="text-sm text-muted-foreground">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sticky summary + conversion card (desktop only) */}
            <aside className="hidden lg:block py-12 lg:py-16" aria-label={t("offerPage.ui.summary.label")}>
              <div className="sticky top-24 rounded-2xl border border-border bg-card shadow-card overflow-hidden">
                {/* Product view fills what was dead space at the top of the rail */}
                <OfferProductVisual className="block" />

                <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-strong mb-3">
                  {offer.stickyCard?.label ?? t("offerPage.ui.summary.title")}
                </p>

                {offer.stickyCard ? (
                  <div className="mb-5">
                    <p className="font-bold text-foreground leading-snug mb-2">{offer.stickyCard.line1}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{offer.stickyCard.line2}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{offer.stickyCard.priceLine}</p>
                  </div>
                ) : (
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2.5 text-sm text-foreground">
                      <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="font-medium">{offer.timeline}</span>
                    </li>
                    {offer.summaryFacts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="space-y-2">
                  <Button variant="hero" onClick={() => setRequestOpen(true)} className="w-full min-h-[48px]">
                    {t("offerPage.ui.ctaPrimary")}
                  </Button>
                  <Button variant="hero-outline" onClick={() => setBookingOpen(true)} className="w-full min-h-[48px]">
                    {t("offerPage.ui.ctaSecondary")}
                  </Button>
                </div>

                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  {offer.stickyCard?.note ?? t("offerPage.ui.summary.note")}
                </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Billing */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-4 max-w-2xl">
              <div className="p-3 rounded-xl bg-accent/20">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("offerPage.ui.billing.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {/* Pricing hidden → drop the payment-split figures, keep the model. */}
                  {SHOW_PRICING ? t("offerPage.ui.billing.body") : t("offerPage.ui.billing.bodyNoPrice")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {offer.finalCta?.title ?? t("offerPage.ui.finalCta.title")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {offer.finalCta?.body ?? t("offerPage.ui.finalCta.body")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" onClick={() => setRequestOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
                {t("offerPage.ui.ctaPrimary")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
                {t("offerPage.ui.ctaSecondary")}
              </Button>
            </div>
            {offer.finalCta && (
              <p className="mt-6 text-sm text-muted-foreground">{offer.finalCta.trustLine}</p>
            )}
          </div>
        </section>
      </main>

      <Footer onBookingClick={() => setBookingOpen(true)} />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
      {/* RequestModal was imported but never mounted — the "fixed scope" path had
          no destination on this template. It is the primary CTA's target now. */}
      <RequestModal
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        prefilledInterest={offer.title}
        onBookCall={() => setBookingOpen(true)}
      />
    </>
  );
}

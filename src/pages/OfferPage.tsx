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
import { ArrowLeft, ArrowRight, Check, X, Clock, ChevronDown, ChevronUp, CreditCard } from "lucide-react";
import { breadcrumbJsonLd, faqJsonLd, orgJsonLd, serviceJsonLd, websiteJsonLd } from "@/seo/jsonld";

/**
 * Price-only metadata. The localizable offer COPY now lives in i18n
 * (`offerDetails.<slug>.*` — see en.json), so /fr renders French once the FR
 * strings are supplied. Phase 8 replaces this with src/data/offers.ts
 * (EUR-primary + GBP). Keep price OUT of i18n.
 */
const OFFER_META: Record<string, { price: string }> = {
  "ai-ops-sprint": { price: "From £5k" },
  "automation-build": { price: "£15k–£30k" },
  "mvp-launch": { price: "From £25k" },
};

interface OfferContent {
  title: string;
  timeline: string;
  bestFor: string;
  price: string;
  heroDescription: string;
  deliverables: string[];
  exclusions: string[];
  successMetrics: { metric: string; example: string }[];
  weekByWeek: { week: string; activities: string[] }[];
  clientInputs: string[];
  faq: { q: string; a: string }[];
}

export default function OfferPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const slug = location.pathname.replace('/', '');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const meta = slug ? OFFER_META[slug] : null;
  const offer: OfferContent | null = meta
    ? {
        title: t(`offerDetails.${slug}.title`),
        timeline: t(`offerDetails.${slug}.timeline`),
        bestFor: t(`offerDetails.${slug}.bestFor`),
        price: meta.price,
        heroDescription: t(`offerDetails.${slug}.heroDescription`),
        deliverables: t(`offerDetails.${slug}.deliverables`, { returnObjects: true }) as string[],
        exclusions: t(`offerDetails.${slug}.exclusions`, { returnObjects: true }) as string[],
        successMetrics: t(`offerDetails.${slug}.successMetrics`, { returnObjects: true }) as { metric: string; example: string }[],
        weekByWeek: t(`offerDetails.${slug}.weekByWeek`, { returnObjects: true }) as { week: string; activities: string[] }[],
        clientInputs: t(`offerDetails.${slug}.clientInputs`, { returnObjects: true }) as string[],
        faq: t(`offerDetails.${slug}.faq`, { returnObjects: true }) as { q: string; a: string }[],
      }
    : null;

  const canonicalPath = offer ? `/${slug}` : undefined;

  const faqSchema = offer
    ? faqJsonLd(
        offer.faq.map((item) => ({
          question: item.q,
          answer: item.a,
        }))
      )
    : null;

  const serviceSchema = offer
    ? (() => {
        // Parse the "from"/low value, handling the "k" thousands suffix
        // ("From £5k" -> 5000, "£15k–£30k" -> 15000). NOTE(Phase 8): replace
        // this string-parsing with the canonical numbers from offers.ts (EUR).
        const m = offer.price.match(/(\d+(?:\.\d+)?)\s*(k)?/i);
        const parsedPrice = m ? Number.parseFloat(m[1]) * (m[2] ? 1000 : 1) : undefined;
        const isRange = /[–-]/.test(offer.price);
        return serviceJsonLd({
          name: offer.title,
          description: offer.heroDescription,
          url: `${siteUrl}/${slug}`,
          price: parsedPrice,
          priceCurrency: "GBP",
          priceRange: isRange ? offer.price : undefined,
        });
      })()
    : null;

  const breadcrumbSchema = offer
    ? breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Offers", url: `${siteUrl}/#offers` },
        { name: offer.title, url: `${siteUrl}/${slug}` },
      ])
    : null;

  if (!offer) {
    return (
      <>
        <SeoHead
          title="Offer Not Found | Innoviaburst"
          description="The offer you're looking for doesn't exist or may have moved."
          robots="noindex, nofollow"
        />
        <SkipLink />
        <Navbar onBookingClick={() => setBookingOpen(true)} />
        <main id="main-content" className="pt-20 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Offer not found</h1>
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
        title={`${offer.title} | Innoviaburst`}
        description={`${offer.heroDescription} Timeline: ${offer.timeline}.`}
        canonicalPath={canonicalPath}
        alternates={canonicalPath ? buildAlternates(canonicalPath) : undefined}
        ogType="website"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          ...(breadcrumbSchema ? [breadcrumbSchema] : []),
          ...(serviceSchema ? [serviceSchema] : []),
          ...(faqSchema ? [faqSchema] : []),
        ]}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero relative">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/#offers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Offers
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {offer.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">{offer.heroDescription}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  A focused package for workflow automations, AI copilots, or MVPs for UK/EU SMEs with GDPR/UK GDPR-ready delivery, optional DPA support, transparent sub-processor use, and agreed data retention.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-semibold text-foreground">How it works (3 quick steps)</p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Scope the workflow, AI copilot, or MVP you need with measurable outcomes.</li>
                    <li>Build and test with your live tools, approvals, and compliance checkpoints.</li>
                    <li>Deploy with documentation, data retention notes, and a trust-ready handover.</li>
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border border-border">
                    <Clock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">{offer.timeline}</span>
                  </div>
                  <div className="px-4 py-2 bg-accent/20 rounded-lg">
                    <span className="text-lg font-bold text-gradient-orange">{offer.price}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  <strong>Best for:</strong> {offer.bestFor}
                </p>

                <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
                  Book a 15-min call
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <Link to="/automations" className="text-secondary hover:underline">
                    Browse automation examples
                  </Link>
                  <Link to="/works" className="text-secondary hover:underline">
                    See case studies with ROI
                  </Link>
                  <Link to="/trust" className="text-secondary hover:underline">
                    Review trust, DPA, and retention details
                  </Link>
                </div>
              </div>

              {/* Deliverables summary */}
              <div className="p-6 bg-card rounded-2xl border border-border shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {offer.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sticky CTA for mobile - safe-area aware */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border z-50 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button variant="hero" className="w-full min-h-[48px]" onClick={() => setBookingOpen(true)}>
              Book a 15-min call
            </Button>
          </div>
        </section>

        {/* Exclusions */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-6">What's Not Included</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offer.exclusions.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Success Metrics</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {offer.successMetrics.map((metric, i) => (
                <div key={i} className="p-6 bg-card rounded-xl border border-border text-center">
                  <p className="text-lg font-bold text-foreground mb-1">{metric.metric}</p>
                  <p className="text-sm text-accent">{metric.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Timeline</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offer.weekByWeek.map((week, i) => (
                <div key={i} className="p-4 bg-card rounded-xl border border-border">
                  <p className="text-sm font-bold text-accent mb-3">{week.week}</p>
                  <ul className="space-y-2">
                    {week.activities.map((activity, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-1.5" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Inputs */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-6">What We Need From You</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {offer.clientInputs.map((input, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border">
                  <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{input}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 max-w-3xl">
              {offer.faq.map((item, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left bg-card hover:bg-muted/50 transition-colors min-h-[48px]"
                  >
                    <span className="font-medium text-foreground">{item.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="p-4 bg-muted/30 border-t border-border">
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Billing */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-4 max-w-2xl">
              <div className="p-3 rounded-xl bg-accent/20">
                <CreditCard className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Billing & Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Invoices in GBP. Payment accepted via UK bank transfer or Wise. 
                  Typical terms: 50% upfront, 50% on completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a quick call to discuss your requirements. We'll scope your project and get back to you within 48 hours.
            </p>
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8">
              Book a 15-min call
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

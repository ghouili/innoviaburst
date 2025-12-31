import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

const featureCards = [
  {
    icon: ListChecks,
    title: "Clear options",
    description: "Shortlists by team, tools, and urgency so you find what fits.",
  },
  {
    icon: Sparkles,
    title: "Real examples",
    description: "Workflows with steps + expected impact—no guesswork.",
  },
  {
    icon: Clock,
    title: "Fast scoping",
    description: "We confirm scope in 48h, delivery in weeks not months.",
  },
];

export default function ComingSoonPage() {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Coming Soon | InnoviaBurst</title>
        <meta
          name="description"
          content="We're building this page to make it easier to pick the right automation or MVP path—fast."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        Skip to main content
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
                  InnoviaBurst — Shipping weekly
                </p>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                  This page is{" "}
                  <span className="text-gradient-brand">coming soon</span>
                </h1>

                <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                  We're building this section to help you choose the right
                  workflow faster. In the meantime, explore what we can already
                  deliver.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => setBookingOpen(true)}
                    className="min-h-[52px] gap-2"
                  >
                    Book a call
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="hero-outline"
                    size="xl"
                    asChild
                    className="min-h-[52px]"
                  >
                    <Link to="/automations">See automations</Link>
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
                        Something great is brewing
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Check back soon
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
              title="What you'll find here"
              subtitle="We're designing this page to make automation decisions easier."
              align="center"
              className="mb-12"
            />

            <div className="grid md:grid-cols-3 gap-6">
              {featureCards.map((card) => (
                <UnifiedCard
                  key={card.title}
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
              title="Want this sooner?"
              subtitle="Tell us what you're trying to automate and we'll prioritise the right workflows."
              primaryCta={{
                label: "Book a call",
                onClick: () => setBookingOpen(true),
              }}
              secondaryCta={{
                label: "See automations",
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

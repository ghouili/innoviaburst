import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { HeroShell } from "@/components/sections/heroes/HeroShell";
import { AutomationLaneVisual } from "@/components/sections/heroes/AutomationLaneVisual";
// import { CredibilityStrip } from "@/components/sections/CredibilityStrip";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { OffersSection } from "@/components/sections/OffersSection";
import { MvpSection } from "@/components/sections/MvpSection";
import { TrainingSection } from "@/components/sections/TrainingSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
// import { WorkSection } from "@/components/sections/WorkSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { BookingModal } from "@/components/BookingModal";
import { RequestModal } from "@/components/RequestModal";
import { CookieConsent } from "@/components/CookieConsent";
import { StickyNextStep } from "@/components/StickyNextStep";
import { SkipLink } from "@/components/SkipLink";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import {
  breadcrumbJsonLd,
  orgJsonLd,
  websiteJsonLd,
  serviceJsonLd,
} from "@/seo/jsonld";

const Index = () => {
  const { t } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  // Seeds the request form's notes field so a scope request arriving from a
  // specific band (e.g. Training) says what it's about. Cleared for the
  // generic entry points.
  const [requestInterest, setRequestInterest] = useState<string | undefined>(
    undefined,
  );
  const location = useLocation();

  const openRequest = (interest?: string) => {
    setRequestInterest(interest);
    setIsRequestOpen(true);
  };

  // Handle SPA-safe scroll to section from footer hash links
  useEffect(() => {
    // Check if navigated with scrollTo state (from footer links)
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);

      // Clear the state to prevent re-scrolling on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <>
      <SeoHead
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        canonicalPath="/"
        alternates={buildAlternates("/")}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([{ name: "Home", url: siteUrl }]),
          // Per-pillar Service nodes so the homepage (the most-cited entry point)
          // exposes a clean service catalog for search + generative engines. Each
          // is backed by a visible band below (Offers, MVP, Training).
          serviceJsonLd({
            name: t("seo.services.automation.name"),
            description: t("seo.services.automation.description"),
            url: `${siteUrl}/automations`,
            serviceType: ["Workflow automation", "AI copilots"],
          }),
          serviceJsonLd({
            name: t("seo.services.mvp.name"),
            description: t("seo.services.mvp.description"),
            url: `${siteUrl}/mvp-launch`,
            serviceType: ["MVP development", "Software development"],
          }),
          serviceJsonLd({
            name: t("seo.services.training.name"),
            description: t("seo.services.training.description"),
            url: `${siteUrl}/training`,
            serviceType: ["Corporate AI training"],
          }),
        ]}
      />

      <SkipLink />
      <div className="min-h-screen bg-background">
        <Navbar onBookingClick={() => setIsBookingOpen(true)} />
        <main id="main-content">
          {/* 1. Hero — Design 1 (Automation lane panel) */}
          <HeroShell
            visual={<AutomationLaneVisual className="w-full" />}
            onScopeClick={() => openRequest()}
            onBookClick={() => setIsBookingOpen(true)}
          />

          {/* test  */}
          {/* 1b. Reserved slot for real client proof — labelled placeholder */}
          {/* <CredibilityStrip /> */}

          {/* 2. Proof bar */}
          <ProofStrip />

          {/* 3. Productised Offers */}
          <OffersSection onBookingClick={() => openRequest()} />

          {/* 3b. MVP band — surface MVP Launch alongside automation */}
          <MvpSection />

          {/* 3c. Training band — partner-delivered AI & automation upskilling */}
          <TrainingSection
            onRequestClick={() =>
              openRequest(t("trainingSection.requestInterest"))
            }
            onBookingClick={() => setIsBookingOpen(true)}
          />

          {/* 4. Top Workflows (6 cards + link) */}
          {/* <SolutionsSection /> */}

          {/* 5. Work teaser (2 case studies + link) */}
          {/* <WorkSection /> */}

          {/* 6. Trust teaser (3 bullets + link) */}
          <TrustSection />

          {/* 7. Final CTA */}
          <ContactSection onBookingClick={() => openRequest()} />
        </main>
        <Footer onBookingClick={() => setIsBookingOpen(true)} />
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        prefilledInterest={requestInterest}
      />

      {/* Sticky Next Step bar */}
      <StickyNextStep
        onRequestClick={() => openRequest()}
        onBookClick={() => setIsBookingOpen(true)}
      />

      

      <CookieConsent />
    </>
  );
};

export default Index;

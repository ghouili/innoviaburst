import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { OffersSection } from "@/components/sections/OffersSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { BookingModal } from "@/components/BookingModal";
import { RequestModal } from "@/components/RequestModal";
import { CookieConsent } from "@/components/CookieConsent";
import { StickyNextStep } from "@/components/StickyNextStep";
import { SkipLink } from "@/components/SkipLink";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const location = useLocation();

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
        title="Innoviaburst | AI & Automation for UK/EU SMEs — Delivered in Weeks"
        description="We help UK/EU SMEs automate workflows, ship AI copilots, and launch MVPs with compliance-ready delivery. Fast delivery in weeks, not months."
        canonicalPath="/"
        alternates={buildAlternates("/")}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
          ]),
        ]}
      />

      <SkipLink />
      <div className="min-h-screen bg-background">
        <Navbar onBookingClick={() => setIsBookingOpen(true)} />
        <main id="main-content">
          {/* 1. Hero */}
          <HeroSection 
            onBookingClick={() => setIsBookingOpen(true)} 
            onRequestClick={() => setIsRequestOpen(true)}
          />
          
          {/* 2. Proof bar */}
          <ProofStrip />
          
          {/* 3. Productised Offers */}
          <OffersSection onBookingClick={() => setIsRequestOpen(true)} />
          
          {/* 4. Top Workflows (6 cards + link) */}
          <SolutionsSection />
          
          {/* 5. Work teaser (2 case studies + link) */}
          {/* <WorkSection /> */}
          
          {/* 6. Trust teaser (3 bullets + link) */}
          <TrustSection />
          
          {/* 7. Final CTA */}
          <ContactSection onBookingClick={() => setIsRequestOpen(true)} />
        </main>
        <Footer />
      </div>

      {/* Modals */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      
      {/* Sticky Next Step bar */}
      <StickyNextStep 
        onRequestClick={() => setIsRequestOpen(true)}
        onBookClick={() => setIsBookingOpen(true)}
      />
      
      <CookieConsent />
    </>
  );
};

export default Index;
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { HeroShell } from "@/components/sections/heroes/HeroShell";
import { WeaveVisual } from "@/components/sections/heroes/WeaveVisual";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { OffersSection } from "@/components/sections/OffersSection";
import { SolutionsSection } from "@/components/sections/SolutionsSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { BookingModal } from "@/components/BookingModal";
import { RequestModal } from "@/components/RequestModal";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { SeoHead, siteUrl } from "@/components/SeoHead";
import { orgJsonLd, websiteJsonLd, breadcrumbJsonLd } from "@/seo/jsonld";

/**
 * Campaign landing page at /lp/ai-automation — Design 2 (Weave canvas) hero over
 * the reused homepage conversion sections. Hero is swappable: the only
 * difference from the homepage hero is the `visual` prop passed to HeroShell.
 */
const LandingPage = () => {
  const { t } = useTranslation();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const statLabels: [string, string, string] = [
    t("hero.stage.stat0"),
    t("hero.stage.stat1"),
    t("hero.stage.stat2"),
  ];

  return (
    <>
      <SeoHead
        title={t("seo.lp.title")}
        description={t("seo.lp.description")}
        canonicalPath="/lp/ai-automation"
        // Paid-ads page: keep it out of the index to match its noindex flag in
        // scripts/site-content.mjs (which already excludes it from the sitemap).
        robots="noindex, nofollow"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "AI automation", url: `${siteUrl}/lp/ai-automation` },
          ]),
        ]}
      />

      <SkipLink />
      <div className="min-h-screen bg-background">
        <Navbar onBookingClick={() => setIsBookingOpen(true)} />
        <main id="main-content">
          {/* Hero — Design 2 (Weave canvas) */}
          <HeroShell
            visual={<WeaveVisual className="w-full" tagLabel={t("hero.stage.tag")} statLabels={statLabels} />}
            onScopeClick={() => setIsRequestOpen(true)}
            onBookClick={() => setIsBookingOpen(true)}
          />

          <ProofStrip />
          <OffersSection onBookingClick={() => setIsRequestOpen(true)} />
          <SolutionsSection />
          <TrustSection />
          <ContactSection onBookingClick={() => setIsRequestOpen(true)} />
        </main>
        <Footer />
      </div>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <RequestModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        onBookCall={() => setIsBookingOpen(true)}
      />
      <CookieConsent />
    </>
  );
};

export default LandingPage;

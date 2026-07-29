import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { ComingSoon } from "@/components/ComingSoon";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

/**
 * /coming-soon is now just the shared ComingSoon state on a page shell.
 *
 * The SEO surface is unchanged: same title, description, canonical, alternates
 * and the noindex robots directive, so the route keeps behaving exactly as it
 * did for crawlers.
 */
export default function ComingSoonPage() {
  const { t, i18n } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <SeoHead
        title={t("comingSoon.seo.title")}
        description={t("comingSoon.seo.description")}
        canonicalPath="/coming-soon"
        alternates={buildAlternates("/coming-soon")}
        lang={i18n.language}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Coming Soon", url: `${siteUrl}/coming-soon` },
          ]),
        ]}
        robots="noindex, nofollow"
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
      >
        {t("comingSoon.skipLink")}
      </a>

      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="min-h-screen bg-gradient-hero pt-20">
        <ComingSoon onBookCall={() => setBookingOpen(true)} />
      </main>

      <Footer onBookingClick={() => setBookingOpen(true)} />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

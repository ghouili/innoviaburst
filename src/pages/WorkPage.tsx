import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

/**
 * /works — honest "case studies coming soon" placeholder until real write-ups
 * exist. noindex'd (here + excluded from the sitemap in scripts/site-content.mjs)
 * so we don't index an empty listing. The /work/[slug] CaseStudyPage component +
 * its caseStudies.* copy are kept for when cases go live (restore the grid + drop
 * the noindex then). No ItemList schema is emitted while there are no cases.
 */
export default function WorkPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <SeoHead
        title={t("seo.works.title")}
        description={t("seo.works.description")}
        canonicalPath="/works"
        alternates={buildAlternates("/works")}
        robots="noindex, follow"
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Work", url: `${siteUrl}/works` },
          ]),
        ]}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t("workPage.backToHome")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("workPage.headingPrefix")}<span className="text-gradient-brand">{t("workPage.headingHighlight")}</span>
            </h1>
          </div>
        </section>

        {/* Coming soon */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-xl mx-auto text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/15">
                <FileText className="h-7 w-7 text-secondary" aria-hidden="true" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("workPage.comingSoon.title")}</h2>
              <p className="text-muted-foreground mb-8">{t("workPage.comingSoon.body")}</p>
              <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
                <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="min-h-[48px]">
                  {t("workPage.comingSoon.bookCall")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" asChild className="min-h-[48px]">
                  <Link to="/automations">{t("workPage.comingSoon.browse")}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="min-h-[48px]">
                  <Link to="/trust">{t("workPage.comingSoon.trust")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

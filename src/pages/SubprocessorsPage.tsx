import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

// Vendor names are brand names and stay literal; the i18n key references the
// `subprocessorsPage.vendors.<key>` object for purpose/dataCategories/location/notes.
const subprocessors = [
  { name: "Amazon Web Services (AWS)", key: "aws" },
  { name: "Supabase", key: "supabase" },
  { name: "OpenAI", key: "openai" },
  { name: "Stripe", key: "stripe" },
  { name: "Vercel", key: "vercel" },
  { name: "Google Workspace", key: "googleWorkspace" },
  { name: "Calendly", key: "calendly" },
];

export default function SubprocessorsPage() {
  const { t } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);

  const jsonLd = useMemo(
    () => [
      orgJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Trust", url: `${siteUrl}/trust` },
        { name: "Sub-processors", url: `${siteUrl}/subprocessors` },
      ]),
    ],
    []
  );

  return (
    <>
      <SeoHead
        title={t("seo.subprocessors.title")}
        description={t("seo.subprocessors.description")}
        canonicalPath="/subprocessors"
        alternates={buildAlternates("/subprocessors")}
        jsonLd={jsonLd}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
            <Link to="/trust" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t("subprocessorsPage.back")}
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("subprocessorsPage.title")}</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              {t("subprocessorsPage.intro")}
            </p>

            {/* Sub-processors Table */}
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">{t("subprocessorsPage.table.vendor")}</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">{t("subprocessorsPage.table.purpose")}</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">{t("subprocessorsPage.table.dataCategories")}</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">{t("subprocessorsPage.table.location")}</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">{t("subprocessorsPage.table.notes")}</th>
                  </tr>
                </thead>
                <tbody>
                  {subprocessors.map((sp, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{sp.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{t(`subprocessorsPage.vendors.${sp.key}.purpose`)}</td>
                      <td className="py-4 px-4 text-muted-foreground">{t(`subprocessorsPage.vendors.${sp.key}.dataCategories`)}</td>
                      <td className="py-4 px-4 text-muted-foreground">{t(`subprocessorsPage.vendors.${sp.key}.location`)}</td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">{t(`subprocessorsPage.vendors.${sp.key}.notes`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">{t("subprocessorsPage.updates.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("subprocessorsPage.updates.body")}
                </p>
              </div>

              <div className="p-4 bg-card rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">{t("subprocessorsPage.fullList.title")}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("subprocessorsPage.fullList.body")}
                </p>
                <Button variant="outline" size="sm" onClick={() => setBookingOpen(true)}>
                  {t("subprocessorsPage.fullList.cta")}
                  <ArrowRight className="w-4 h-4 ml-2" />
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

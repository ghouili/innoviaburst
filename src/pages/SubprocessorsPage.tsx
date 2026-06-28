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

const subprocessors = [
  {
    name: "Amazon Web Services (AWS)",
    purpose: "Cloud infrastructure & hosting",
    dataCategories: "Application data, logs, backups",
    location: "EU (Ireland / Frankfurt)",
    notes: "ISO 27001, SOC 2 certified",
  },
  {
    name: "Supabase",
    purpose: "Database & authentication services",
    dataCategories: "User data, application data",
    location: "EU (Frankfurt)",
    notes: "SOC 2 Type II certified",
  },
  {
    name: "OpenAI",
    purpose: "AI/ML processing for copilot features",
    dataCategories: "Text data for AI processing",
    location: "USA (EU processing available)",
    notes: "DPA available, data not used for training",
  },
  {
    name: "Stripe",
    purpose: "Payment processing",
    dataCategories: "Payment information",
    location: "EU & USA",
    notes: "PCI DSS Level 1 certified",
  },
  {
    name: "Vercel",
    purpose: "Frontend hosting & deployment",
    dataCategories: "Application code, static assets",
    location: "Global CDN (EU primary)",
    notes: "SOC 2 Type II certified",
  },
  {
    name: "Google Workspace",
    purpose: "Email & document collaboration",
    dataCategories: "Communication data",
    location: "EU data residency available",
    notes: "ISO 27001, SOC 2 certified",
  },
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
              Back to Trust & Compliance
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Sub-Processors</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              The following third-party service providers may process personal data as part of our service delivery. 
              We ensure all sub-processors meet appropriate security and compliance standards.
            </p>

            {/* Sub-processors Table */}
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">Vendor</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">Purpose</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">Data Categories</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">Location</th>
                    <th className="py-4 px-4 text-left font-semibold text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {subprocessors.map((sp, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{sp.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{sp.purpose}</td>
                      <td className="py-4 px-4 text-muted-foreground">{sp.dataCategories}</td>
                      <td className="py-4 px-4 text-muted-foreground">{sp.location}</td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">{sp.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl">
                <h3 className="font-semibold text-foreground mb-2">Updates & Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  We will notify clients of any material changes to this list with reasonable advance notice. 
                  Last updated: December 2024.
                </p>
              </div>
              
              <div className="p-4 bg-card rounded-xl border border-border">
                <h3 className="font-semibold text-foreground mb-2">Full List Available on Request</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For a comprehensive list of sub-processors specific to your project, or for enterprise due diligence requirements, please get in touch.
                </p>
                <Button variant="outline" size="sm" onClick={() => setBookingOpen(true)}>
                  Request full list
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

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, localizedUrl } from "@/seo/jsonld";

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <>
      <SeoHead
        title={t("seo.privacy.title")}
        description={t("seo.privacy.description")}
        canonicalPath="/privacy"
        alternates={buildAlternates("/privacy")}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Privacy Policy", url: `${siteUrl}/privacy` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "How Innoviaburst collects, uses, and protects personal data with GDPR/UK GDPR readiness.",
            url: localizedUrl("/privacy"),
          },
        ]}
      />

      <SkipLink />
      <Navbar />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              {t("common.backToHome")}
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("privacyPage.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t("privacyPage.lastUpdated")}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.whoWeAre.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.whoWeAre.body")}
                </p>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.whoWeAre.contact")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.whatWeCollect.title")}</h2>
                <p className="text-muted-foreground mb-3">{t("privacyPage.sections.whatWeCollect.intro")}</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("privacyPage.sections.whatWeCollect.items", { returnObjects: true }) as { label: string; text: string }[]).map((item, i) => (
                    <li key={i}><strong>{item.label}</strong> {item.text}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.howWeUse.title")}</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("privacyPage.sections.howWeUse.items", { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.legalBasis.title")}</h2>
                <p className="text-muted-foreground">{t("privacyPage.sections.legalBasis.intro")}</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("privacyPage.sections.legalBasis.items", { returnObjects: true }) as { label: string; text: string }[]).map((item, i) => (
                    <li key={i}><strong>{item.label}</strong> {item.text}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.dataSharing.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.dataSharing.body")}{" "}
                  <Link to="/subprocessors" className="text-accent hover:underline">{t("privacyPage.sections.dataSharing.linkText")}</Link>.
                </p>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.dataSharing.noSell")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.retention.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.retention.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.yourRights.title")}</h2>
                <p className="text-muted-foreground mb-3">{t("privacyPage.sections.yourRights.intro")}</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("privacyPage.sections.yourRights.items", { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-3">
                  {t("privacyPage.sections.yourRights.exercise")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.transfers.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.transfers.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.complaints.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.complaints.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("privacyPage.sections.changes.title")}</h2>
                <p className="text-muted-foreground">
                  {t("privacyPage.sections.changes.body")}
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}

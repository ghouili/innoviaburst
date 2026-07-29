import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, localizedUrl } from "@/seo/jsonld";

export default function TermsPage() {
  const { t } = useTranslation();
  return (
    <>
      <SeoHead
        title={t("seo.terms.title")}
        description={t("seo.terms.description")}
        canonicalPath="/terms"
        alternates={buildAlternates("/terms")}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Terms", url: `${siteUrl}/terms` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "Terms and conditions for InnoviaBurst automation, AI copilot, and MVP services.",
            url: localizedUrl("/terms"),
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

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("termsPage.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t("termsPage.lastUpdated")}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.agreement.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.agreement.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.aboutUs.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.aboutUs.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.services.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.services.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.websiteUse.title")}</h2>
                <p className="text-muted-foreground mb-3">{t("termsPage.sections.websiteUse.intro")}</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("termsPage.sections.websiteUse.items", { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.ip.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.ip.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.liability.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.liability.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.privacy.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.privacy.body")}{" "}
                  <Link to="/privacy" className="text-accent-strong hover:underline">{t("termsPage.sections.privacy.linkText")}</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.changes.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.changes.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.governingLaw.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.governingLaw.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("termsPage.sections.contact.title")}</h2>
                <p className="text-muted-foreground">
                  {t("termsPage.sections.contact.body")}
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

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, localizedUrl } from "@/seo/jsonld";

export default function CookiesPage() {
  const { t } = useTranslation();
  return (
    <>
      <SeoHead
        title={t("seo.cookies.title")}
        description={t("seo.cookies.description")}
        canonicalPath="/cookies"
        alternates={buildAlternates("/cookies")}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", url: siteUrl },
            { name: "Cookie Policy", url: `${siteUrl}/cookies` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Cookie Policy",
            description: "Details on cookie consent, analytics opt-in, and PECR compliance for Innoviaburst.",
            url: localizedUrl("/cookies"),
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

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cookiesPage.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">{t("cookiesPage.lastUpdated")}</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.whatAreCookies.title")}</h2>
                <p className="text-muted-foreground">
                  {t("cookiesPage.sections.whatAreCookies.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.howWeUse.title")}</h2>
                <p className="text-muted-foreground mb-4">
                  {t("cookiesPage.sections.howWeUse.intro")}
                </p>

                <h3 className="text-lg font-semibold text-foreground mb-2">{t("cookiesPage.sections.howWeUse.necessary.title")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("cookiesPage.sections.howWeUse.necessary.body")}
                </p>
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>{t("cookiesPage.sections.howWeUse.necessary.consentLabel")}</strong> {t("cookiesPage.sections.howWeUse.necessary.consentDesc")}<br />
                    <strong>{t("cookiesPage.sections.howWeUse.necessary.sessionLabel")}</strong> {t("cookiesPage.sections.howWeUse.necessary.sessionDesc")}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{t("cookiesPage.sections.howWeUse.analytics.title")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("cookiesPage.sections.howWeUse.analytics.body")}
                </p>
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    {t("cookiesPage.sections.howWeUse.analytics.note")}
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{t("cookiesPage.sections.howWeUse.marketing.title")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("cookiesPage.sections.howWeUse.marketing.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.managing.title")}</h2>
                <p className="text-muted-foreground mb-4">
                  {t("cookiesPage.sections.managing.intro")}
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {(t("cookiesPage.sections.managing.bullets", { returnObjects: true }) as string[]).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-4">
                  {t("cookiesPage.sections.managing.note")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.pecr.title")}</h2>
                <p className="text-muted-foreground">
                  {t("cookiesPage.sections.pecr.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.changes.title")}</h2>
                <p className="text-muted-foreground">
                  {t("cookiesPage.sections.changes.body")}
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">{t("cookiesPage.sections.contact.title")}</h2>
                <p className="text-muted-foreground">
                  {t("cookiesPage.sections.contact.body")}
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

import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

export default function CookiesPage() {
  return (
    <>
      <SeoHead
        title="Cookie Policy | Innoviaburst"
        description="Innoviaburst Cookie Policy - How we use cookies and similar technologies."
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
            url: `${siteUrl}/cookies`,
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
              Back to home
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small text files stored on your device when you visit a website. 
                  They help websites function properly and provide information to site owners.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">How We Use Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar technologies for the following purposes:
                </p>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Necessary Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  These cookies are essential for the website to function. They enable basic features 
                  like page navigation and access to secure areas. The website cannot function properly without these.
                </p>
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Cookie consent:</strong> Stores your cookie preferences<br />
                    <strong>Session:</strong> Maintains your session while browsing
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  These cookies help us understand how visitors interact with our website. 
                  All data is anonymised. These cookies are only set with your consent.
                </p>
                <div className="p-4 bg-muted rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground">
                    We may use privacy-focused analytics to understand page views and basic usage patterns.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">Marketing Cookies</h3>
                <p className="text-muted-foreground mb-4">
                  These cookies track visitors across websites to display relevant advertisements. 
                  They are only set with your explicit consent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">Managing Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  You can manage your cookie preferences at any time:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use our cookie consent banner when you first visit</li>
                  <li>Click "Cookie settings" in the footer to change your preferences</li>
                  <li>Adjust your browser settings to block or delete cookies</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Note: Blocking necessary cookies may affect website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">UK PECR Compliance</h2>
                <p className="text-muted-foreground">
                  We comply with the Privacy and Electronic Communications Regulations (PECR). 
                  We only set non-essential cookies after obtaining your consent, and we provide clear 
                  information about what each cookie category does.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this policy from time to time. Material changes will be communicated 
                  through the website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">Contact</h2>
                <p className="text-muted-foreground">
                  Questions about our cookie policy? Contact us at hello@innoviaburst.com
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

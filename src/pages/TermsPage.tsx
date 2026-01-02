import { Link } from "react-router-dom";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

export default function TermsPage() {
  return (
    <>
      <SeoHead
        title="Terms of Service | Innoviaburst"
        description="Innoviaburst Terms of Service - Terms and conditions for using our website and services."
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
            description: "Terms and conditions for Innoviaburst automation, AI copilot, and MVP services.",
            url: `${siteUrl}/terms`,
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

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">1. Agreement</h2>
                <p className="text-muted-foreground">
                  By accessing this website, you agree to these terms and conditions. 
                  If you don't agree, please don't use the website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">2. About Us</h2>
                <p className="text-muted-foreground">
                  Innoviaburst Ltd is a company registered in England and Wales (Company No. XXXXXXXX). 
                  Registered office: [Address placeholder].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">3. Services</h2>
                <p className="text-muted-foreground">
                  We provide AI, automation, and software development services. 
                  Specific project terms are set out in separate agreements (Statements of Work).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">4. Website Use</h2>
                <p className="text-muted-foreground mb-3">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use the website lawfully and not for any unlawful purpose</li>
                  <li>Not attempt to gain unauthorised access to our systems</li>
                  <li>Not interfere with the proper working of the website</li>
                  <li>Not use automated systems to access the website without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">5. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content on this website (text, graphics, logos, images) is owned by or licensed to 
                  Innoviaburst Ltd. You may not reproduce, distribute, or modify this content without permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">6. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  While we take reasonable care, we don't guarantee the website will be error-free or uninterrupted. 
                  We exclude liability for any indirect or consequential losses to the fullest extent permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">7. Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of the website is also governed by our{" "}
                  <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">8. Changes</h2>
                <p className="text-muted-foreground">
                  We may update these terms at any time. Continued use of the website after changes 
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">9. Governing Law</h2>
                <p className="text-muted-foreground">
                  These terms are governed by English law. Disputes will be subject to the exclusive 
                  jurisdiction of the English courts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
                <p className="text-muted-foreground">
                  Questions? Contact us at hello@innoviaburst.com
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

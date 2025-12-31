import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { SkipLink } from "@/components/SkipLink";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <SeoHead
        title="Privacy Policy | Innoviaburst"
        description="Innoviaburst Privacy Policy - How we collect, use, and protect your personal data."
        path="/privacy"
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

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground mb-8">Last updated: December 2024</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">1. Who We Are</h2>
                <p className="text-muted-foreground">
                  Innoviaburst Ltd ("we", "us", "our") is a company registered in England and Wales (Company No. XXXXXXXX). 
                  We are the data controller for personal data collected through this website and our services.
                </p>
                <p className="text-muted-foreground">
                  Contact: hello@innoviaburst.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">2. What Data We Collect</h2>
                <p className="text-muted-foreground mb-3">We may collect:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Contact information:</strong> Name, email address, company name when you contact us or use our services</li>
                  <li><strong>Technical data:</strong> IP address, browser type, device information when you visit our website</li>
                  <li><strong>Usage data:</strong> How you interact with our website (with your consent)</li>
                  <li><strong>Project data:</strong> Information you share during service delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Data</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To respond to your enquiries and provide our services</li>
                  <li>To improve our website and services</li>
                  <li>To send you relevant updates (only with your consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">4. Legal Basis</h2>
                <p className="text-muted-foreground">We process your data based on:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Contract:</strong> To deliver services you've requested</li>
                  <li><strong>Legitimate interests:</strong> To improve our services and respond to enquiries</li>
                  <li><strong>Consent:</strong> For analytics and marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">5. Data Sharing</h2>
                <p className="text-muted-foreground">
                  We may share data with sub-processors who help us deliver our services. 
                  See our <Link to="/subprocessors" className="text-accent hover:underline">sub-processors list</Link>.
                </p>
                <p className="text-muted-foreground">
                  We do not sell your personal data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">6. Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain personal data only as long as necessary for the purposes described. 
                  Project data is typically deleted within 30 days of project completion unless otherwise agreed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
                <p className="text-muted-foreground mb-3">Under UK GDPR, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion</li>
                  <li>Restrict processing</li>
                  <li>Data portability</li>
                  <li>Object to processing</li>
                  <li>Withdraw consent</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  Contact us at hello@innoviaburst.com to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">8. International Transfers</h2>
                <p className="text-muted-foreground">
                  Some of our sub-processors are based outside the UK. Where this is the case, 
                  we ensure appropriate safeguards are in place, such as Standard Contractual Clauses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">9. Complaints</h2>
                <p className="text-muted-foreground">
                  If you have concerns about how we handle your data, please contact us first. 
                  You also have the right to lodge a complaint with the Information Commissioner's Office (ICO).
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-foreground mb-3">10. Changes to This Policy</h2>
                <p className="text-muted-foreground">
                  We may update this policy from time to time. Material changes will be communicated appropriately.
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

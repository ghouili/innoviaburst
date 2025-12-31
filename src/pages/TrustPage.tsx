import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Shield,
  Trash2,
  Users,
  FileCheck,
  Bot,
  Scale,
  FileText,
  Globe2,
  ClipboardList,
} from "lucide-react";

export default function TrustPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("trust-pack");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const tocItems = useMemo(
    () => [
      { id: "trust-pack", label: "Trust Pack at a glance" },
      { id: "security", label: "Security posture" },
      { id: "subprocessors", label: "Sub-processors" },
      { id: "contracts", label: "Contracts & DPA" },
      { id: "transfers", label: "International transfers" },
      { id: "ai", label: "AI oversight" },
      { id: "dpia", label: "DPIA support" },
      { id: "contact", label: "Contact" },
    ],
    [],
  );

  const trustPackItems = useMemo(
    () => [
      {
        title: "DPA available",
        subtitle: "We sign a UK GDPR-ready DPA for processor work.",
        detail: "Available on request during onboarding.",
      },
      {
        title: "Sub-processor transparency",
        subtitle: "We disclose tools that may process data and notify material changes.",
        detail: "Sub-processor list available.",
      },
      {
        title: "International transfers safeguarded",
        subtitle: "EU SCCs + UK Addendum where applicable.",
        detail: "Supports EU/UK buyer requirements.",
      },
      {
        title: "Retention & deletion",
        subtitle: "We delete or return project data on completion unless agreed otherwise.",
        detail: "Clear retention expectations.",
      },
      {
        title: "Incident response",
        subtitle: "Documented incident handling and client notification approach.",
        detail: "Breach reporting readiness.",
      },
      {
        title: "AI transparency",
        subtitle: "Human oversight for sensitive decisions and clear disclosure when AI is used.",
        detail: "Logging and review where needed.",
      },
    ],
    [],
  );

  const securityItems = useMemo(
    () => [
      {
        title: "Least-privilege access",
        bullets: [
          "Access limited to people working on your project",
          "Credentials rotated / revoked when work ends",
        ],
      },
      {
        title: "Access control",
        bullets: [
          "Role-based access where supported",
          "MFA enabled on key systems where available",
        ],
      },
      {
        title: "Audit & logging",
        bullets: [
          "Operational logs to support troubleshooting and accountability",
          "We can share logging approach in the Trust Pack",
        ],
      },
      {
        title: "Secure environments",
        bullets: [
          "Separated environments for dev/test/prod where relevant",
          "Secrets handled via environment variables / secret storage patterns",
        ],
      },
      {
        title: "Retention & deletion",
        bullets: [
          "Delete or return client data after completion (unless agreed otherwise)",
          "Full deletion available on request",
        ],
      },
      {
        title: "Incident response",
        bullets: [
          "Documented incident response process",
          "Client notification for security incidents affecting your data",
        ],
      },
    ],
    [],
  );

  const requestItems = useMemo(
    () => [
      "DPA for processor work",
      "Current sub-processor list",
      "Security questionnaire responses",
      "DPIA support details",
    ],
    [],
  );

  const sectionIds = useMemo(() => tocItems.map((item) => item.id), [tocItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.2,
      },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [sectionIds]);

  const handleTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
    if (window.innerWidth < 1024) {
      setMobileTocOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Trust & Compliance | Innoviaburst</title>
        <meta
          name="description"
          content="How InnoviaBurst protects your data: Trust Pack, DPA readiness, sub-processors, SCCs/UK Addendum, retention, incident response, and AI oversight for UK/EU buyers."
        />
      </Helmet>

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-14 lg:py-20 bg-gradient-hero border-b border-border/60">
          <div className="container mx-auto px-4 lg:px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>

            <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-secondary uppercase tracking-wide">UK/EU focused</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    Trust & <span className="text-gradient-brand">Compliance</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    How we protect your data and deliver with confidence — plain English, no legal jargon.
                  </p>
                  <p className="text-muted-foreground max-w-xl">
                    We can share a Trust Pack (PDF), DPA, and sub-processor list on request.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="min-h-[44px]">
                    Book a call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" asChild className="min-h-[44px]">
                    <a href="/trust-pack.pdf" download>
                      Download Trust Pack (PDF)
                    </a>
                  </Button>
                  <Button variant="ghost" size="lg" asChild className="min-h-[44px] text-foreground">
                    <a href="mailto:hello@innoviaburst.com">Request DPA / Security questionnaire</a>
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                  {["DPA readiness", "Sub-processors", "Retention", "Breach readiness", "SCCs + UK Addendum", "AI oversight"].map(
                    (item) => (
                      <div
                        key={item}
                        className="px-3 py-2 rounded-lg border border-border/70 bg-card text-xs font-semibold text-muted-foreground min-h-[36px] flex items-center"
                      >
                        {item}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-secondary" />
                    <p className="text-sm font-semibold text-foreground">Trust pack highlights</p>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <FileCheck className="w-4 h-4 text-secondary mt-0.5" />
                      DPA available for processor engagements
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-secondary mt-0.5" />
                      Sub-processor list and change notifications
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe2 className="w-4 h-4 text-secondary mt-0.5" />
                      EU SCCs + UK Addendum when applicable
                    </li>
                    <li className="flex items-start gap-3">
                      <Trash2 className="w-4 h-4 text-secondary mt-0.5" />
                      Retention and deletion on completion unless agreed otherwise
                    </li>
                    <li className="flex items-start gap-3">
                      <Bot className="w-4 h-4 text-secondary mt-0.5" />
                      AI transparency with human oversight
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 py-14 lg:py-20">
          <div className="lg:grid lg:grid-cols-[280px,1fr] gap-10">
            {/* Sticky Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-4 shadow-card">
                <p className="text-sm font-semibold text-foreground mb-3">On this page</p>
                <nav className="space-y-1" aria-label="Trust and Compliance table of contents">
                  {tocItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(event) => handleTocClick(event, item.id)}
                        className={`relative flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-secondary transition-colors ${
                          isActive
                            ? "text-foreground bg-muted border border-border/60"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all ${
                            isActive ? "bg-secondary" : "bg-transparent"
                          }`}
                          aria-hidden
                        />
                        <span className="pl-2">{item.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="space-y-16">
              {/* Mobile ToC */}
              <div className="lg:hidden mb-6">
                <button
                  type="button"
                  aria-expanded={mobileTocOpen}
                  aria-controls="mobile-toc-panel"
                  onClick={() => setMobileTocOpen((open) => !open)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground shadow-card min-h-[44px]"
                >
                  <span>On this page</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${mobileTocOpen ? "rotate-180" : "rotate-0"}`}
                    aria-hidden
                  />
                </button>
                {mobileTocOpen ? (
                  <div
                    id="mobile-toc-panel"
                    className="mt-3 rounded-xl border border-border bg-card divide-y divide-border overflow-hidden"
                  >
                    {tocItems.map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          aria-current={isActive ? "location" : undefined}
                          onClick={(event) => handleTocClick(event, item.id)}
                          className={`relative flex items-center justify-between gap-3 px-4 py-3 text-sm min-h-[44px] transition-colors ${
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="pl-1">{item.label}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span
                            className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${
                              isActive ? "bg-secondary" : "bg-transparent"
                            }`}
                            aria-hidden
                          />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {/* Trust Pack at a glance */}
              <section id="trust-pack" className="scroll-mt-24 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Trust Pack at a glance</h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Fast overview of the essentials buyers ask for within the first 10 seconds.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trustPackItems.map((item) => (
                    <div
                      key={item.title}
                      className="p-5 bg-card rounded-xl border border-border shadow-card h-full flex flex-col gap-3"
                    >
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      <div className="text-xs font-semibold text-secondary">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security posture */}
              <section id="security" className="scroll-mt-24 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <Shield className="w-4 h-4" />
                      Security posture
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      We apply practical security controls aligned with modern delivery for UK/EU clients:
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {securityItems.map((item) => (
                    <div
                      key={item.title}
                      className="p-5 bg-card rounded-xl border border-border shadow-card h-full flex flex-col gap-3"
                    >
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {item.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2">
                            <FileCheck className="w-4 h-4 text-secondary mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sub-processors */}
              <section id="subprocessors" className="scroll-mt-24 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <Users className="w-4 h-4" />
                      Sub-processors
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      We’re transparent about tools and services that may process data:
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 max-w-3xl">
                  {["Sub-processor list available on request", "We notify clients of material changes with reasonable notice"].map(
                    (line) => (
                      <div key={line} className="flex items-start gap-3">
                        <FileCheck className="w-4 h-4 text-secondary mt-1" />
                        <p className="text-sm text-muted-foreground">{line}</p>
                      </div>
                    ),
                  )}
                </div>

                <div className="p-5 bg-card rounded-xl border border-border max-w-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground font-semibold">Sub-processor transparency</p>
                    <p className="text-sm text-muted-foreground">View the current list and stay notified of updates.</p>
                  </div>
                  <Link
                    to="/subprocessors"
                    className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline min-h-[32px]"
                  >
                    View full list
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>

              {/* Contracts & DPA */}
              <section id="contracts" className="scroll-mt-24 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <Scale className="w-4 h-4" />
                      Contracts & DPA
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      We sign a Data Processing Agreement (DPA) when acting as a processor for your data.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Confidentiality commitments for those handling data", "Security measures appropriate to the processing", "Support for data subject requests where relevant", "Breach notification terms and cooperation", "Sub-processor controls and transparency", "Deletion or return of data on completion"].map(
                    (item) => (
                      <div key={item} className="flex items-start gap-2 p-3 bg-card rounded-lg border border-border">
                        <FileText className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* International transfers */}
              <section id="transfers" className="scroll-mt-24 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <Globe2 className="w-4 h-4" />
                      International transfers
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      For cross-border transfers, we can use modern standard safeguards when applicable:
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-card rounded-xl border border-border max-w-3xl space-y-3">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-secondary mt-1" />
                    <p className="text-sm text-foreground font-semibold">EU Standard Contractual Clauses (Decision (EU) 2021/914)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-secondary mt-1" />
                    <p className="text-sm text-foreground font-semibold">UK Addendum for UK GDPR scenarios</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We’ll align transfer safeguards with your contractual and regulatory context.
                  </p>
                </div>
              </section>

              {/* AI oversight */}
              <section id="ai" className="scroll-mt-24 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <Bot className="w-4 h-4" />
                      AI transparency & human oversight
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      We design AI features with appropriate oversight and clear disclosure:
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 max-w-3xl">
                  {["Clear disclosure when AI is involved in processing or decision support", "Human review for high-impact or sensitive use cases", "Logging/audit trails for review where appropriate"].map(
                    (item, index) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </li>
                    ),
                  )}
                </ul>
              </section>

              {/* DPIA support */}
              <section id="dpia" className="scroll-mt-24 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <ClipboardList className="w-4 h-4" />
                      DPIA support
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      If your project requires a DPIA, we can provide the technical details you need:
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["System architecture overview", "Data flows and processing purposes", "Sub-processor and transfer details", "Security measures and retention approach"].map(
                    (item) => (
                      <div key={item} className="flex items-start gap-2 p-3 bg-card rounded-lg border border-border">
                        <FileText className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </section>

              {/* What you can request */}
              <section id="requests" className="scroll-mt-24 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-12 bg-secondary rounded-full" aria-hidden />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                      <FileCheck className="w-4 h-4" />
                      What you can request
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      You can request these documents during onboarding to speed up your review:
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {requestItems.map((item) => (
                    <div key={item} className="p-4 rounded-lg border border-border bg-card text-sm text-foreground font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact */}
              <section id="contact" className="scroll-mt-24 space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-gradient-hero shadow-card text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-3">Need more details?</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    We’re happy to support your security or compliance review.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="min-h-[44px]">
                      Book a call
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" asChild className="min-h-[44px]">
                      <a href="/trust-pack.pdf" download>
                        Download Trust Pack (PDF)
                      </a>
                    </Button>
                    <Button variant="ghost" size="lg" asChild className="min-h-[44px] text-foreground">
                      <a href="mailto:hello@innoviaburst.com">Request DPA / Security questionnaire</a>
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <section className="py-6 border-t border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <p className="text-xs text-muted-foreground text-center">
              This page provides general information and is not legal advice. For specific legal requirements, consult your legal counsel.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

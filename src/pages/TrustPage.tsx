import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
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
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd } from "@/seo/jsonld";

type TocKey = "trustPack" | "security" | "subprocessors" | "contracts" | "transfers" | "ai" | "dpia" | "contact";

const tocKeys: { id: string; key: TocKey }[] = [
  { id: "trust-pack", key: "trustPack" },
  { id: "security", key: "security" },
  { id: "subprocessors", key: "subprocessors" },
  { id: "contracts", key: "contracts" },
  { id: "transfers", key: "transfers" },
  { id: "ai", key: "ai" },
  { id: "dpia", key: "dpia" },
  { id: "contact", key: "contact" },
];

type TrustPackItemKey = "dpa" | "subprocessors" | "transfers" | "retention" | "incident" | "ai";
const trustPackItemKeys: TrustPackItemKey[] = ["dpa", "subprocessors", "transfers", "retention", "incident", "ai"];

type SecurityItemKey = "leastPrivilege" | "accessControl" | "auditLogging" | "secureEnvs" | "retention" | "incident";
const securityItemKeys: SecurityItemKey[] = ["leastPrivilege", "accessControl", "auditLogging", "secureEnvs", "retention", "incident"];

export default function TrustPage() {
  const { t, i18n } = useTranslation();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("trust-pack");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const tocItems = useMemo(
    () =>
      tocKeys.map((item) => ({
        id: item.id,
        label: t(`trustPage.toc.${item.key}`),
      })),
    [t],
  );

  const trustPackItems = useMemo(
    () =>
      trustPackItemKeys.map((key) => ({
        key,
        title: t(`trustPage.trustPack.items.${key}.title`),
        subtitle: t(`trustPage.trustPack.items.${key}.subtitle`),
        detail: t(`trustPage.trustPack.items.${key}.detail`),
      })),
    [t],
  );

  const securityItems = useMemo(
    () =>
      securityItemKeys.map((key) => ({
        key,
        title: t(`trustPage.security.items.${key}.title`),
        bullets: t(`trustPage.security.items.${key}.bullets`, { returnObjects: true }) as string[],
      })),
    [t],
  );

  const requestItems = useMemo(
    () => t("trustPage.requests.items", { returnObjects: true }) as string[],
    [t],
  );

  const breadcrumbSchema = useMemo(
    () =>
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        { name: "Trust & Compliance", url: `${siteUrl}/trust` },
      ]),
    []
  );

  const pageJsonLd = useMemo(
    () => [
      orgJsonLd(),
      websiteJsonLd(),
      breadcrumbSchema,
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: t("trustPage.seo.title"),
        description: t("trustPage.seo.description"),
        url: `${siteUrl}/trust`,
      },
    ],
    [breadcrumbSchema, t]
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

  // const handleTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
  //   event.preventDefault();
  //   const el = document.getElementById(id);
  //   if (el) {
  //     el.scrollIntoView({ behavior: "smooth", block: "start" });
  //     setActiveSection(id);
  //   }
  //   if (window.innerWidth < 1024) {
  //     setMobileTocOpen(false);
  //   }
  // };

  const getScrollableParent = (node: HTMLElement | null) => {
  let el: HTMLElement | null = node;
  while (el) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const isScrollableY =
      (overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight;

    if (isScrollableY) return el;
    el = el.parentElement;
  }
  return null;
};

const handleTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
  event.preventDefault();

  const target = document.getElementById(id);
  if (!target) return;

  // Find the scroll container (e.g., your right column scroll area)
  const scrollParent = getScrollableParent(target);

  // If we found a scrollable container, scroll *it* (not the full page)
  if (scrollParent) {
    const headerOffset = 12; // adjust if you have sticky header inside the panel
    const parentRect = scrollParent.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const nextTop =
      scrollParent.scrollTop + (targetRect.top - parentRect.top) - headerOffset;

    scrollParent.scrollTo({ top: nextTop, behavior: "smooth" });
  } else {
    // Fallback: scroll the window if no scroll container exists
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  setActiveSection(id);

  if (window.innerWidth < 1024) {
    setMobileTocOpen(false);
  }
};


  return (
    <>
      <SeoHead
        title={t("trustPage.seo.title")}
        description={t("trustPage.seo.description")}
        canonicalPath="/trust"
        alternates={buildAlternates("/trust")}
        lang={i18n.language}
        jsonLd={pageJsonLd}
      />

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
              {t("trustPage.backToHome")}
            </Link>

            <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-secondary uppercase tracking-wide">{t("trustPage.badge")}</p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    {t("trustPage.title")} <span className="text-gradient-brand">{t("trustPage.titleHighlight")}</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    {t("trustPage.subtitle")}
                  </p>
                  <p className="text-muted-foreground max-w-xl">
                    {t("trustPage.trustPackAvailable")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                  <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[44px]">
                    {t("trustPage.primaryCta")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg" asChild className="w-full sm:w-auto min-h-[44px]">
                    <a href="/trust-pack.pdf" download>
                      {t("trustPage.downloadTrustPack")}
                    </a>
                  </Button>
                  <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto min-h-[44px] text-foreground">
                    <a href="mailto:hello@innoviaburst.com">{t("trustPage.requestDpa")}</a>
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl">
                  {(t("trustPage.heroTags", { returnObjects: true }) as string[]).map(
                    (item) => (
                      <div
                        key={item}
                        className="flex justify-center px-3 py-2 rounded-lg border border-border/70 bg-card text-xs font-semibold text-muted-foreground min-h-[36px] items-center"
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
                    <p className="text-sm font-semibold text-foreground">{t("trustPage.trustPackHighlights.title")}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <FileCheck className="w-4 h-4 text-secondary mt-0.5" />
                      {(t("trustPage.trustPackHighlights.items", { returnObjects: true }) as string[])[0]}
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-secondary mt-0.5" />
                      {(t("trustPage.trustPackHighlights.items", { returnObjects: true }) as string[])[1]}
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe2 className="w-4 h-4 text-secondary mt-0.5" />
                      {(t("trustPage.trustPackHighlights.items", { returnObjects: true }) as string[])[2]}
                    </li>
                    <li className="flex items-start gap-3">
                      <Trash2 className="w-4 h-4 text-secondary mt-0.5" />
                      {(t("trustPage.trustPackHighlights.items", { returnObjects: true }) as string[])[3]}
                    </li>
                    <li className="flex items-start gap-3">
                      <Bot className="w-4 h-4 text-secondary mt-0.5" />
                      {(t("trustPage.trustPackHighlights.items", { returnObjects: true }) as string[])[4]}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 pt-14 pb-6 lg:pt-20 lg:pb-10">
          <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-10 lg:items-start">
            {/* Sticky Table of Contents - Desktop */}
            <aside className="hidden lg:block">
              <nav className="lg:sticky lg:top-[88px] max-h-[calc(100vh-104px)] overflow-y-auto rounded-lg border border-border bg-card px-6 py-8 shadow-card scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <p className="text-sm font-semibold text-foreground mb-3">{t("trustPage.toc.title")}</p>
                <div className="space-y-1" aria-label="Trust and Compliance table of contents">
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
                </div>
              </nav>
            </aside>

            <div className="flex flex-col gap-16 pt-0 min-w-0 w-fit -mt-[15px] h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide" id="trust-content-scroll">
              {/* Mobile ToC */}
              <div className="lg:hidden mb-2">
                <button
                  type="button"
                  aria-expanded={mobileTocOpen}
                  aria-controls="mobile-toc-panel"
                  onClick={() => setMobileTocOpen((open) => !open)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground shadow-card min-h-[44px]"
                >
                  <span>{t("trustPage.toc.title")}</span>
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
                    <h2 className="text-2xl font-bold text-foreground">{t("trustPage.trustPack.title")}</h2>
                    <p className="text-muted-foreground max-w-2xl">
                      {t("trustPage.trustPack.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trustPackItems.map((item) => (
                    <div
                      key={item.key}
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
                      {t("trustPage.security.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.security.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {securityItems.map((item) => (
                    <div
                      key={item.key}
                      className="p-5 bg-card rounded-xl border border-border shadow-card h-full flex flex-col gap-3"
                    >
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
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
                      {t("trustPage.contracts.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.contracts.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(t("trustPage.contracts.items", { returnObjects: true }) as string[]).map(
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
                      {t("trustPage.transfers.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.transfers.subtitle")}
                    </p>
                  </div>
                </div>
                <div className="p-5 bg-card rounded-xl border border-border max-w-3xl space-y-3">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-secondary mt-1" />
                    <p className="text-sm text-foreground font-semibold">{t("trustPage.transfers.sccs")}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-secondary mt-1" />
                    <p className="text-sm text-foreground font-semibold">{t("trustPage.transfers.ukAddendum")}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("trustPage.transfers.note")}
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
                      {t("trustPage.ai.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.ai.subtitle")}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 max-w-3xl">
                  {(t("trustPage.ai.items", { returnObjects: true }) as string[]).map(
                    (item, index) => (
                      <li key={index} className="flex items-start gap-3">
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
                      {t("trustPage.dpia.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.dpia.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(t("trustPage.dpia.items", { returnObjects: true }) as string[]).map(
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
                      {t("trustPage.requests.title")}
                    </div>
                    <p className="text-muted-foreground max-w-3xl">
                      {t("trustPage.requests.subtitle")}
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
                  <h2 className="text-2xl font-bold text-foreground mb-3">{t("trustPage.contact.title")}</h2>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    {t("trustPage.contact.subtitle")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)} className="w-full sm:w-auto min-h-[44px]">
                      {t("trustPage.primaryCta")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto min-h-[44px]">
                      <a href="/trust-pack.pdf" download>
                        {t("trustPage.downloadTrustPack")}
                      </a>
                    </Button>
                    <Button variant="ghost" size="lg" asChild className="w-full sm:w-auto min-h-[44px] text-foreground">
                      <a href="mailto:hello@innoviaburst.com">{t("trustPage.requestDpa")}</a>
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
              {t("trustPage.disclaimer")}
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

import { useState, useMemo, useCallback, useEffect } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { RequestModal } from "@/components/RequestModal";
import { AutomationQuickView } from "@/components/AutomationQuickView";
import { SkipLink } from "@/components/SkipLink";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Search,
  Clock,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SeoHead, buildAlternates, siteUrl } from "@/components/SeoHead";
import { breadcrumbJsonLd, orgJsonLd, websiteJsonLd, faqJsonLd, localizedUrl } from "@/seo/jsonld";

const categoryKeys = ["all", "sales", "ops", "support", "finance", "knowledge"] as const;

const industryKeys = ["all", "b2b", "b2c", "saas", "services", "retail"] as const;

const tools = [
  "HubSpot",
  "Salesforce",
  "Slack",
  "Google Workspace",
  "Microsoft 365",
  "Notion",
  "Zendesk",
  "Xero",
  "Zapier/Make",
];

const sortOptionKeys = ["impact", "fastest", "popular", "newest"] as const;

// Automation metadata (non-translatable fields)
const automationKeys = [
  {
    key: "leadToMeeting",
    category: "Sales",
    tools: ["HubSpot", "Slack", "Calendly", "Webhook"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 10,
    createdAt: "2025-01-05",
    industry: "B2B / SaaS",
  },
  {
    key: "aiSupportTriage",
    category: "Support",
    tools: ["Zendesk (or Gmail)", "Slack", "OpenAI", "Notion (KB)"],
    deliveryTime: "2–4 weeks",
    deliveryWeeksMin: 2,
    deliveryWeeksMax: 4,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-06",
    industry: "SaaS / Services",
  },
  {
    key: "stripeDunning",
    category: "Finance",
    tools: ["Stripe", "HubSpot", "Gmail", "Slack", "Google Sheets"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-07",
    industry: "SaaS / E-commerce",
  },
  {
    key: "shopifyFulfillment",
    category: "Ops",
    tools: ["Shopify", "Slack", "Google Sheets (or Airtable)", "Gmail"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-08",
    industry: "Retail / E-commerce",
  },
  {
    key: "invoiceReminder",
    category: "Finance",
    tools: ["Stripe (or Xero)", "Gmail", "Slack", "Google Sheets"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-09",
    industry: "Services / B2B",
  },
  {
    key: "recruitmentPipeline",
    category: "Ops",
    tools: ["Typeform (or Webform)", "Notion", "Calendly", "Google Calendar", "Slack", "Gmail"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 7,
    popularityScore: 7,
    createdAt: "2025-01-10",
    industry: "Startups / SMEs",
  },
  {
    key: "salesHandoff",
    category: "Ops",
    tools: ["HubSpot", "Notion (or Asana)", "Slack", "Gmail", "Calendly"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-11",
    industry: "B2B / SaaS",
  },
  {
    key: "demoQualification",
    category: "Sales",
    tools: ["HubSpot", "Slack", "Calendly", "Gmail", "Webhook"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-12",
    industry: "B2B / Agencies",
  },
  {
    key: "execOpsDigest",
    category: "Ops",
    tools: ["Google Sheets", "Slack", "Gmail", "HubSpot (optional)", "Asana/Jira (optional)"],
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 7,
    popularityScore: 7,
    createdAt: "2025-01-13",
    industry: "Startups / SMEs",
  },
  {
    key: "aiKnowledgeBase",
    category: "Knowledge",
    tools: ["Notion", "Zendesk (or Gmail)", "OpenAI", "Slack"],
    deliveryTime: "2–4 weeks",
    deliveryWeeksMin: 2,
    deliveryWeeksMax: 4,
    impactScore: 8,
    popularityScore: 7,
    createdAt: "2025-01-14",
    industry: "SaaS / Services",
  },
] as const;

// Type for resolved automation with translations
interface Automation {
  key: string;
  title: string;
  category: string;
  outcome: string;
  problem: string;
  steps: string[];
  tools: string[];
  kpi: string;
  deliveryTime: string;
  deliveryWeeksMin: number;
  deliveryWeeksMax: number;
  impactScore: number;
  popularityScore: number;
  createdAt: string;
  industry: string;
}

export default function AutomationsPage() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewAutomation, setQuickViewAutomation] = useState<Automation | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  // Resolve automation translations
  const automations: Automation[] = useMemo(() => {
    return automationKeys.map((item) => ({
      key: item.key,
      title: t(`automationsPage.items.${item.key}.title`),
      category: item.category,
      outcome: t(`automationsPage.items.${item.key}.outcome`),
      problem: t(`automationsPage.items.${item.key}.problem`),
      steps: t(`automationsPage.items.${item.key}.steps`, { returnObjects: true }) as string[],
      tools: [...item.tools],
      kpi: t(`automationsPage.items.${item.key}.kpi`),
      deliveryTime: item.deliveryTime,
      deliveryWeeksMin: item.deliveryWeeksMin,
      deliveryWeeksMax: item.deliveryWeeksMax,
      impactScore: item.impactScore,
      popularityScore: item.popularityScore,
      createdAt: item.createdAt,
      industry: item.industry,
    }));
  }, [t]);

  // Simulated load - in production this would be data fetching
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let results = automations;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.outcome.toLowerCase().includes(query) ||
          a.problem.toLowerCase().includes(query) ||
          a.tools.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      // Map internal key to display value for comparison
      const displayCategory = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
      results = results.filter((a) => a.category === displayCategory || a.category.toLowerCase() === selectedCategory);
    }

    // Tools filter
    if (selectedTools.length > 0) {
      results = results.filter((a) =>
        selectedTools.some((tool) => a.tools.includes(tool))
      );
    }

    // Delivery filter (by week range)
    if (selectedDelivery) {
      const [min, max] = selectedDelivery.split("-").map((v) => Number(v));
      results = results.filter((a) => {
        if (!a.deliveryWeeksMin) return true;
        if (Number.isNaN(min)) return true;
        if (max === undefined || Number.isNaN(max)) {
          return a.deliveryWeeksMin >= min;
        }
        return (
          a.deliveryWeeksMin >= min &&
          (a.deliveryWeeksMax ?? a.deliveryWeeksMin) <= max
        );
      });
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      results = results.filter((a) => (a.industry ?? "").toLowerCase().includes(selectedIndustry));
    }

    // Sort
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case "impact":
          return b.impactScore - a.impactScore;
        case "fastest":
          return (a.deliveryWeeksMin ?? 99) - (b.deliveryWeeksMin ?? 99);
        case "newest":
          return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
        case "popular":
        default:
          return b.popularityScore - a.popularityScore;
      }
    });

    return results;
  }, [
    automations,
    selectedCategory,
    selectedTools,
    sortBy,
    searchQuery,
    selectedDelivery,
    selectedIndustry,
  ]);

  const handleRequestBuild = (title: string) => {
    setSelectedAutomation(title);
    setQuickViewAutomation(null); // Close quick view if open
    setRequestOpen(true);
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "automation_request", automation: title },
      })
    );
  };

  const handleQuickView = (automation: Automation) => {
    setQuickViewAutomation(automation);
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "automation_quickview", automation: automation.title },
      })
    );
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const clearAll = useCallback(() => {
    setSelectedTools([]);
    setSelectedCategory("all");
    setSelectedDelivery("");
    setSelectedIndustry("all");
    setSearchQuery("");
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      selectedCategory !== "all" ||
      selectedTools.length > 0 ||
      Boolean(selectedDelivery) ||
      selectedIndustry !== "all" ||
      Boolean(searchQuery.trim()),
    [
      selectedCategory,
      selectedTools,
      selectedDelivery,
      selectedIndustry,
      searchQuery,
    ]
  );

  const automationListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t("automationsPage.title") + " " + t("automationsPage.titleHighlight"),
      itemListOrder: "Unordered",
      itemListElement: automations.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.outcome,
        url: localizedUrl(`/automations#${item.key}`),
      })),
    }),
    [automations, t]
  );

  const faqItems = t("automationsPage.faq.items", { returnObjects: true }) as { q: string; a: string }[];

  const baseJsonLd = useMemo(
    () => [
      orgJsonLd(),
      websiteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: siteUrl },
        // Short breadcrumb label (the meta title is now a long keyword phrase).
        { name: t("nav.automations"), url: `${siteUrl}/automations` },
      ]),
      ...(Array.isArray(faqItems) && faqItems.length
        ? [faqJsonLd(faqItems.map((f) => ({ question: f.q, answer: f.a })))]
        : []),
    ],
    [t, faqItems]
  );

  return (
    <>
      <SkipLink />
      <SeoHead
        title={t("automationsPage.metaTitle")}
        description={t("automationsPage.metaDescription")}
        canonicalPath="/automations"
        alternates={buildAlternates("/automations")}
        lang={i18n.language}
        jsonLd={[...baseJsonLd, automationListSchema]}
      />

      <Navbar onBookingClick={() => setRequestOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-12 lg:py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring rounded-lg px-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("automationsPage.backToHome")}
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t("automationsPage.title")} <span className="text-gradient-brand">{t("automationsPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {t("automationsPage.subtitle")}
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-3">
              <Link to="/works" className="text-secondary hover:underline">
                {t("work.viewCaseStudy")}
              </Link>
              <Link to="/trust" className="text-secondary hover:underline">
                {t("trust.viewPage")}
              </Link>
            </div>
          </div>
        </section>

        {/* Search + Filters */}
        <section className="py-4 border-b border-border bg-card sticky top-16 lg:top-20 z-40">
          <div className="container mx-auto px-4 lg:px-6 space-y-4">
            {/* Search + Sort row */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder={t("automationsPage.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]"
                  aria-label={t("automationsPage.searchPlaceholder")}
                />
              </div>
              <div className="mt-3 md:mt-0 flex items-center gap-2">
                <label
                  className="text-sm text-foreground"
                  htmlFor="sort-select"
                >
                  {t("automationsPage.sort")}
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-muted text-sm min-h-[40px]"
                >
                  {sortOptionKeys.map((opt) => (
                    <option key={opt} value={opt}>
                      {t(`automationsPage.sortOptions.${opt}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category chips + filter toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-1 px-1">
                {categoryKeys.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] snap-start focus:outline-none focus:ring-2 focus:ring-ring ${
                      selectedCategory === cat
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-pressed={selectedCategory === cat}
                    aria-current={selectedCategory === cat ? "true" : undefined}
                  >
                    {t(`automationsPage.categories.${cat}`)}
                  </button>
                ))}
              </div>

              <Drawer open={showFilters} onOpenChange={setShowFilters}>
                <DrawerTrigger asChild>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-ring ${
                      hasActiveFilters
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-expanded={showFilters}
                    aria-controls="filters-panel"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {t("automationsPage.filters")}
                  </button>
                </DrawerTrigger>
                <DrawerContent
                  id="filters-panel"
                  className="max-h-[80vh] overflow-y-auto"
                >
                  <DrawerHeader>
                    <DrawerTitle>{t("automationsPage.filters")}</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-6 pb-6 space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        {t("automationsPage.filterTools")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((tool) => (
                          <button
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                              selectedTools.includes(tool)
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                            aria-pressed={selectedTools.includes(tool)}
                          >
                            {tool}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        {t("automationsPage.filterDelivery")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["1-2", "2-3", "3-4", "4-999"].map((range) => {
                          const label =
                            range === "4-999"
                              ? t("automationsPage.weeksPlus")
                              : `${range.replace("-", "–")} ${t("automationsPage.weeks")}`;
                          return (
                            <button
                              key={range}
                              onClick={() =>
                                setSelectedDelivery(
                                  selectedDelivery === range ? "" : range
                                )
                              }
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                                selectedDelivery === range
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                              aria-pressed={selectedDelivery === range}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        {t("automationsPage.filterIndustry")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {industryKeys.map((ind) => (
                          <button
                            key={ind}
                            onClick={() => setSelectedIndustry(ind)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                              selectedIndustry === ind
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                            aria-pressed={selectedIndustry === ind}
                          >
                            {t(`automationsPage.industries.${ind}`)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setShowFilters(false)}
                        className="min-h-[44px]"
                      >
                        {t("automationsPage.close")}
                      </Button>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          onClick={clearAll}
                          className="min-h-[44px] text-accent-strong"
                        >
                          {t("automationsPage.clearFilters")}
                        </Button>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            {/* Active filters summary */}
            {hasActiveFilters && (
              <div className="flex items-center flex-wrap gap-2 text-sm">
                {[
                  selectedCategory !== "all" && `${t("automationsPage.categories." + selectedCategory)}`,
                  selectedIndustry !== "all" && `${t("automationsPage.industries." + selectedIndustry)}`,
                  selectedDelivery &&
                    `${
                      selectedDelivery === "4-999"
                        ? t("automationsPage.weeksPlus")
                        : selectedDelivery.replace("-", "–") + " " + t("automationsPage.weeks")
                    }`,
                  ...selectedTools.map((t) => t),
                  searchQuery && `"${searchQuery}"`,
                ]
                  .filter(Boolean)
                  .map((chip) => (
                    <span
                      key={chip as string}
                      className="px-3 py-1 rounded-full bg-muted text-foreground min-h-[32px] flex items-center"
                    >
                      {chip as string}
                    </span>
                  ))}
                <button
                  onClick={clearAll}
                  className="text-sm text-accent-strong hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 min-h-[32px]"
                >
                  {t("automationsPage.clearAll")}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Results count */}
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>
                {filteredAndSorted.length === 1 
                  ? t("automationsPage.resultsCount", { count: filteredAndSorted.length })
                  : t("automationsPage.resultsCountPlural", { count: filteredAndSorted.length })}
              </>
            )}
          </div>
        </div>

        {/* Grid */}
        <section className="pb-12 lg:pb-16">
          <div className="container mx-auto px-4 lg:px-6">
            {isLoading ? (
              /* Skeleton Grid */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AutomationCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  {t("automationsPage.noResults")}
                </p>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="min-h-[44px]"
                >
                  {t("automationsPage.clearFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSorted.map((automation, index) => (
                  <AutomationCard
                    key={index}
                    automation={automation}
                    onRequest={() => handleRequestBuild(automation.title)}
                    onQuickView={() => handleQuickView(automation)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Banner */}
        {/* <section className="py-12 lg:py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-2xl mx-auto">
              <NewsletterForm
                placement="library"
                headline="Get new automations in your inbox"
                description="We publish new workflow templates monthly. Subscribe to get notified, plus early access to pilot programmes."
                buttonText="Subscribe"
                shortConsent
              />
            </div>
          </div>
        </section> */}

        {/* FAQ — definitional + practical Q&A. Native <details> keeps answers in
            the DOM even when collapsed, so the FAQPage schema maps 1:1. */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("automationsPage.faq.heading")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {t("automationsPage.faq.intro")}
            </p>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {Array.isArray(faqItems) &&
                faqItems.map((item) => (
                  <details key={item.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-[0.95rem] font-semibold text-foreground">{item.q}</h3>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-transform duration-200 group-open:rotate-180">
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                  </details>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t("automationsPage.cta.title")}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t("automationsPage.cta.subtitle")}
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => setRequestOpen(true)}
              className="w-full sm:w-auto min-h-[48px]"
            >
              {t("automationsPage.cta.button")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      <CookieConsent />
      <RequestModal
        isOpen={requestOpen}
        onClose={() => setRequestOpen(false)}
        prefilledInterest={selectedAutomation}
        source="automations"
      />
      <AutomationQuickView
        automation={quickViewAutomation}
        isOpen={!!quickViewAutomation}
        onClose={() => setQuickViewAutomation(null)}
        onRequestBuild={handleRequestBuild}
      />
    </>
  );
}


function AutomationCard({
  automation,
  onRequest,
  onQuickView,
}: {
  automation: Automation;
  onRequest: () => void;
  onQuickView: () => void;
}) {
  const { t } = useTranslation();
  const [stepsOpen, setStepsOpen] = useState(false);

  const handleCardClick = () => {
    onQuickView();
  };

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <article
      className={[
        // container
        "group relative flex flex-col cursor-pointer",
        "rounded-2xl border border-border/60 bg-card",
        "p-5 shadow-card transition-all",
        "hover:-translate-y-0.5 hover:shadow-card-hover hover:border-primary/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        "overflow-hidden",
      ].join(" ")}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Open quick view for ${automation.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* subtle top glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <div className="absolute -top-24 left-1/2 h-40 w-[120%] -translate-x-1/2 rounded-full bg-primary/10 blur-2xl" />
      </div>

      <div className="relative space-y-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-accent/15 text-accent-strong px-3 py-1 text-xs font-semibold">
              {automation.category}
            </span>

            {automation.industry && (
              <span className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                {automation.industry}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{automation.deliveryTime}</span>
          </div>
        </div>

        {/* Title + Outcome */}
        <div className="space-y-1">
          <h3 className="text-[17px] font-bold leading-snug text-foreground">
            {automation.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {automation.outcome}
          </p>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5">
          {automation.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center rounded-full border border-border/60 bg-muted/35 px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Actions row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onQuickView}
              onMouseDown={stop}
              className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs text-secondary
                       hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ minHeight: 32 }}
            >
              <Eye className="h-3.5 w-3.5" />
              {t("automationsPage.card.quickView")}
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative mt-4 pt-4 space-y-6 ">
        {/* KPI (more “premium” block) */}
        <div className="mt-4 rounded-xl border border-accent/15 bg-accent/8 px-3 py-2">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-wide text-accent-strong">
                {t("automationsPage.card.exampleImpact")}
              </div>
              <div className="text-sm font-semibold text-muted-foreground line-clamp-1">
                {automation.kpi}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50" />
        <Button
          variant="hero"
          size="default"
          className="w-full min-h-[44px] group/button"
          onClick={(e) => {
            e.stopPropagation();
            onRequest();
          }}
        >
          {t("automationsPage.card.requestBuild")}
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-0.5" />
        </Button>
      </div>
    </article>
  );
}

/**
 * Skeleton loader for automation cards
 * Matches the layout of AutomationCard for smooth loading transitions
 */
function AutomationCardSkeleton() {
  return (
    <article
      className="relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-card overflow-hidden"
      aria-hidden="true"
    >
      <div className="space-y-4 flex-1">
        {/* Header badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Title + Outcome */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Actions row */}
        <div className="pt-1">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* CTA area */}
      <div className="mt-4 pt-4 space-y-4">
        {/* KPI block */}
        <Skeleton className="h-14 w-full rounded-xl" />
        
        <div className="border-t border-border/50" />
        
        {/* Button */}
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </article>
  );
}

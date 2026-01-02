import { useMemo, useState, useId } from "react";
import { Link } from "react-router-dom";
import { SeoHead, siteUrl } from "@/components/SeoHead";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { BookingModal } from "@/components/BookingModal";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckSquare,
  RefreshCw,
  Shield,
  Plug,
  FileText,
  Brain,
  Settings,
  Search,
  Clock,
  Star,
  ShieldCheck,
  Scale,
  ClipboardList,
  Activity,
  BarChart3,
  FileSpreadsheet,
  BookOpen,
  FileCheck,
  CheckCircle,
  Loader2,
  AlertCircle,
  LayoutTemplate,
  ListChecks,
  Workflow,
  Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Resource = {
  icon: LucideIcon;
  title: string;
  description: string;
  type:
    | "Guide"
    | "Checklist"
    | "Template"
    | "Calculator"
    | "Playbook"
    | "Reference";
  category: string;
  tags: string[];
  featured?: boolean;
  updatedAt?: string;
  timeToComplete?: string;
  usefulness?: number;
  ctaLabel: string;
  href: string;
};

const categories = [
  { id: "all", label: "All" },
  { id: "roi", label: "Automation ROI" },
  { id: "ai", label: "AI Copilots" },
  { id: "crm", label: "HubSpot/CRM" },
  { id: "ops", label: "Operations" },
  { id: "compliance", label: "Compliance" },
];

const resources: Resource[] = [
  // ===== Updated (your existing 8) =====
  {
    icon: Calculator,
    title: "Automation ROI Assessment Tool",
    description:
      "Quantify savings from automations using time, volume, and error inputs—built for UK/EU SMEs.",
    type: "Calculator",
    category: "roi",
    featured: true,
    tags: ["roi", "calculator", "savings", "assessment"],
    updatedAt: "2025-12-30",
    timeToComplete: "15 min",
    usefulness: 9,
    ctaLabel: "Calculate ROI",
    href: "#contact",
  },
  {
    icon: CheckSquare,
    title: "AI Copilot Deployment Checklist",
    description:
      "A practical rollout checklist from pilot to monitoring—data prep, testing, governance, and launch.",
    type: "Checklist",
    category: "ai",
    featured: true,
    tags: ["ai", "copilot", "deployment", "checklist"],
    updatedAt: "2025-12-30",
    timeToComplete: "30 min",
    usefulness: 10,
    ctaLabel: "Get checklist",
    href: "#contact",
  },
  {
    icon: RefreshCw,
    title: "HubSpot Data Quality Checklist",
    description:
      "Monthly CRM hygiene tasks (dedupe, standardise, validate) so automations + AI inputs stay reliable.",
    type: "Checklist",
    category: "crm",
    featured: true,
    tags: ["crm", "hubspot", "quality", "data"],
    updatedAt: "2025-12-30",
    timeToComplete: "25 min",
    usefulness: 8,
    ctaLabel: "Get checklist",
    href: "#contact",
  },
  {
    icon: Shield,
    title: "UK/EU AI Compliance Roadmap",
    description:
      "Plain-English roadmap for GDPR + AI compliance decisions—what to check before shipping AI features.",
    type: "Guide",
    category: "compliance",
    featured: true,
    tags: ["gdpr", "ai-act", "ico", "roadmap"],
    updatedAt: "2025-12-30",
    timeToComplete: "40 min",
    usefulness: 9,
    ctaLabel: "Open roadmap",
    href: "#contact",
  },
  {
    icon: Plug,
    title: "API Integration Reliability Playbook",
    description:
      "Patterns for Zapier/Make/API integrations with monitoring, retries, and practical failure handling.",
    type: "Playbook",
    category: "ops",
    tags: ["integration", "api", "reliability", "playbook"],
    updatedAt: "2025-12-30",
    timeToComplete: "45 min",
    usefulness: 8,
    ctaLabel: "Open playbook",
    href: "#contact",
  },
  {
    icon: Brain,
    title: "RAG KB Implementation Guide",
    description:
      "How to build a knowledge base assistant that’s actually useful—data prep, structure, governance, deployment.",
    type: "Guide",
    category: "ai",
    tags: ["knowledge-base", "rag", "governance"],
    updatedAt: "2025-12-30",
    timeToComplete: "1 hour",
    usefulness: 9,
    ctaLabel: "Open guide",
    href: "#contact",
  },
  {
    icon: Settings,
    title: "Workflow Efficiency Audit Template",
    description:
      "Score your workflows to find the highest-impact automation opportunities—includes a prioritisation matrix.",
    type: "Template",
    category: "ops",
    tags: ["audit", "template", "efficiency", "workflow"],
    updatedAt: "2025-12-30",
    timeToComplete: "30 min",
    usefulness: 8,
    ctaLabel: "Get template",
    href: "#contact",
  },
  {
    icon: FileText,
    title: "DPA + AI Data Processing Reference",
    description:
      "A quick-scan reference for DPAs + AI data processing expectations (sub-processors, retention, incidents, transparency).",
    type: "Reference",
    category: "compliance",
    tags: ["dpa", "privacy", "edpb", "reference"],
    updatedAt: "2025-12-30",
    timeToComplete: "10 min",
    usefulness: 8,
    ctaLabel: "Open reference",
    href: "#contact",
  },

  // ===== New (from Perplexity recommendations) =====
  {
    icon: ShieldCheck,
    title: "EU AI Act Readiness Checklist",
    description:
      "Fast checklist to sanity-check AI features against EU AI Act obligations before rollout.",
    type: "Checklist",
    category: "compliance",
    featured: true,
    tags: ["ai-act", "compliance", "checklist", "gpai", "readiness"],
    updatedAt: "2025-12-30",
    timeToComplete: "30 min",
    usefulness: 10,
    ctaLabel: "Download checklist",
    href: "#contact",
  },
  {
    icon: Scale,
    title: "UK ICO AI Fairness Audit Template",
    description:
      "A structured template to assess fairness and bias risks in AI-supported decisions (UK GDPR-aligned).",
    type: "Template",
    category: "compliance",
    tags: ["ico", "fairness", "gdpr", "bias", "audit", "transparency"],
    updatedAt: "2025-12-30",
    timeToComplete: "45 min",
    usefulness: 9,
    ctaLabel: "Get template",
    href: "#contact",
  },
  {
    icon: ClipboardList,
    title: "Vendor Security Review Questionnaire",
    description:
      "A lightweight DDQ-style checklist to review AI/automation vendors: sub-processors, retention, incidents, access controls.",
    type: "Template",
    category: "compliance",
    tags: ["vendor", "security", "ddq", "dpa", "procurement", "sub-processors"],
    updatedAt: "2025-12-30",
    timeToComplete: "20 min",
    usefulness: 9,
    ctaLabel: "Get questionnaire",
    href: "#contact",
  },
  {
    icon: Activity,
    title: "Automation Monitoring & Retry Playbook (Zapier/Make)",
    description:
      "A practical playbook for reliability: logging, retry strategy, webhook resiliency, and failure alerts.",
    type: "Playbook",
    category: "ops",
    tags: [
      "zapier",
      "make",
      "error-handling",
      "monitoring",
      "retries",
      "webhooks",
    ],
    updatedAt: "2025-12-30",
    timeToComplete: "40 min",
    usefulness: 9,
    ctaLabel: "Open playbook",
    href: "#contact",
  },
  {
    icon: BarChart3,
    title: "RevOps CRM Hygiene Scorecard (HubSpot)",
    description:
      "Score your CRM data quality in minutes and get a clear improvement plan to make automations + reporting trustworthy.",
    type: "Checklist",
    category: "crm",
    tags: ["hubspot", "crm", "hygiene", "data-quality", "revops", "scorecard"],
    updatedAt: "2025-12-30",
    timeToComplete: "25 min",
    usefulness: 8,
    ctaLabel: "Get scorecard",
    href: "#contact",
  },
  {
    icon: FileSpreadsheet,
    title: "AI Business Case Builder Template",
    description:
      "Simple template to build an internal ROI case: time saved, errors reduced, payback, and rollout assumptions.",
    type: "Template",
    category: "roi",
    tags: ["roi", "business-case", "template", "savings", "automation"],
    updatedAt: "2025-12-30",
    timeToComplete: "30 min",
    usefulness: 8,
    ctaLabel: "Get template",
    href: "#contact",
  },
];

// const resources: Resource[] = [
//   {
//     icon: Calculator,
//     title: "Automation ROI Calculator",
//     description:
//       "Estimate time and cost savings from automating your workflows. Input your current process metrics and see potential ROI.",
//     type: "Calculator",
//     category: "roi",
//     featured: true,
//     tags: ["roi", "calculator", "savings", "finance"],
//     updatedAt: "2024-12-01",
//     timeToComplete: "5 min",
//     usefulness: 9,
//     ctaLabel: "Use calculator",
//     href: "#contact",
//   },
//   {
//     icon: CheckSquare,
//     title: "AI Copilot Rollout Checklist",
//     description:
//       "Step-by-step guide to deploying AI assistants in your organisation. Covers data prep, training, testing, and launch.",
//     type: "Checklist",
//     category: "ai",
//     featured: true,
//     tags: ["ai", "copilot", "rollout", "checklist"],
//     updatedAt: "2025-01-05",
//     timeToComplete: "7 min",
//     usefulness: 10,
//     ctaLabel: "Get checklist",
//     href: "#contact",
//   },
//   {
//     icon: RefreshCw,
//     title: "HubSpot Hygiene Checklist",
//     description: "Keep your CRM clean and your automation running smoothly. Monthly maintenance tasks for data quality.",
//     type: "Checklist",
//     category: "crm",
//     tags: ["crm", "hubspot", "data"],
//     updatedAt: "2024-11-20",
//     timeToComplete: "6 min",
//     usefulness: 7,
//     ctaLabel: "Get checklist",
//     href: "#contact",
//   },
//   {
//     icon: Shield,
//     title: "UK/EU Compliance Basics for AI",
//     description: "Plain-English guide to GDPR, AI Act, and data handling requirements for AI projects. Updated for 2024 regulations.",
//     type: "Guide",
//     category: "compliance",
//     featured: true,
//     tags: ["gdpr", "ai act", "compliance", "guide"],
//     updatedAt: "2024-12-15",
//     timeToComplete: "10 min",
//     usefulness: 9,
//     ctaLabel: "Open guide",
//     href: "#contact",
//   },
//   {
//     icon: Plug,
//     title: "Integration Playbook",
//     description: "Common patterns for Zapier, Make, and custom API integrations. Includes error handling and monitoring best practices.",
//     type: "Playbook",
//     category: "ops",
//     tags: ["integration", "api", "playbook", "ops"],
//     updatedAt: "2024-10-02",
//     timeToComplete: "12 min",
//     usefulness: 8,
//     ctaLabel: "Open playbook",
//     href: "#contact",
//   },
//   {
//     icon: Brain,
//     title: "Knowledge Base AI Guide",
//     description: "How to build an AI assistant that actually knows your business. From data preparation to deployment.",
//     type: "Guide",
//     category: "ai",
//     tags: ["knowledge base", "rag", "ai", "guide"],
//     updatedAt: "2024-12-05",
//     timeToComplete: "9 min",
//     usefulness: 8,
//     ctaLabel: "Open guide",
//     href: "#contact",
//   },
//   {
//     icon: Settings,
//     title: "Workflow Audit Template",
//     description: "Identify automation opportunities in your current processes. Includes scoring matrix for prioritisation.",
//     type: "Template",
//     category: "ops",
//     tags: ["template", "audit", "ops"],
//     updatedAt: "2024-09-18",
//     timeToComplete: "8 min",
//     usefulness: 7,
//     ctaLabel: "Get template",
//     href: "#contact",
//   },
//   {
//     icon: FileText,
//     title: "DPA Quick Reference",
//     description: "Key points to look for in Data Processing Agreements. Checklist for reviewing vendor contracts.",
//     type: "Reference",
//     category: "compliance",
//     tags: ["dpa", "privacy", "compliance"],
//     updatedAt: "2024-11-10",
//     timeToComplete: "4 min",
//     usefulness: 8,
//     ctaLabel: "Open reference",
//     href: "#contact",
//   },
// ];

export default function ResourcesPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  const filteredResources = useMemo(() => {
    const byCategory =
      activeCategory === "all"
        ? resources
        : resources.filter((r) => r.category === activeCategory);
    if (!searchTerm.trim()) return byCategory;
    const query = searchTerm.toLowerCase();
    return byCategory.filter((r) => {
      const haystack = [r.title, r.description, r.type, ...(r.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activeCategory, searchTerm]);

  const sortedResources = useMemo(() => {
    const copy = [...filteredResources];
    if (sortOption === "newest") {
      return copy.sort((a, b) =>
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")
      );
    }
    if (sortOption === "useful") {
      return copy.sort((a, b) => (b.usefulness ?? 0) - (a.usefulness ?? 0));
    }
    return copy.sort(
      (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
    );
  }, [filteredResources, sortOption]);

  const startHere = useMemo(
    () => sortedResources.filter((r) => r.featured).slice(0, 3),
    [sortedResources]
  );
  const startHereTitles = useMemo(
    () => new Set(startHere.map((r) => r.title)),
    [startHere]
  );
  const mainResources = useMemo(
    () => sortedResources.filter((r) => !startHereTitles.has(r.title)),
    [sortedResources, startHereTitles]
  );

  const handleResourceClick = (resourceTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "resource_click", resource: resourceTitle },
      })
    );
  };

  const resourceListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Resources",
      url: `${siteUrl}/resources`,
      itemListOrder: "Unordered",
      itemListElement: resources.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        description: item.description,
        url: `${siteUrl}/resources`,
      })),
    }),
    []
  );

  const formatUpdated = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <SeoHead
        title="Resources — Tools & Guides | Innoviaburst"
        description="Free tools and guides to help you plan your automation journey. ROI calculators, checklists, and compliance guides for UK/EU businesses."
        path="/resources"
        jsonLd={resourceListSchema}
      />

      <SkipLink />
      <Navbar onBookingClick={() => setBookingOpen(true)} />

      <main id="main-content" className="pt-20 min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 lg:py-20 bg-gradient-hero relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />
          
          <div className="container mx-auto px-4 lg:px-6 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring rounded-lg px-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <div className="grid lg:grid-cols-[1fr,420px] gap-10 lg:gap-16 items-start">
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Title + Subtitle */}
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                    <span className="text-gradient-brand">Resources</span> for UK/EU teams
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                    Practical tools to plan, implement, and improve your automation projects. 
                    Most resources are free—no signup required.
                  </p>
                </div>

                {/* What you'll find here - 4 bullets */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    What you'll find
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <BookOpen className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Playbooks</p>
                        <p className="text-xs text-muted-foreground">Step-by-step guides</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <LayoutTemplate className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Templates</p>
                        <p className="text-xs text-muted-foreground">Notion & Sheets</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <ListChecks className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Checklists</p>
                        <p className="text-xs text-muted-foreground">Ops & compliance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/50">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Workflow className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Examples</p>
                        <p className="text-xs text-muted-foreground">Real automations</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured this month */}
                {startHere.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">Featured this month</p>
                    </div>
                    {(() => {
                      const featured = startHere[0];
                      const FeaturedIcon = featured.icon;
                      return (
                        <a
                          href={featured.href}
                          onClick={() => handleResourceClick(featured.title)}
                          className="group flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all"
                        >
                          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors shrink-0">
                            <FeaturedIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {featured.type}
                              </span>
                              {featured.timeToComplete && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {featured.timeToComplete}
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                              {featured.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {featured.description}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </a>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Right Column - Enhanced Newsletter Card */}
              <div className="lg:hidden mt-8">
                {/* Mobile: compact inline version */}
                <ResourcesNewsletterCardMobile />
              </div>
              <div className="hidden lg:block">
                {/* Desktop: full card */}
                <ResourcesNewsletterCard />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border bg-background/95 backdrop-blur lg:sticky lg:top-16 lg:z-10">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1.5 w-full md:max-w-md">
                  <label htmlFor="resources-search" className="text-sm font-medium text-foreground sr-only md:not-sr-only">
                    Search resources
                  </label>
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                    <input
                      id="resources-search"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title, topic, or tag..."
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 justify-between md:justify-end w-full md:w-auto">
                  <div
                    className="text-sm text-muted-foreground"
                    aria-live="polite"
                  >
                    {sortedResources.length} resources found
                  </div>
                  <label className="flex items-center gap-2 text-sm text-foreground">
                    Sort
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border bg-card text-sm min-h-[36px]"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">Newest</option>
                      <option value="useful">Most useful</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 scroll-smooth">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                      activeCategory === cat.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-6">
            {startHere.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-secondary" />
                  <p className="text-sm font-semibold text-secondary">
                    Start here (recommended)
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {startHere.map((resource) => (
                    <div
                      key={resource.title}
                      className="group p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-muted group-hover:bg-accent/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <resource.icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                        </div>
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="px-2 py-1 rounded-full bg-muted font-semibold text-black/70">
                          {resource.type}
                        </span>
                        {resource.updatedAt && (
                          <span>
                            Updated {formatUpdated(resource.updatedAt)}
                          </span>
                        )}
                        {resource.timeToComplete && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {resource.timeToComplete}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        asChild
                        className="min-h-[40px] w-full"
                        onClick={() => handleResourceClick(resource.title)}
                      >
                        <a
                          href={resource.href}
                          aria-label={`${resource.ctaLabel} — ${resource.title}`}
                        >
                          {resource.ctaLabel}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {mainResources.map((resource) => (
                <div
                  key={resource.title}
                  className="group p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:bg-accent/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                      <resource.icon className="w-5 h-5 text-secondary group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.featured && (
                        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="text-xs font-semibold text-black/70 bg-muted px-3 py-1 rounded-full">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    {resource.updatedAt && (
                      <span>Updated {formatUpdated(resource.updatedAt)}</span>
                    )}
                    {resource.timeToComplete && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {resource.timeToComplete}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="min-h-[40px] w-full"
                    onClick={() => handleResourceClick(resource.title)}
                  >
                    <a
                      href={resource.href}
                      aria-label={`${resource.ctaLabel} — ${resource.title}`}
                    >
                      {resource.ctaLabel}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>

            {sortedResources.length === 0 && (
              <div className="p-8 border border-border rounded-2xl bg-card text-center text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">
                  No resources match your filters.
                </p>
                <p className="text-sm">
                  Try clearing search or choosing a different category.
                </p>
              </div>
            )}

            {/* Request custom */}
            <div className="text-center p-8 bg-muted/30 rounded-2xl">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Need something specific?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                We create custom guides and assessments for enterprise clients.
              </p>
              <Button variant="hero" className="" onClick={() => setBookingOpen(true)}>
                Request a custom resource
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        {/* <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to automate?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Let's discuss how automation can save your team time and reduce errors.
            </p>
            <Button variant="hero" size="lg" onClick={() => setBookingOpen(true)}>
              Book a 15-min call
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section> */}
      </main>

      <Footer />
      <CookieConsent />
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}

/**
 * Enhanced Newsletter Card for Resources page
 * Premium design with value prop, benefits list, trust signals
 */
function ResourcesNewsletterCard() {
  const formId = useId();
  const emailId = `${formId}-email`;
  const consentId = `${formId}-consent`;
  const errorId = `${formId}-error`;

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    if (!consent) {
      setError("Please confirm you'd like to receive updates");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Analytics
    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: {
          event: "newsletter_form_submit",
          placement: "resources-hero",
          hasConsent: consent,
        },
      })
    );

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSuccess(true);
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: { event: "newsletter_form_success", placement: "resources-hero" },
        })
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setConsent(false);
    setIsSuccess(false);
    setError(null);
    setTouched(false);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="p-6 rounded-2xl bg-card border border-border shadow-card">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">You're subscribed!</h3>
            <p className="text-sm text-muted-foreground">
              We'll send you new playbooks and templates as they're published.
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-secondary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-2"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-card border border-border shadow-card space-y-5">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Get templates + playbooks monthly</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          New resources delivered to your inbox—practical tools for UK/EU ops teams.
        </p>
      </div>

      {/* What you'll get - 3 benefits */}
      <ul className="space-y-2.5">
        <li className="flex items-start gap-3 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <span className="text-foreground">New playbooks + templates (monthly)</span>
        </li>
        <li className="flex items-start gap-3 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <span className="text-foreground">Automation opportunities for UK/EU ops</span>
        </li>
        <li className="flex items-start gap-3 text-sm">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <span className="text-foreground">Security & privacy notes (plain English)</span>
        </li>
      </ul>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email field with visible label */}
        <div className="space-y-1.5">
          <label htmlFor={emailId} className="block text-sm font-medium text-foreground">
            Work email
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched) setError(validateEmail(e.target.value));
            }}
            onBlur={() => setTouched(true)}
            placeholder="you@company.com"
            disabled={isLoading}
            aria-invalid={!!error && touched}
            aria-describedby={error ? errorId : undefined}
            className={`w-full px-4 py-3 rounded-xl border text-foreground placeholder:text-muted-foreground bg-muted focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent disabled:opacity-50 min-h-[44px] ${
              error && touched ? "border-destructive" : "border-border"
            }`}
          />
        </div>

        {/* Consent checkbox with clickable label */}
        <div className="flex items-start gap-3">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (error && e.target.checked) setError(null);
            }}
            disabled={isLoading}
            className="mt-1 w-4 h-4 rounded border-border bg-muted text-primary focus:ring-2 focus:ring-secondary focus:ring-offset-0 disabled:opacity-50"
          />
          <label htmlFor={consentId} className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            Yes, send me new playbooks & templates. I can{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
              unsubscribe
            </Link>{" "}
            anytime.
          </label>
        </div>

        {/* Error message (text, not color-only) */}
        {error && touched && (
          <div
            id={errorId}
            role="alert"
            className="flex items-start gap-2 text-sm text-destructive"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          variant="hero"
          size="default"
          disabled={isLoading}
          className="w-full min-h-[44px] gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <span>Send me playbooks</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Trust line */}
      <p className="text-xs text-muted-foreground text-center">
        No spam. Unsubscribe anytime.{" "}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

/**
 * Compact Mobile Newsletter Card for Resources page
 * Inline horizontal layout optimised for mobile screens
 */
function ResourcesNewsletterCardMobile() {
  const formId = useId();
  const emailId = `${formId}-email-mobile`;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(null);
    setIsLoading(true);

    window.dispatchEvent(
      new CustomEvent("analytics", {
        detail: { event: "newsletter_form_submit", placement: "resources-hero-mobile" },
      })
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch {
      setError("Try again");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
        <div className="p-2 rounded-full bg-green-100 shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">You're subscribed!</p>
          <p className="text-xs text-muted-foreground">New resources → your inbox.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm font-semibold text-foreground">Get templates monthly</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <div className="flex gap-2">
          <div className="flex-1 min-w-0">
            <label htmlFor={emailId} className="sr-only">Work email</label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="you@company.com"
              disabled={isLoading}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-muted placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary min-h-[44px] ${
                error ? "border-destructive" : "border-border"
              }`}
            />
          </div>
          <Button
            type="submit"
            variant="hero"
            size="default"
            disabled={isLoading}
            className="min-h-[44px] px-4 shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
        
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
        
        <p className="text-xs text-muted-foreground">
          No spam.{" "}
          <Link to="/privacy" className="underline underline-offset-2">Privacy</Link>
        </p>
      </form>
    </div>
  );
}

import { useState, useMemo, useCallback, useEffect } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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

const categories = ["All", "Sales", "Ops", "Support", "Finance", "Knowledge"];

const industries = ["All", "B2B", "B2C", "SaaS", "Services", "Retail"];

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

const sortOptions = [
  { value: "impact", label: "Most ROI" },
  { value: "fastest", label: "Fastest delivery" },
  { value: "popular", label: "Most requested" },
  { value: "newest", label: "Newest" },
];

// const automations = [
//   {
//     title: "Lead-to-Quote Automation",
//     category: "Sales",
//     outcome: "Auto-generate quotes from form submissions",
//     problem: "Sales reps manually copying lead data from forms to CRM and generating quotes in spreadsheets.",
//     steps: ["Form submission captured", "Lead enriched via API", "CRM deal created automatically", "Quote generated from template", "Email sent to lead", "Follow-up task created"],
//     tools: ["HubSpot", "Google Sheets", "Zapier"],
//     kpi: "~4–8 hrs/week saved per rep",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 8,
//     popularityScore: 9,
//     createdAt: "2024-10-05",
//     industry: "B2B",
//   },
//   {
//     title: "Invoice Follow-up Workflow",
//     category: "Finance",
//     outcome: "Automated overdue invoice reminders",
//     problem: "Accounting team manually tracking overdue invoices and sending reminder emails.",
//     steps: ["Invoice status checked daily", "Overdue items identified", "Reminder email sent", "Escalation to account manager", "Slack alert if 30+ days"],
//     tools: ["Xero", "Gmail", "Slack"],
//     kpi: "~5–10 hrs/week saved",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 7,
//     popularityScore: 8,
//     createdAt: "2024-11-12",
//     industry: "Services",
//   },
//   {
//     title: "Support Ticket Triage",
//     category: "Support",
//     outcome: "AI-powered ticket routing and prioritisation",
//     problem: "Support agents spending time reading and routing tickets manually.",
//     steps: ["Ticket received", "AI categorises content", "Priority assigned", "Routed to specialist", "Auto-response sent", "SLA timer started"],
//     tools: ["Zendesk", "OpenAI", "Slack"],
//     kpi: "60% faster first response",
//     deliveryTime: "2–4 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 4,
//     impactScore: 9,
//     popularityScore: 10,
//     createdAt: "2024-12-01",
//     industry: "SaaS",
//   },
//   {
//     title: "Employee Onboarding Flow",
//     category: "Ops",
//     outcome: "Automated new hire setup across all systems",
//     problem: "HR manually creating accounts, sending welcome emails, and assigning training.",
//     steps: ["New hire added to HRIS", "Google/Microsoft account created", "Welcome email sent", "Training assigned in LMS", "Equipment request triggered", "Manager notified"],
//     tools: ["BambooHR", "Google Workspace", "Notion"],
//     kpi: "~6–12 hrs saved per hire",
//     deliveryTime: "3–4 weeks",
//     deliveryWeeksMin: 3,
//     deliveryWeeksMax: 4,
//     impactScore: 8,
//     popularityScore: 7,
//     createdAt: "2024-09-15",
//     industry: "Services",
//   },
//   {
//     title: "Meeting Notes to Tasks",
//     category: "Knowledge",
//     outcome: "Auto-extract action items from meetings",
//     problem: "Action items from meetings lost or manually entered into task management.",
//     steps: ["Meeting recorded", "AI transcribes audio", "Action items extracted", "Tasks created in project tool", "Assigned to attendees", "Summary shared in Slack"],
//     tools: ["Zoom", "OpenAI", "Asana", "Slack"],
//     kpi: "~2–4 hrs/week saved",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 7,
//     popularityScore: 8,
//     createdAt: "2024-12-10",
//     industry: "B2B",
//   },
//   {
//     title: "HubSpot Lead Routing",
//     category: "Sales",
//     outcome: "Instant territory-based lead assignment",
//     problem: "Leads sitting unassigned or routed to wrong sales reps based on territory.",
//     steps: ["New lead enters HubSpot", "Territory/segment identified", "Owner assigned via rules", "Task created for follow-up", "Slack notification sent", "SLA tracking started"],
//     tools: ["HubSpot", "Slack"],
//     kpi: "90% faster lead assignment",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 9,
//     popularityScore: 9,
//     createdAt: "2024-11-28",
//     industry: "B2B",
//   },
//   {
//     title: "Expense Report Workflow",
//     category: "Finance",
//     outcome: "Receipt upload to reimbursement in one flow",
//     problem: "Employees submitting expenses via email, finance manually entering and approving.",
//     steps: ["Receipt uploaded via form", "Data extracted via AI", "Expense record created", "Manager approval requested", "Finance notified on approval", "Reimbursement triggered"],
//     tools: ["Google Forms", "Xero", "Slack"],
//     kpi: "~8–15 hrs/week saved",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 8,
//     popularityScore: 7,
//     createdAt: "2024-10-25",
//     industry: "Services",
//   },
//   {
//     title: "Customer Feedback Loop",
//     category: "Support",
//     outcome: "Centralised feedback with sentiment analysis",
//     problem: "Customer feedback scattered across surveys, reviews, and support tickets.",
//     steps: ["Feedback collected from sources", "Sentiment analysed", "Categorised by theme", "Dashboard updated", "Product team alerted", "Response triggered if negative"],
//     tools: ["Typeform", "OpenAI", "Notion", "Slack"],
//     kpi: "100% feedback captured",
//     deliveryTime: "2–4 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 4,
//     impactScore: 7,
//     popularityScore: 6,
//     createdAt: "2024-11-05",
//     industry: "B2B",
//   },
//   {
//     title: "Contract Renewal Alerts",
//     category: "Ops",
//     outcome: "Never miss a renewal deadline",
//     problem: "Contracts expiring without timely renewal discussions.",
//     steps: ["Contract dates tracked", "90-day alert triggered", "Account manager notified", "Customer check-in scheduled", "Renewal proposal generated", "Follow-up sequence started"],
//     tools: ["HubSpot", "Google Calendar", "Gmail"],
//     kpi: "25% fewer missed renewals",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 8,
//     popularityScore: 8,
//     createdAt: "2024-08-30",
//     industry: "SaaS",
//   },
//   {
//     title: "Knowledge Base Auto-Update",
//     category: "Knowledge",
//     outcome: "Keep docs current as products evolve",
//     problem: "Documentation becoming outdated as products evolve.",
//     steps: ["Product changes detected", "Relevant docs identified", "Update suggestions generated", "Assigned for review", "Published after approval", "Team notified of changes"],
//     tools: ["Notion", "GitHub", "Slack"],
//     kpi: "~4–6 hrs/week saved",
//     deliveryTime: "3–4 weeks",
//     deliveryWeeksMin: 3,
//     deliveryWeeksMax: 4,
//     impactScore: 6,
//     popularityScore: 5,
//     createdAt: "2024-07-12",
//     industry: "B2B",
//   },
//   {
//     title: "Sales Commission Calculator",
//     category: "Finance",
//     outcome: "Automated commission calculations from CRM",
//     problem: "Finance manually calculating variable commissions from CRM data.",
//     steps: ["Closed deals pulled from CRM", "Commission rules applied", "Calculations verified", "Report generated", "Manager approval obtained", "Payroll notified"],
//     tools: ["HubSpot", "Google Sheets", "Slack"],
//     kpi: "~10–20 hrs/month saved",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 7,
//     popularityScore: 6,
//     createdAt: "2024-10-02",
//     industry: "B2B",
//   },
//   {
//     title: "Inventory Reorder Alerts",
//     category: "Ops",
//     outcome: "Proactive stock replenishment",
//     problem: "Stock running low without timely reorders.",
//     steps: ["Inventory levels monitored", "Threshold breach detected", "Reorder alert sent", "Purchase order drafted", "Supplier notified", "Receipt logged on delivery"],
//     tools: ["Airtable", "Gmail", "Slack"],
//     kpi: "Zero stockouts in 6 months",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 8,
//     popularityScore: 5,
//     createdAt: "2024-09-02",
//     industry: "Retail",
//   },
//   {
//     title: "Social Media Monitoring",
//     category: "Support",
//     outcome: "Track and respond to brand mentions",
//     problem: "Brand mentions going unnoticed across social platforms.",
//     steps: ["Mentions tracked across platforms", "Sentiment analysed", "Priority assigned", "Routed to appropriate team", "Response drafted", "Escalation if urgent"],
//     tools: ["Mention", "OpenAI", "Slack"],
//     kpi: "95% mentions addressed",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 6,
//     popularityScore: 5,
//     createdAt: "2024-10-18",
//     industry: "B2C",
//   },
//   {
//     title: "Document Request Workflow",
//     category: "Knowledge",
//     outcome: "Self-serve document delivery",
//     problem: "Clients requesting documents that require manual retrieval and sending.",
//     steps: ["Request received via form", "Document located in storage", "Access verified", "Secure link generated", "Email sent to client", "Download tracked"],
//     tools: ["Google Drive", "Gmail", "Zapier"],
//     kpi: "~3–5 hrs/week saved",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 5,
//     popularityScore: 4,
//     createdAt: "2024-07-28",
//     industry: "Services",
//   },
//   {
//     title: "Webinar Follow-up Sequence",
//     category: "Sales",
//     outcome: "Personalised post-webinar nurture",
//     problem: "Webinar attendees not receiving timely, personalised follow-up.",
//     steps: ["Attendance data synced", "Attendees segmented", "Personalised email sent", "Demo link included for engaged", "Sales notified of hot leads", "CRM updated with engagement"],
//     tools: ["Zoom", "HubSpot", "Gmail"],
//     kpi: "35% higher demo bookings",
//     deliveryTime: "1–2 weeks",
//     deliveryWeeksMin: 1,
//     deliveryWeeksMax: 2,
//     impactScore: 8,
//     popularityScore: 7,
//     createdAt: "2024-11-01",
//     industry: "B2B",
//   },
//   {
//     title: "Project Status Reporting",
//     category: "Ops",
//     outcome: "Auto-generated weekly status reports",
//     problem: "Managers manually compiling project status updates from multiple tools.",
//     steps: ["Task data pulled from PM tool", "Status aggregated", "Report generated", "Charts created", "Stakeholders notified", "Archive stored for reference"],
//     tools: ["Asana", "Google Sheets", "Slack"],
//     kpi: "~4–8 hrs/week saved",
//     deliveryTime: "2–3 weeks",
//     deliveryWeeksMin: 2,
//     deliveryWeeksMax: 3,
//     impactScore: 6,
//     popularityScore: 6,
//     createdAt: "2024-09-22",
//     industry: "SaaS",
//   },
// ];

const automations = [
  {
    title: "Lead-to-Meeting in 60 Seconds",
    category: "Sales",
    outcome: "Route leads instantly + book meetings faster",
    problem:
      "Leads sit unassigned, follow-ups are slow, and hot prospects drop before a rep responds.",
    steps: [
      "Lead captured (website form / Typeform)",
      "Enrich lead (company + role + region) via API",
      "Create/update contact + deal in CRM (HubSpot)",
      "Assign owner by rules (territory/segment/round-robin)",
      "Send Slack alert to owner with lead summary",
      "Send booking link + smart follow-up email",
      "Start SLA timer + create follow-up task",
    ],
    tools: ["HubSpot", "Slack", "Calendly", "Webhook"],
    kpi: "EXAMPLE: response time reduced from hours to minutes",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 10,
    createdAt: "2025-01-05",
    industry: "B2B / SaaS",
  },

  {
    title: "AI Support Triage + Draft Reply",
    category: "Support",
    outcome: "Auto-prioritise tickets + draft responses with AI",
    problem:
      "Support teams waste time reading, routing, and replying to repetitive tickets while SLAs slip.",
    steps: [
      "New ticket/email received",
      "AI classifies topic + urgency + sentiment",
      "Route to correct queue/owner",
      "Generate draft reply + knowledge suggestions",
      "Post summary in Slack + request approval for high-risk cases",
      "Start SLA tracking + escalate if overdue",
    ],
    tools: ["Zendesk (or Gmail)", "Slack", "OpenAI", "Notion (KB)"],
    kpi: "EXAMPLE: 30–60% faster first response",
    deliveryTime: "2–4 weeks",
    deliveryWeeksMin: 2,
    deliveryWeeksMax: 4,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-06",
    industry: "SaaS / Services",
  },

  {
    title: "Stripe Payment Failed → Smart Dunning + CRM Update",
    category: "Finance",
    outcome: "Recover revenue automatically when payments fail",
    problem:
      "Failed payments cause churn and revenue leakage; teams follow up manually and inconsistently.",
    steps: [
      "Stripe event received (payment failed / requires action)",
      "Check customer + invoice context",
      "Update CRM deal/subscription status",
      "Send dunning email sequence (step 1/2/3)",
      "Escalate to Slack + assign task if not resolved",
      "Retry logic + stop sequence on success",
      "Weekly recovery report generated",
    ],
    tools: ["Stripe", "HubSpot", "Gmail", "Slack", "Google Sheets"],
    kpi: "EXAMPLE: reduce failed-payment churn and save hours of manual chasing",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-07",
    industry: "SaaS / E-commerce",
    // Stripe demo uses test mode + test cards. :contentReference[oaicite:2]{index=2}
  },

  {
    title: "Shopify Order → Fulfillment + Ops Dashboard",
    category: "Ops",
    outcome: "Automate fulfillment steps and keep ops visible",
    problem:
      "Orders require manual coordination across fulfillment, notifications, and internal tracking.",
    steps: [
      "New order created in Shopify",
      "Validate address + flags (fraud/high value/backorder)",
      "Notify ops/warehouse in Slack with packing notes",
      "Create fulfillment task + update status tracking table",
      "Send customer notification (shipping/processing)",
      "Update dashboard + exceptions list",
      "Escalate if fulfillment SLA breached",
    ],
    tools: ["Shopify", "Slack", "Google Sheets (or Airtable)", "Gmail"],
    kpi: "EXAMPLE: fewer fulfillment mistakes + faster internal coordination",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-08",
    industry: "Retail / E-commerce",
    // Demo can use Shopify test orders / Bogus Gateway. :contentReference[oaicite:3]{index=3}
  },

  {
    title: "Invoice & Reminder Automation + Weekly Finance Report",
    category: "Finance",
    outcome: "Automate reminders + give founders weekly cash visibility",
    problem:
      "Invoices go unpaid because reminders and status tracking are manual and inconsistent.",
    steps: [
      "Daily scan of unpaid invoices",
      "Segment by age (7/14/30+ days)",
      "Send reminder email with payment link",
      "Escalate to Slack/account owner at 30+ days",
      "Update CRM status + next action date",
      "Generate weekly finance summary report",
    ],
    tools: ["Stripe (or Xero)", "Gmail", "Slack", "Google Sheets"],
    kpi: "EXAMPLE: save 3–8 hrs/week and reduce overdue invoices",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-09",
    industry: "Services / B2B",
  },

  {
    title: "Recruitment Pipeline Automation",
    category: "Ops",
    outcome: "From candidate form → scheduling → team updates",
    problem:
      "Hiring coordination is slow: CVs scattered, scheduling takes forever, and updates get missed.",
    steps: [
      "Candidate submitted via form",
      "Create candidate record (Notion/ATS sheet)",
      "Auto-email candidate with next steps",
      "Schedule interview (Calendly) + create calendar event",
      "Notify hiring channel in Slack",
      "Generate interview kit + scoring template",
      "Track status changes + reminders",
    ],
    tools: [
      "Typeform (or Webform)",
      "Notion",
      "Calendly",
      "Google Calendar",
      "Slack",
      "Gmail",
    ],
    kpi: "EXAMPLE: cut scheduling time and keep pipeline consistent",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 7,
    popularityScore: 7,
    createdAt: "2025-01-10",
    industry: "Startups / SMEs",
  },

  {
    title: "Sales Handoff → Onboarding Checklist Automation",
    category: "Ops",
    outcome: "Prevent churn by making handoffs deterministic",
    problem:
      "After a deal closes, onboarding steps are missed, causing delays and early churn risk.",
    steps: [
      "Deal marked Closed Won in CRM",
      "Create onboarding project/checklist",
      "Assign tasks to owner + team",
      "Send welcome email + kickoff scheduling link",
      "Post kickoff brief in Slack",
      "Start onboarding SLA + escalate blockers",
      "Weekly onboarding status digest",
    ],
    tools: ["HubSpot", "Notion (or Asana)", "Slack", "Gmail", "Calendly"],
    kpi: "EXAMPLE: fewer onboarding misses + faster time-to-value",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 8,
    popularityScore: 8,
    createdAt: "2025-01-11",
    industry: "B2B / SaaS",
  },

  {
    title: "Website Demo Requests → Qualification → Routing",
    category: "Sales",
    outcome: "Qualify requests instantly and route to the right person",
    problem:
      "Demo requests arrive with low context; teams waste time on unqualified calls or slow response.",
    steps: [
      "Demo request submitted",
      "Auto-enrich + score lead (industry/size/intent)",
      "Route to correct rep/queue",
      "Send confirmation email + booking link",
      "Create deal + add notes + next steps",
      "Notify Slack with score + suggested agenda",
      "No-show follow-up automation",
    ],
    tools: ["HubSpot", "Slack", "Calendly", "Gmail", "Webhook"],
    kpi: "EXAMPLE: increase qualified calls and reduce no-shows",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 9,
    popularityScore: 9,
    createdAt: "2025-01-12",
    industry: "B2B / Agencies",
  },

  {
    title: "Weekly Exec Ops Digest (KPIs + Blockers) to Slack/Email",
    category: "Ops",
    outcome: "Leadership visibility without manual reporting",
    problem:
      "Managers spend hours compiling updates; leadership lacks a single weekly view of ops health.",
    steps: [
      "Pull KPIs from sources (CRM/Support/Finance/PM tool)",
      "Aggregate weekly deltas + top issues",
      "Highlight blockers + overdue items",
      "Send digest to Slack + email",
      "Create follow-up tasks for top blockers",
      "Archive report for audit trail",
    ],
    tools: [
      "Google Sheets",
      "Slack",
      "Gmail",
      "HubSpot (optional)",
      "Asana/Jira (optional)",
    ],
    kpi: "EXAMPLE: save 2–6 hrs/week of reporting time",
    deliveryTime: "1–2 weeks",
    deliveryWeeksMin: 1,
    deliveryWeeksMax: 2,
    impactScore: 7,
    popularityScore: 7,
    createdAt: "2025-01-13",
    industry: "Startups / SMEs",
  },

  {
    title: "AI Knowledge Base Builder (Tickets/Docs → FAQ Suggestions)",
    category: "Knowledge",
    outcome: "Keep docs fresh and reduce repetitive support load",
    problem:
      "Knowledge is scattered and outdated; support answers repeat; onboarding is slow.",
    steps: [
      "Ingest tickets + internal docs on a schedule",
      "Cluster topics + detect new recurring questions",
      "Generate FAQ/article suggestions",
      "Create draft pages + assign reviewers",
      "Publish after approval",
      "Notify team + track usage/feedback",
    ],
    tools: ["Notion", "Zendesk (or Gmail)", "OpenAI", "Slack"],
    kpi: "EXAMPLE: reduce repetitive tickets and speed onboarding",
    deliveryTime: "2–4 weeks",
    deliveryWeeksMin: 2,
    deliveryWeeksMax: 4,
    impactScore: 8,
    popularityScore: 7,
    createdAt: "2025-01-14",
    industry: "SaaS / Services",
  },
];

export default function AutomationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewAutomation, setQuickViewAutomation] = useState<
    (typeof automations)[0] | null
  >(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

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
    if (selectedCategory !== "All") {
      results = results.filter((a) => a.category === selectedCategory);
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
    if (selectedIndustry !== "All") {
      results = results.filter((a) => (a.industry ?? "") === selectedIndustry);
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

  const handleQuickView = (automation: (typeof automations)[0]) => {
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
    setSelectedCategory("All");
    setSelectedDelivery("");
    setSelectedIndustry("All");
    setSearchQuery("");
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      selectedCategory !== "All" ||
      selectedTools.length > 0 ||
      Boolean(selectedDelivery) ||
      selectedIndustry !== "All" ||
      Boolean(searchQuery.trim()),
    [
      selectedCategory,
      selectedTools,
      selectedDelivery,
      selectedIndustry,
      searchQuery,
    ]
  );

  return (
    <>
      <SkipLink />
      <Helmet>
        <title>Automation Library | Innoviaburst</title>
        <meta
          name="description"
          content="Browse 16+ example automations for Sales, Ops, Support, Finance and Knowledge teams. See workflows, tools, delivery times and KPI impacts."
        />
      </Helmet>

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
              Back to home
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Automation <span className="text-gradient-brand">Library</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Example workflows we build for UK/EU businesses. Each shows
              delivery time, tools, and expected impact.
            </p>
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
                  placeholder="Search automations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]"
                  aria-label="Search automations"
                />
              </div>
              <div className="mt-3 md:mt-0 flex items-center gap-2">
                <label
                  className="text-sm text-foreground"
                  htmlFor="sort-select"
                >
                  Sort
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-muted text-sm min-h-[40px]"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category chips + filter toggle */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide scroll-smooth snap-x snap-mandatory -mx-1 px-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] snap-start focus:outline-none focus:ring-2 focus:ring-ring ${
                      selectedCategory === cat
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-pressed={selectedCategory === cat}
                    aria-current={selectedCategory === cat ? "true" : undefined}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <Drawer open={showFilters} onOpenChange={setShowFilters}>
                <DrawerTrigger asChild>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium min-h-[40px] transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-ring ${
                      hasActiveFilters
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    aria-expanded={showFilters}
                    aria-controls="filters-panel"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </DrawerTrigger>
                <DrawerContent
                  id="filters-panel"
                  className="max-h-[80vh] overflow-y-auto"
                >
                  <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-6 pb-6 space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Tools
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tools.map((tool) => (
                          <button
                            key={tool}
                            onClick={() => toggleTool(tool)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[36px] focus:outline-none focus:ring-2 focus:ring-ring ${
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
                        Delivery time
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["1-2", "2-3", "3-4", "4-999"].map((range) => {
                          const label =
                            range === "4-999"
                              ? "4+ weeks"
                              : `${range.replace("-", "–")} weeks`;
                          return (
                            <button
                              key={range}
                              onClick={() =>
                                setSelectedDelivery(
                                  selectedDelivery === range ? "" : range
                                )
                              }
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[36px] focus:outline-none focus:ring-2 focus:ring-ring ${
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
                        Industry
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {industries.map((ind) => (
                          <button
                            key={ind}
                            onClick={() => setSelectedIndustry(ind)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[36px] focus:outline-none focus:ring-2 focus:ring-ring ${
                              selectedIndustry === ind
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                            aria-pressed={selectedIndustry === ind}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setShowFilters(false)}
                        className="min-h-[40px]"
                      >
                        Close
                      </Button>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          onClick={clearAll}
                          className="min-h-[40px] text-accent"
                        >
                          Clear filters
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
                  selectedCategory !== "All" && `Category: ${selectedCategory}`,
                  selectedIndustry !== "All" && `Industry: ${selectedIndustry}`,
                  selectedDelivery &&
                    `Delivery: ${
                      selectedDelivery === "4-999"
                        ? "4+ weeks"
                        : selectedDelivery.replace("-", "–") + " weeks"
                    }`,
                  ...selectedTools.map((t) => `Tool: ${t}`),
                  searchQuery && `Search: ${searchQuery}`,
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
                  className="text-sm text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 min-h-[32px]"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Results count */}
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? (
              <Skeleton className="h-4 w-32 inline-block" />
            ) : (
              <>
                {filteredAndSorted.length} automation
                {filteredAndSorted.length !== 1 ? "s" : ""} found
              </>
            )}
          </p>
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
                  No automations match your filters.
                </p>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="min-h-[44px]"
                >
                  Clear filters
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
        <section className="py-12 lg:py-16 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-2xl mx-auto">
              <NewsletterForm
                placement="library"
                headline="Get new automations in your inbox"
                description="We publish new workflow templates monthly. Subscribe to get notified—plus early access to pilot programmes."
                buttonText="Subscribe"
                shortConsent
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Don't see your workflow?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We build custom automations tailored to your exact tools and
              processes.
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => setRequestOpen(true)}
              className="min-h-[48px]"
            >
              Request a custom build
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

// function AutomationCard({
//   automation,
//   onRequest,
//   onQuickView,
// }: {
//   automation: (typeof automations)[0];
//   onRequest: () => void;
//   onQuickView: () => void;
// }) {
//   const [stepsOpen, setStepsOpen] = useState(false);

//   const handleCardClick = () => onQuickView();

//   const stop = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };

//   const { primaryTools, extraToolsCount } = useMemo(() => {
//     const list = automation.tools ?? [];
//     return {
//       primaryTools: list.slice(0, 3),
//       extraToolsCount: Math.max(0, list.length - 3),
//     };
//   }, [automation.tools]);

//   return (
//     <article
//       className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all
//                  hover:-translate-y-0.5 hover:shadow-card-hover hover:border-border/70
//                  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
//       onClick={handleCardClick}
//       role="button"
//       tabIndex={0}
//       aria-label={`Open quick view for ${automation.title}`}
//       onKeyDown={(e) => {
//         if (e.key === "Enter" || e.key === " ") {
//           e.preventDefault();
//           handleCardClick();
//         }
//       }}
//     >
//       {/* subtle top highlight */}
//       <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

//       <div className="p-5 sm:p-6">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
//               {automation.category}
//             </span>

//             {automation.industry && (
//               <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
//                 {automation.industry}
//               </span>
//             )}
//           </div>

//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1">
//               <Clock className="h-3 w-3" />
//               {automation.deliveryTime}
//             </span>
//           </div>
//         </div>

//         {/* Title + Outcome */}
//         <div className="mt-4">
//           <h3 className="text-[15px] sm:text-base font-bold leading-snug text-foreground">
//             {automation.title}
//           </h3>
//           <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
//             {automation.outcome}
//           </p>
//         </div>

//         {/* Tools */}
//         <div className="mt-3 flex flex-wrap gap-1.5">
//           {primaryTools.map((tool) => (
//             <span
//               key={tool}
//               className="inline-flex items-center rounded-full bg-muted/70 px-2.5 py-1 text-[11px] text-muted-foreground"
//             >
//               {tool}
//             </span>
//           ))}
//           {extraToolsCount > 0 && (
//             <span className="inline-flex items-center rounded-full bg-muted/70 px-2.5 py-1 text-[11px] text-muted-foreground">
//               +{extraToolsCount} tools
//             </span>
//           )}
//         </div>

//         {/* Secondary actions (lighter, less height) */}
//         <div className="mt-3 flex flex-wrap items-center gap-3">
//           <button
//             onClick={onQuickView}
//             onMouseDown={stop}
//             className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs text-secondary
//                        hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//             style={{ minHeight: 32 }}
//           >
//             <Eye className="h-3.5 w-3.5" />
//             Quick view
//           </button>

//           {/* <Collapsible open={stepsOpen} onOpenChange={setStepsOpen}>
//             <CollapsibleTrigger asChild>
//               <button
//                 onMouseDown={stop}
//                 className="inline-flex items-center gap-1.5 rounded-md px-1 py-1 text-xs text-accent
//                            hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                 aria-expanded={stepsOpen}
//                 style={{ minHeight: 32 }}
//               >
//                 {stepsOpen ? (
//                   <>
//                     <ChevronUp className="h-3.5 w-3.5" />
//                     Hide steps
//                   </>
//                 ) : (
//                   <>
//                     <ChevronDown className="h-3.5 w-3.5" />
//                     View {automation.steps.length} steps
//                   </>
//                 )}
//               </button>
//             </CollapsibleTrigger>

//             <CollapsibleContent className="pt-2">
//               <ul className="space-y-1.5">
//                 {automation.steps.map((step, i) => (
//                   <li
//                     key={i}
//                     className="flex items-start gap-2 text-xs text-muted-foreground"
//                   >
//                     <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-[10px] font-bold text-secondary">
//                       {i + 1}
//                     </span>
//                     <span className="leading-relaxed">{step}</span>
//                   </li>
//                 ))}
//               </ul>
//             </CollapsibleContent>
//           </Collapsible> */}
//         </div>

//         {/* Impact strip (reads like a highlight, not extra content) */}
//         <div className="mt-4 rounded-xl border border-accent/15 bg-accent/8 px-3 py-2">
//           <div className="flex items-start gap-2">
//             <Zap className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
//             <div className="min-w-0">
//               <div className="text-[11px] font-semibold tracking-wide text-accent/90">
//                 EXAMPLE IMPACT
//               </div>
//               <div className="text-sm font-semibold text-foreground line-clamp-1">
//                 {automation.kpi}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Primary CTA */}
//         <div className="mt-4">
//           <Button
//             variant="hero"
//             size="default"
//             className="w-full min-h-[44px]"
//             onClick={(e) => {
//               e.stopPropagation();
//               onRequest();
//             }}
//           >
//             Request this build
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </article>
//   );
// }

function AutomationCard({
  automation,
  onRequest,
  onQuickView,
}: {
  automation: (typeof automations)[0];
  onRequest: () => void;
  onQuickView: () => void;
}) {
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
            <span className="inline-flex items-center rounded-full bg-accent/15 text-accent px-3 py-1 text-xs font-semibold">
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
              Quick view
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
              <div className="text-[11px] font-semibold tracking-wide text-accent/90">
                EXAMPLE IMPACT
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
          Request this build
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

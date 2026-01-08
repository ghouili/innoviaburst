# Lovable Input Spec — InnoviaBurst Admin Dashboard

**Generated:** 2026-01-07  
**Purpose:** Complete design + UX spec extracted from the InnoviaBurst public site to build a matching Admin Dashboard UI using [Lovable.dev](https://lovable.dev)

---

## 📄 What's in `lovable-input.json`?

A single JSON object containing **everything** needed to generate a brand-consistent admin dashboard:

### 1. **Design Tokens** (Source of Truth)
- **Colors**: Extracted from [tailwind.config.ts](../tailwind.config.ts) + [src/index.css](../src/index.css)
  - Brand palette: Orange primary (24 95% 53%), Cyan accent (192 85% 50%), Deep Blue secondary (210 70% 45%)
  - Light + dark mode HSL values
  - Semantic color usage (success, warning, error)
- **Typography**: Inter font family, heading scale, weights
- **Radius**: Base 1rem, derived sm/md/lg/xl/2xl
- **Shadows**: sm/md/lg + brand-specific glow/orange shadows for CTAs
- **Spacing**: Container padding (1.5rem), section padding (py-12 md:py-16 lg:py-20), card padding (p-6)
- **Motion**: Durations (200/300/500ms), hover effects (lift, glow, opacity), reduced-motion support
- **Gradients**: hero, card, CTA, blue, glow

### 2. **UI Patterns** (Reusable Components)
Documented from `src/components/ui/*` (shadcn/ui components):

- **Layout**: Navbar (fixed header with scroll behavior), Footer, section wrappers
- **Cards**: Base card structure, variants (elevated, interactive, featured), stats cards, feature cards
- **Buttons**: 8 variants (default, hero, hero-outline, cta, secondary, outline, ghost, link) + 5 sizes (all ≥44px touch targets)
- **Forms**: Input, Label, Form wrapper (react-hook-form + zod), field structure, error handling
- **Tables**: Responsive table with hover states, border-bottom rows
- **Dialogs**: Radix Dialog with overlay, focus trap, ESC key support
- **Badges**: Status indicators, tags (4 variants)
- **Tabs**: Radix Tabs for category filters
- **Accordions**: FAQ sections, expandable details
- **Skeleton Loaders**: Loading states (animate-pulse bg-muted)
- **Empty States**: Icon + heading + description + CTAs
- **Toasts**: Sonner for notifications
- **Collapsible/Drawer**: Mobile-friendly expandable sections

### 3. **Site Map** (Routes + Purpose)
Extracted from [src/App.tsx](../src/App.tsx):

**Public routes:**
- `/` — Homepage (Hero, Offers, Solutions, Industries, Resources, Trust, Work, Contact)
- `/automations` — Library of automation templates (search/filter, sort, quick view)
- `/resources` — Downloadable resources (guides, checklists, templates, calculators)
- `/trust` — Trust & Compliance page (DPA, GDPR, security)
- `/:slug` — Dynamic offer pages (ai-ops-sprint, automation-build, mvp-launch)
- `/work` — Case studies (coming soon)
- `/privacy`, `/cookies`, `/terms`, `/subprocessors` — Legal pages

**Recommended admin routes:**
- `/admin/dashboard` — Overview KPIs
- `/admin/automations` — Manage automation library (CRUD)
- `/admin/resources` — Manage resources (CRUD)
- `/admin/offers` — Manage offers (CRUD)
- `/admin/leads` — Booking/request submissions (table + pipeline)
- `/admin/content` — Edit page content
- `/admin/analytics` — Site metrics
- `/admin/settings` — Config, integrations

### 4. **Content Models** (Data Schemas)
Inferred from hardcoded data in pages:

#### **Resources** ([ResourcesPage.tsx](../src/pages/ResourcesPage.tsx))
```typescript
{
  key: string,               // e.g., "roiCalculator"
  icon: LucideIcon,          // Calculator, CheckSquare, Brain, etc.
  type: ResourceType,        // Guide | Checklist | Template | Calculator | Playbook | Reference
  category: CategoryKey,     // roi | ai | crm | ops | compliance
  tags: string[],            // For search/filter
  featured: boolean,         // Show in featured section
  updatedAt: string,         // ISO date
  timeToComplete: string,    // "15 min", "1 hour"
  usefulness: number,        // 1-10 rating
  href: string,              // Download link or "#contact" (gated)
  // + i18n keys for title, description, benefits
  // + Admin fields: status, downloadUrl, thumbnailUrl, createdBy, viewCount, downloadCount
}
```

#### **Automations** ([AutomationsPage.tsx](../src/pages/AutomationsPage.tsx))
```typescript
{
  key: string,               // e.g., "leadToMeeting"
  category: string,          // Sales | Ops | Support | Finance | Knowledge
  tools: string[],           // ["HubSpot", "Slack", "Calendly"]
  deliveryTime: string,      // "1-2 weeks"
  deliveryWeeksMin: number,  // 1
  deliveryWeeksMax: number,  // 2
  impactScore: number,       // 1-10
  popularityScore: number,   // 1-10
  createdAt: string,         // ISO date
  industry: string,          // "B2B / SaaS"
  // + i18n keys for title, outcome, problem, steps, kpi
  // + Admin fields: status, thumbnailUrl, detailsUrl, estimatedHoursSaved, requestCount
}
```

#### **Offers** ([OfferPage.tsx](../src/pages/OfferPage.tsx))
```typescript
{
  slug: string,                          // "ai-ops-sprint"
  title: string,                         // "AI Ops Sprint"
  timeline: string,                      // "10 business days"
  bestFor: string,                       // Target audience
  price: string,                         // "From £3k"
  heroDescription: string,               // 1-2 sentence pitch
  deliverables: string[],                // Bullet list
  exclusions: string[],                  // What's NOT included
  successMetrics: Array<{metric, example}>,
  weekByWeek: Array<{week, activities}>, // Timeline breakdown
  clientInputs: string[],                // What client provides
  faq: Array<{q, a}>                     // FAQ accordion
  // + Admin fields: status, featured, orderIndex, iconName, viewCount, conversionRate
}
```

#### **Leads** (BookingModal.tsx, RequestModal.tsx)
```typescript
{
  id: string (UUID),
  type: "booking" | "request" | "newsletter",
  name: string,
  email: string,
  company: string,
  role: string,
  goal: string,              // What they want to achieve
  primaryGoal: string,       // For requests: reduceOps | leadHandling | reporting | aiAssistant | mvp | custom
  tools: string[],           // For requests: selected tools
  timeline: string,          // For requests: urgent | soon | planning | exploring | none
  notes: string,             // Additional details
  interestedIn: string,      // Topic from query param
  createdAt: timestamp,
  source: string,            // Page URL
  status: "new" | "contacted" | "qualified" | "converted" | "closed",
  assignedTo: string,        // User ID
  adminNotes: string
}
```

### 5. **Brand Voice** (Copy Guidelines)
Extracted from [i18n/en.json](../src/i18n/en.json) + observed patterns:

- **Tone**: Short, bold, premium, no-nonsense, conversion-first
- **Characteristics**: Direct, business-professional, outcome-focused, plain English/French, scannable
- **Sample CTAs**: "Request an automation plan", "Book a 15-min call", "Get a scope in 48h"
- **Copy Patterns**:
  - Headlines: Action verb + outcome + timeframe
  - Subheadlines: 1-2 sentences max (who + what + how)
  - Bullets: Start with outcome/benefit, not feature
- **Do/Don't**:
  - ✅ Use concrete numbers, lead with outcomes, active voice, short sentences
  - ❌ Buzzwords without context, vague promises, passive voice, walls of text

---

## 🔍 Where Did We Extract This From?

| **Category**         | **Source Files**                                                                                     |
|----------------------|------------------------------------------------------------------------------------------------------|
| Design tokens        | `tailwind.config.ts`, `src/index.css` (CSS variables), `components.json` (shadcn config)            |
| Component patterns   | `src/components/ui/*` (button, card, dialog, table, badge, tabs, accordion, skeleton, empty-state)  |
| Layout patterns      | `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`                              |
| Routes               | `src/App.tsx` (React Router v6 config)                                                               |
| Content models       | `src/pages/AutomationsPage.tsx`, `src/pages/ResourcesPage.tsx`, `src/pages/OfferPage.tsx`          |
| Forms                | `src/components/BookingModal.tsx`, `src/components/RequestModal.tsx`, `src/components/NewsletterForm.tsx` |
| Brand voice          | `src/i18n/en.json` (CTA labels, field labels, error messages, copy patterns)                        |
| A11y patterns        | `src/components/SkipLink.tsx`, focus traps in Navbar/Dialog, 44px touch targets in buttons          |
| Tech stack           | `package.json` (dependencies + versions)                                                             |

---

## 🚀 How to Use This with Lovable

### Option 1: Upload to Lovable Chat
1. Go to [Lovable.dev](https://lovable.dev)
2. Start a new project
3. Upload `lovable-input.json` to the chat
4. Prompt:
   ```
   I've uploaded a design spec for InnoviaBurst admin dashboard. 
   Please build:
   1. Authentication (login page with [Auth0/Clerk/Supabase])
   2. Dashboard overview (KPIs: leads, automations, resources)
   3. Leads table with filters and status pipeline
   4. CRUD for automations (table + create/edit forms)
   
   Use the design tokens, component patterns, and content models from the JSON.
   Tech stack: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Query.
   ```

### Option 2: Copy Sections as Needed
If you're building manually:
- Copy `designTokens` → Paste into your `tailwind.config.ts` + `index.css`
- Copy `uiPatterns` → Reference when creating components (use shadcn CLI to add same components)
- Copy `contentModels` → Use as Prisma schema or database table definitions
- Copy `brandVoice.copyPatterns` → Reference when writing admin UI copy

---

## 📋 What's Missing? (Not Yet Implemented)

These were **not extracted** (because they don't exist yet in the public site):

| **Missing**              | **How to Handle**                                                                 |
|--------------------------|-----------------------------------------------------------------------------------|
| Backend API endpoints    | Design REST/GraphQL API based on `contentModels` schemas                         |
| Authentication flow      | Use Auth0, Clerk, or Supabase Auth. Design login/logout + role-based access.     |
| Database schema          | Convert `contentModels` to Prisma schema or SQL tables                            |
| File upload/storage      | Use S3-compatible storage (Supabase Storage, Cloudflare R2, AWS S3)              |
| Analytics integration    | Integrate Google Analytics 4 or Plausible. Track page views, form submissions.   |
| Email notifications      | Use SendGrid, Mailgun, or Resend for lead notification emails to admin           |

**See `notes.missingInfo[]` in the JSON for details.**

---

## ✅ Validation Checklist

Before building the admin dashboard, confirm:

- [ ] Design tokens match public site (test by comparing colors, fonts, shadows)
- [ ] Component patterns are consistent (reuse shadcn/ui components with same config)
- [ ] Content models cover all CRUD needs (automations, resources, offers, leads)
- [ ] Brand voice guidelines are followed in admin UI copy
- [ ] Accessibility requirements are met (44px targets, focus visible, keyboard nav, ARIA labels)
- [ ] Authentication is robust (role-based access, audit logs)
- [ ] Input validation uses zod schemas (same as public site forms)

---

## 🛠️ Tech Stack Reference

| **Category**      | **Library/Tool**                                      | **Version**   |
|-------------------|-------------------------------------------------------|---------------|
| Framework         | React                                                 | 18.3.1        |
| Language          | TypeScript                                            | 5.8.3         |
| Bundler           | Vite                                                  | 5.4.19        |
| Styling           | Tailwind CSS + PostCSS                                | 3.4.17        |
| Components        | shadcn/ui (Radix UI primitives)                       | Latest        |
| Icons             | lucide-react                                          | 0.462.0       |
| Forms             | react-hook-form + zod + @hookform/resolvers           | 7.61.1 + 3.25.76 |
| Routing           | react-router-dom                                      | 6.30.1        |
| Data fetching     | @tanstack/react-query                                 | 5.83.0        |
| i18n              | react-i18next + i18next                               | 16.5.0 + 25.7.3 |
| SEO               | react-helmet-async                                    | 2.0.5         |
| Toasts            | sonner                                                | 1.7.4         |

**For admin dashboard backend:**
- Recommended: Node.js + Express + Prisma + PostgreSQL OR Supabase (auth + database + storage)

---

## 📞 Questions?

If something is unclear or missing from the spec:
1. Check the **source files** listed above (most patterns are implemented in the public site)
2. Review `notes.missingInfo[]` in the JSON (known gaps + how to fill them)
3. Refer to [InnoviaBurst Copilot Instructions](../.github/copilot-instructions.md) for design rules

---

## 📝 Summary

This spec is a **complete design system export** from the InnoviaBurst public site. Use it to:
- Build a **brand-consistent** admin dashboard (same colors, fonts, components, copy style)
- Avoid reinventing patterns (reuse what works on the public site)
- Ensure **accessibility** (44px targets, focus states, ARIA labels already documented)
- Save time (no need to reverse-engineer design tokens or component APIs)

**Next step:** Upload `lovable-input.json` to Lovable and start building! 🚀

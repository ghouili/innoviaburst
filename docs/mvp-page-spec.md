# InnoviaBurst — "MVP Launch" page: best-version spec + copy

Synthesised from a parallel UI/UX review and a marketing/copy review. Constraints honoured throughout: stays inside the brand system (blue-dominant + orange accent, Inter, React/Tailwind/shadcn, SSG/no client-only content), keeps schema + AEO + canonical + SEO title, **invents no proof** (only honest, clearly-marked placeholder slots), and applies EN + FR. Where sensible, changes apply to the shared offer template (also lifts `/ai-ops-sprint` and `/automation-build`).

---

## The direction (one paragraph)

The page is structurally sound — it doesn't need a rebuild, it needs four moves: **(1)** give the hero a real visual anchor + an honest trust row instead of dead space; **(2)** turn the two heaviest text blocks — the scope lists and the week-by-week timeline — into a side-by-side comparison card and a visual timeline, and **move the timeline up** so "weeks, not months" is *shown* early; **(3)** sharpen the copy from feature-lists to founder-outcomes, led by an outcome headline; **(4)** build honest, redesign-free proof slots + a mobile sticky CTA. Everything below is prioritised P0 → P2.

---

## Layout & UX plan

### P0 — biggest lift
1. **Hero visual anchor.** Add an abstract "MVP product view" SVG (stylised app frame in navy/blue: auth screen → chart → user list, one orange accent) at the **top of the sticky right card** — merges the missing visual and the summary card into one object and kills the top-right dead space.
2. **Recompose the hero:** eyebrow kicker ("MVP Launch — fixed-scope MVP development") → H1 (outcome headline) → keyword deck (h2) → subhead trimmed to 2 lines → two inline fact chips ("6–10 weeks" · "You own the code & IP") → primary + secondary CTA → a thin **compliance trust row** (GDPR by design · EU AI Act-ready · Own your IP) as SVG micro-badges. This is the only honest above-the-fold credibility signal — it's a claim about *how you work*, not a fake client.
3. **Merge Included / Not-Included into ONE comparison card** (✓ Included | ○ Out of scope, on purpose). Framing exclusions as "by design — keeps you fixed-scope and on time" turns them into a trust signal.
4. **Rebuild Timeline as a visual horizontal rail** (node dots + phase cards, one orange "Deploy / live" node) and **move it up** to right after the AEO/comparison block. Mobile → vertical rail.
5. **Mobile bottom sticky CTA bar** (the right card is desktop-only; the CTA must follow the thumb on mobile). CSS `position:fixed`, SSG-safe.
6. **Proof strip band** under the hero — honest now (tech-stack "Built on the stack investors expect — Next.js · Postgres · Stripe · Vercel", or the three compliance columns), designed as the greyscale logo-strip pattern so real client logos drop in later with zero redesign.

### P1 — strong polish
7. **Icon rows** for Included / What We Need / Metrics via one reusable `<FeatureRow>` component.
8. **Alternating layouts + section background tints** (white → `#F5F9FD` → white) for rhythm; text sections capped at `max-w-3xl` (~70 chars/line).
9. **Animated timeline reveal** — SVG `<path>` stroke-dashoffset draw on `IntersectionObserver`; renders fully without JS (progressive enhancement); `prefers-reduced-motion` disables it. This is the signature moment.
10. **Founder's-note trust card** in the testimonial slot — honest, signed, with an SVG monogram (NOT a fake quote); becomes the container for a real testimonial later.
11. **Low-commitment micro-copy** under primary CTAs: "48-hour turnaround · No obligation · You keep the scope doc" — reframes the CTA from "sales call" to "free deliverable."
12. **Success Metrics as big-number outcome cards.**

### P2 — later
13. Comparison-table hover interaction (CSS `group-hover`).
14. Blueprint-grid / low-opacity gradient-mesh hero background (one static SVG).
15. Guarantee/assurance card near Billing ("Fixed scope, fixed price. No surprise invoices.").
16. Swap proof strip + testimonial slot to real logos/quotes once they exist (drop-in, no redesign).

### CTA rules
One primary everywhere — **"Get a fixed scope in 48 hours"** (solid logo-blue, orange only as a small "48h" accent) — one secondary "Book a 15-min scoping call". Repeat the primary after Hero, after the Timeline (peak-desire), and in the final block. Never a third competing CTA.

---

## Ready-to-paste copy

### Hero
**Eyebrow:** MVP Launch — fixed-scope MVP development for European startups & SMEs
**H1 (recommended, keeps "MVP" for SEO):** Ship an investor-ready MVP in weeks — with the compliance already built in.
- Alt B: From idea to a live product your board and your DPO can both sign off on.
- Alt C: A working MVP in weeks. Fixed scope, your code, GDPR-ready from day one.
**Keyword deck (h2):** MVP development for European startups & SMEs
**Subhead:** We take one validated idea and build it into a live, investor-ready product — authentication, security and analytics included. You own the code and the IP outright, and it's GDPR and EU AI Act-ready from day one. Fixed scope agreed before we write a line of code.
> Keep exactly one `<h1>`. Use the outcome line as the H1 (it contains "MVP"), "MVP Launch" as the eyebrow, and the keyword deck as the h2 sibling.

### How we build your MVP (replaces the automation-generic "how it works")
Intro: Three stages, one fixed scope. No open-ended timelines, no surprise invoices.
1. **Define the product** — We map the smallest version of your product that proves the idea and stands up to investor questions: core user journeys, the 5–8 screens that matter, and the success metrics you'll report on. You approve a fixed scope and timeline before build begins.
2. **Build, test and check** — We build in short cycles you can see, connecting real authentication, data storage and analytics — not mockups. Data handling, retention and access controls are reviewed at set compliance checkpoints as we go, so nothing needs retrofitting later.
3. **Deploy and hand over** — We deploy to production and hand you everything: the running product, the source code and IP, technical documentation, and data-retention and processing notes your DPO can act on. You leave with a product you can demo, ship and raise on.

### What you get (features → founder outcomes)
- **A live product, in production — not a prototype.** A fully functional MVP deployed and ready to put in front of users and investors.
- **Users can sign up and sign in securely.** Authentication and role-based access built in, so you can onboard real users from launch.
- **Your core product, done properly.** The 5–8 screens and key journeys that prove your idea — scoped and agreed up front.
- **Sensible security from the start.** Encryption in transit, secure authentication and safe data handling as standard, not add-ons.
- **You can see what users actually do.** Analytics wired in so you can report activation and engagement to your board and investors.
- **Works on the devices your users bring.** Mobile-responsive web across phone, tablet and desktop.
- **You own all of it.** Full source code and IP transferred to you — no lock-in, no licence to us.

### What's out of scope (on purpose)
Intro: A tight scope is what lets us ship in weeks. These sit outside MVP Launch — we'll flag early if your project genuinely needs them.
- **Native iOS/Android apps.** We build web-first — faster to ship and iterate. Native comes later, once the product is proven.
- **Formal security certifications.** SOC 2 / ISO 27001 are post-MVP; we build to sensible security standards so you're well placed to pursue them.
- **Unlimited scope.** The scope we agree is the scope we build. New ideas mid-build are logged and quoted as a follow-on — never quietly absorbed or dropped.
- **Ongoing feature development.** MVP Launch delivers your first shippable product. Continued build is a separate, optional engagement.

### The questions founders actually ask (objection handling)
- **"Will it actually ship?"** Yes — and the scope is what guarantees it. We agree exactly what we're building and the timeline before any code is written, then build in short cycles you can watch progress against. Fixed scope means a fixed finish line, not a project that drifts.
- **"Do I really own it?"** Completely. On final payment, all source code and IP transfer to you in writing. No licence back to us, no proprietary lock-in, no dependency on us to keep it running. Your product, your codebase, your asset.
- **"What happens after launch?"** You leave fully equipped: running product, full code, documentation, and data-retention/processing notes. Take it to your own team, another agency, or come back to us. No ongoing contract you're locked into.
- **"Is it genuinely investor-ready?"** It means three things and we build for all: a working product you can demo live, analytics that evidence real user activation, and clean, documented, GDPR- and EU AI Act-ready foundations that survive technical due diligence.

### AEO answer blocks (keep visible in DOM for snippets)
- **What is MVP Launch?** MVP Launch is a fixed-scope MVP development service for European startups and SMEs. We build one validated idea into a live, investor-ready product in weeks — with authentication, security and analytics included. You own the code and IP, and it's GDPR and EU AI Act-ready from day one.
- **How long does it take to build an MVP?** Most MVP Launch builds go from agreed scope to a live product in a matter of weeks, not months. The exact timeline depends on the number of screens and features, which we fix before starting. You'll have a firm scope and delivery date within 48 hours of your first call.
- **What's included in an MVP build?** Every build includes a fully functional product deployed to production, secure authentication with role-based access, your 5–8 core screens, sensible built-in security, analytics integration and a mobile-responsive interface. You receive full source code, IP ownership and compliance documentation covering data retention and processing.

### Sticky card
- Label: MVP Launch
- Line 1: Investor-ready MVP, built in weeks
- Line 2: Fixed scope · You own the code & IP · GDPR & EU AI Act-ready
- Price line: Custom quote per project · EUR / GBP · deposit + milestones
- Under buttons: No fixed-price template — you get a scoped quote for your product, not ours. No obligation.
- Primary CTA: Get a fixed scope in 48 hours
- Secondary CTA: Book a 15-min scoping call

### Honest credibility line (safe to publish now)
We're a compliance-native product studio: we build MVPs the way European founders actually have to ship them — data handling, ownership and documentation treated as first-class from day one, not bolted on before a raise. The standard summed up across our work: AI automation your DPO and your board both sign off on.

### Proof placeholder (clearly marked — swap when real case studies exist)
`[PROOF PLACEHOLDER]` Structure for later: "[Founder], [role] at [company]: '[outcome — shipped / raised / activated users].'" + metric strip ("X weeks idea-to-launch · Y% activation · £Zk raised post-MVP"). Until then use a neutral holding line: "Case studies coming soon — ask for a walkthrough of recent builds on your scoping call."

### Final CTA
- Heading: Ready to see your MVP scoped?
- Body: Tell us the idea. Within 48 hours you'll have a fixed scope, a timeline and a clear quote — no obligation, no open-ended estimates. If it's not the right fit, we'll say so and point you somewhere better.
- Primary: Get a fixed scope in 48 hours · Secondary: Book a 15-min scoping call
- Trust footer line: You own the code and IP · GDPR & EU AI Act-ready · Fixed scope before we build

### Meta (SEO)
- Title (unchanged): MVP Development — Build an Investor-Ready MVP in Weeks | Innoviaburst
- Meta description: Fixed-scope MVP development for UK and EU startups. Ship a live, investor-ready product in weeks — you own the code and IP, GDPR and EU AI Act-ready from day one.

---

## Guardrails for implementation
EN + FR (add EN strings to `en.json`, FR keys to `docs/fr-i18n-todo.json` — no machine translation). Keep the FAQPage / Service schema and canonical byte-identical (only the shortened AEO "how long" answer text changes, preserving 1:1 visible mapping). Exactly one `<h1>`. `prefers-reduced-motion` disables all animation. No invented proof — only the marked placeholder slots. Re-run the offer QA suite (single H1 + deck, CTA above fold, sticky card, no overflow 360/1024/1440, hydration clean, axe 0, schema unchanged).

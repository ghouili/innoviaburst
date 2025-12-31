# InnoviaBurst — GitHub Copilot Instructions (Repo-wide)

These are repository-wide custom instructions for GitHub Copilot.
They apply to Copilot Chat, Copilot code generation, and Copilot code review. :contentReference[oaicite:1]{index=1}

We use requirement language based on RFC 2119:
- MUST = mandatory
- SHOULD = recommended
- MAY = optional
Interpret MUST/SHOULD/MAY as described in RFC 2119. :contentReference[oaicite:2]{index=2}

---

## 0) Copilot behavior
MUST:
- Make changes minimal, scoped, and reversible. Prefer small PR-sized diffs.
- Prefer editing existing patterns/components over introducing new patterns.
- If something is ambiguous in the codebase, inspect existing usage (search for similar components) and follow the established convention.
- Never invent compliance claims (ISO/SOC2/etc). If not explicitly present in the repo, do not add it.

SHOULD:
- Explain “what changed + why” in 3–6 bullets when replying in PR/code review context.
- Provide a test checklist for risky UI changes.

---

## 1) Project overview (what we’re building)
InnoviaBurst is a UK/EU-focused AI + automation studio website:
- Core pages: Home, Automations (Library), Offers, Work (Case studies), Trust & Compliance, Resources
- Goal: convert visitors into leads (book a call / request scope / request build)

MUST:
- Keep the site conversion-first: every major page should have a clear “next step” CTA.
- Keep a premium/clean visual style with consistent spacing, cards, and typography.

---

## 2) Tech conventions (generic + safe)
MUST:
- Use TypeScript, keep types strict and avoid `any` unless there is no alternative.
- Keep components composable and readable; prefer pure UI components + thin containers.
- Avoid unnecessary dependencies (especially heavy UI/animation libs). Prefer existing utilities/components.

SHOULD:
- Prefer memoization only where it is actually needed (measure/observe).
- Prefer lazy-loading for heavy views/components when appropriate.

---

## 3) Build / run / test (do not guess tooling blindly)
MUST:
- Before suggesting commands, check the repository (package.json + lockfile) and follow the existing package manager:
  - pnpm-lock.yaml => pnpm
  - yarn.lock => yarn
  - package-lock.json => npm

SHOULD:
- Use the repo scripts (e.g., `lint`, `typecheck`, `test`, `build`) instead of custom commands.
- When making UI changes, ensure no console errors and no layout breakpoints regress.

---

## 4) UI/UX standards (site-wide)
MUST:
- Maintain consistent rhythm (spacing, section padding, card padding, border radius, shadows).
- Keep interactive target sizes accessible: aim for ≥ 44×44 CSS pixels for pointer targets where feasible. :contentReference[oaicite:3]{index=3}
- Don’t create “choice overload”: where lists are long (library/resources), provide sorting/filtering patterns and reduce cognitive load.

SHOULD:
- Prefer scannability:
  - 1 sentence intro + bullets
  - clear headings and consistent card structures
- Ensure CTA consistency: one primary CTA and one secondary CTA across pages (same wording/style).

---

## 5) Accessibility (a11y)
MUST:
- Use semantic HTML and correct heading hierarchy (H1 → H2 → H3).
- Buttons/links must have clear labels (`aria-label` only when necessary).
- Keyboard navigation must work for menus, tabs, accordions, dialogs.

SHOULD:
- Focus rings must be visible; do not remove focus outlines without replacement.

---

## 6) i18n & content rules
MUST:
- Main language defaults to French unless explicitly configured otherwise.
- When adding/renaming UI text:
  - add translation keys for FR and EN (and AR if the repo supports AR)
  - never hardcode user-visible copy if the project uses i18n keys
- Avoid “broken French/English”: keep copy short, plain, and business-professional.

SHOULD:
- Keep terminology consistent across pages (Offer names, CTA labels, compliance vocabulary).

---

## 7) Performance & SEO hygiene
MUST:
- Avoid importing heavy libs globally; lazy-load where possible.
- Do not regress Lighthouse/perf materially.

SHOULD:
- Prefer optimized images and consistent sizing.
- Keep meta/SEO structures consistent (page titles, descriptions) if present in the codebase.

---

## 8) Privacy, cookies, and compliance guardrails (site-wide)
MUST:
- Cookie consent UI must avoid dark patterns.
- If there is an “Accept all” option, users must have an equally prominent and non-ambiguous way to reject non-essential cookies (UK ICO expectation). :contentReference[oaicite:4]{index=4}
- Do not load non-essential trackers before consent (unless strictly necessary).

SHOULD:
- Keep privacy/compliance wording factual, plain English/French, and avoid overpromising.
- Use the Trust & Compliance page as the single source of truth for compliance messaging.

---

## 9) “Trust & Compliance” page — product specification
(Keep this section aligned with the current implemented screen.)

### 9.1 Summary
We must keep the Trust & Compliance page “enterprise-grade”, easy to scan, and conversion-friendly, while staying truthful and aligned with UK/EU expectations.

### 9.2 Audience
Primary:
- UK/EU founders, ops leads, CTOs evaluating InnoviaBurst for automation and MVP delivery.
Secondary:
- Procurement / security reviewers asking for DPA, sub-processors, retention, breach, AI governance.

### 9.3 Outcomes
MUST:
- Increase perceived trust within 10 seconds (hero + “Trust pack at a glance”).
- Make key topics findable within ≤ 2 scrolls: DPA / SCC / retention / breach / sub-processors / AI oversight.
- Provide strong CTAs: “Book a call” + “Download Trust Pack (PDF)” and optional “Request DPA / Security questionnaire”.
- Keep claims factual; no certifications implied unless they exist.

SHOULD:
- Provide on-page ToC (anchors) to sections.
- Convert paragraphs into 1 sentence + bullets.
- Add “What you can request” section.

### 9.4 Non-goals
- Do not redesign global header/footer.
- Do not change routing/i18n setup unless explicitly required.
- Do not introduce heavy dependencies.

### 9.5 Acceptance criteria
MUST:
- Working ToC anchors (desktop + mobile)
- “Trust pack at a glance” present (min 4 items)
- Sections formatted as: Title + 1 sentence + bullets
- CTAs present and tappable
- No significant perf regressions

---

## 10) How to prompt Copilot on this repo (recommended template)
When asking Copilot to implement something, include:

1) Context:
- page/component path(s)
- what problem is observed
- screenshot reference (if any)

2) Requirements (MUST/SHOULD/MAY):
- layout behavior across breakpoints
- accessibility requirements
- i18n requirements

3) Non-goals:
- what must not change (header/footer, routes, styles)

4) Definition of done:
- expected UI result
- tests/checklist

Example (short):
“Update Trust page ToC to be sticky on desktop only (MUST), collapsible on mobile (SHOULD), no new deps (MUST), keep existing card styles (MUST), ensure targets ≥44px (SHOULD). Done when anchors work and mobile layout doesn’t overflow.”

---

## 11) Optional: path-specific instructions (recommended for large repos)
If we need stricter rules for a page/area, add path-specific `.instructions.md` files (e.g., `src/pages/trust/README.instructions.md`) to scope rules without polluting repo-wide instructions. :contentReference[oaicite:5]{index=5}

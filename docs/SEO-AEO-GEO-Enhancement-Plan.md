# InnoviaBurst — SEO / AEO / GEO Enhancement Plan

_Three-lens audit (SEO, AEO, GEO) across all three pillars: **AI & automation**, **software development / MVPs**, **team training**. Read-only scan of source + built output. Nothing invented — items needing real data are flagged._

---

## Headline verdict

The technical foundation is genuinely strong: clean SSG output, correct per-locale canonicals + `en`/`fr`/`x-default` hreflang, a coherent `@id` entity graph, FAQPage schema mapped 1:1 to the DOM, and disciplined honesty (no fabricated client metrics anywhere). That is a real asset — most competitors don't have this.

The problem is **imbalance**, which is exactly what you asked to fix:

- **Dev / MVP is the reference standard.** `mvp-launch` is the richest, best-optimised page on the site (bespoke title/meta, outcome H1, Service + FAQ schema, ~1,600 words, plus a dedicated landing page).
- **Automation has the best internal linking but the weakest offer-page SEO** (its two offer pages fall back to bare product-name titles) and its hub `/automations` has zero FAQ/definitional content.
- **Training is the most under-served pillar on every lens**: near-orphaned internal linking, no Course schema, missing from the Organization entity, thin on citable facts, and entirely absent from the French site.

Two site-wide gaps also suppress generative-engine trust: the **Organization entity is thin** (no founder, address, VAT, `knowsAbout`, weak `sameAs`), and **Africa does not exist anywhere on the site** despite the Europe-first / Africa-second positioning.

---

## Pillar-parity scorecard

| Signal | Automation | Dev / MVP | Training |
|---|---|---|---|
| Title / meta quality | Weak (offer pages fall back) | **Best on site** | Strong |
| Internal linking / discoverability | **Best** (nav + home + footer) | Good (no footer link) | **Weakest** (nav dropdown only) |
| FAQ + FAQPage schema | Offers ✅ · hub/LP ❌ | `mvp-launch` ✅ · `/lp/mvp` ❌ | ✅ (best FAQ) |
| Specialised schema | ItemList | Offer-ready | **No Course schema** |
| In Organization entity | ✅ | ✅ | **Absent** |
| Hard citable facts | Strong | Strong | **Vague** (no durations/sizes) |
| French / hreflang | Localised (LP signal bug) | Body localised, hero English | **Entirely English** |

---

## The plan

Sequenced by impact ÷ effort. Each item is tagged by lens and pillar. Phases 1–3 need **no new facts** — they can ship now. Phase 4 needs **your real data** (see the gate at the end).

### Phase 1 — Quick schema + signal wins (low effort, high leverage)

1. **Add FAQPage schema to `/lp/mvp`.** [AEO · Dev] The 4 answers already exist; they're just not wired into JSON-LD. One-line import of `faqJsonLd`. _File: `src/pages/LpMvpPage.tsx`._
2. **Fix `/lp/ai-automation` index signal.** [SEO · Automation] It's excluded from the sitemap (`noindex:true`) but emits no robots meta, so it's indexable-but-hidden — a contradictory signal. Pass `robots="noindex, nofollow"` like `/lp/mvp` does. _File: `src/pages/LandingPage.tsx`._
3. **Add `HowTo` schema** to existing step content (offer "How it works", MVP `howWeBuild`, training booking steps). [AEO · all] New `howToJsonLd` helper; content already written. _Files: `src/seo/jsonld.ts`, offer/MVP/training pages._
4. **Standardise the brand name** to one canonical casing (`InnoviaBurst` vs `Innoviaburst` — currently mixed 11:24). [GEO · all] Weakens entity resolution. _Files: `src/i18n/*.json`, `og:site_name`, `ORG_FACTS.name`._
5. **Delete the commented-out pricing table** in `OffersSection.tsx` (holds stale, wrong figures £5k/£15k/£25k that contradict the real source). [GEO · all] Source hygiene, prevents a future wrong-price leak.

### Phase 2 — Close the training + automation gaps (the core rebalance)

6. **Make `/training` discoverable.** [SEO · Training] Add a crawlable `<Link to="/training">` in the home `TrainingSection` (today it only has modal buttons) and a footer link. Descriptive anchor text, not "Learn more." _Files: `src/components/sections/TrainingSection.tsx`, `src/components/layout/Footer.tsx`._
7. **Add `/mvp-launch` to the footer** for link-equity parity. [SEO · Dev] _File: `src/components/layout/Footer.tsx`._
8. **Bespoke titles/meta + outcome H1 for the two automation offers** (`ai-ops-sprint`, `automation-build`). [SEO · Automation] Mirror the `mvp-launch` pattern; the page code already supports the keys. Target intent like "Workflow Automation Sprint for UK/EU Ops Teams — Live in 10 Days." _File: `src/i18n/en.json` (`offerDetails.*`)._
9. **Give `/automations` an FAQ + definitional intro + FAQPage.** [AEO · Automation] The flagship automation page currently has zero Q&A. Add "What is workflow automation for SMEs?", "How long does it take?", "How much does it cost?" (process answer), "Is it GDPR / EU AI Act compliant?". _Files: `src/pages/AutomationsPage.tsx`, `src/i18n/en.json`._
10. **Add Course schema to `/training`.** [SEO+AEO · Training] `Course` / `EducationalOccupationalProgram` with `provider: {@id: ORG_ID}`, one instance per track, `courseMode: ["onsite","online"]`. The single highest-value schema type for a training product. _Files: `src/seo/jsonld.ts`, `src/pages/TrainingPage.tsx`._
11. **Add training into the Organization entity.** [GEO · Training] Org `description` + `serviceType` and About "what we do" list all omit training. Add it, plus a `knowsAbout` array covering all three pillars + governance/EU AI Act. _Files: `src/seo/jsonld.ts`, `src/i18n/en.json` (`about.what`)._
12. **Enrich the homepage graph.** [GEO · all] The most-cited page emits only Org + WebSite + Breadcrumb. Add three `serviceJsonLd` nodes (or an `OfferCatalog`/`hasPart`) and a small sitewide FAQPage ("what is InnoviaBurst / the three services / who / where"). _File: `src/pages/Index.tsx`._

### Phase 3 — Answer-engine breadth + copy (draftable now, no invented facts)

13. **Restore substance to the "how much" answers.** [AEO · all offers] With pricing hidden, all three offers currently share one generic sentence (a duplicate-answer signal). Replace with per-offer, figure-free **process** answers (scope-set-in-discovery, 50/50 terms, EUR/GBP, you own the code) so the question stays rich and unique without publishing a number. _Files: `src/data/offers.ts`, `src/i18n/en.json`._
14. **One quotable one-sentence definition per service** near the top of each pillar page ("In one sentence, X is…"). [GEO+AEO · all] MVP has this; give automation and training an equally crisp, extractable line.
15. **Category-definitional content** ("What is workflow automation?", "What is an MVP?", "What is corporate AI training?") — the higher-volume generic queries product-name definitions miss. [AEO · all]
16. **One comparison block per pillar** (prose Q&A + FAQPage): "Sprint vs Build", "MVP vs full product / when to build an MVP", "workshop vs cohort". [AEO · all]
17. **Add duration / group-size / cost-process answers to the training FAQ.** [AEO+GEO · Training] Ranges and process, not fabricated numbers (e.g. "workshops = half or full day for small groups; cohorts = multi-week for a whole team; priced per programme, quoted before booking").
18. **Add a short FAQ to `/lp/ai-automation`** reusing the automation Q&A. [AEO · Automation]
19. **Strengthen the `/automations` hub** with a keyword+geo title (replace "Automation Library") and an indexable intro so it ranks for head terms, not just the long-tail ItemList. [SEO · Automation]

### Phase 4 — Needs your real data (cannot ship without it — see gate)

20. **Fill the Organization trust fields** in `src/seo/org-facts.ts`: legal name, founding date, founder (name + title + LinkedIn), registered address, VAT/company number, and more `sameAs` links. The code auto-emits these the moment they're non-null, and the About founder section unlocks. **Highest-weight GEO/E-E-A-T signal.**
21. **Decide and represent Africa.** If it's a real/target market, add African countries to `areaServed` and add explicit "Europe and Africa" copy. If it's aspirational, state it precisely ("expanding to [countries] in [year]") rather than leaving it blank.
22. **Name training partners + accreditation body** once agreements are signed (currently the "accredited" claim is unverifiable, honestly hedged).
23. **Translate the training pillar (and `about`, `mvpHero`) into French** so `/fr/*` stops serving English under French canonicals — important for the francophone-Europe/Africa push. (Content task, not a "fact" — but sizable; queued in `docs/fr-i18n-todo.json`.)

---

## The data gate

Phases 1–3 are entirely implementable now and rebalance the three pillars without inventing anything. Phase 4 items 20–22 require facts only you have — and given the strict no-fabrication rule the whole build has followed, they must come from you, not be guessed:

- Legal name, founding date, founder name/title/LinkedIn, registered address, VAT/company number.
- Is Africa a served market, a dated expansion target, or should it be dropped from the positioning? Which countries?
- Any real certifications (Cyber Essentials status, ISO, SOC 2) to cite as trust signals.
- Named/accredited training partners (or confirm to keep hedged).

---

## Suggested execution order

Phase 1 (a single small Claude Code pass, all schema/signal fixes) → Phase 2 (the rebalance — training discoverability + Course schema + automation offer/hub SEO) → Phase 3 (answer-engine copy, which I can draft) → Phase 4 as your data lands. Every phase ships behind the existing green QA suite (qa:titles re-baseline where titles change, verify:jsonld for new schema, qa:axe, verify:seo).

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck, CalendarDays, Sparkles, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillBadge } from "@/components/ui/pill-badge";
import { MvpHeroVisual } from "./MvpHeroVisual";
import { useRevealOnView } from "./useRevealOnView";

/**
 * The /mvp-launch hero, ported from the Claude Design file.
 *
 * Structure is fixed by the page's SEO contract and doesn't move: eyebrow
 * (product name) → single <h1> (the outcome headline, contains "MVP") → keyword
 * <h2> deck → subhead → fact chips → CTAs → compliance trust row.
 *
 * The animation is armed by `useRevealOnView`; until then `data-play` is absent
 * and index.css renders the finished composition. That ordering is what keeps
 * the server HTML and the first client render identical.
 */
export function MvpHero({
  slug,
  onScopeClick,
  onBookClick,
}: {
  slug: string;
  onScopeClick: () => void;
  onBookClick: () => void;
}) {
  const { t } = useTranslation();
  const [ref, playing] = useRevealOnView<HTMLElement>();

  const facts = t(`offerDetails.${slug}.summaryFacts`, { returnObjects: true }) as string[];

  const trust = [
    { key: "gdpr", Icon: CircleCheck },
    { key: "aiAct", Icon: CircleCheck },
    { key: "ip", Icon: CircleCheck },
  ];

  return (
    <section
      ref={ref}
      data-play={playing ? "on" : undefined}
      className="ib-hero relative overflow-hidden bg-background py-12 lg:py-20"
    >
      {/* Ambient wash + blueprint grid, both pure CSS */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1100px 620px at 78% -12%, hsl(var(--accent) / 0.16), transparent 62%)," +
            "radial-gradient(760px 520px at 4% 8%, hsl(var(--secondary) / 0.1), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--deep-blue-dark) / 0.05) 1px, transparent 1px)," +
            "linear-gradient(to bottom, hsl(var(--deep-blue-dark) / 0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0) 78%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0) 78%)",
        }}
      />

      <div className="container relative mx-auto px-4 lg:px-6">
        <Link
          to="/#offers"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t("offerPage.ui.backToOffers")}
        </Link>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---- Copy column ---- */}
          <div className="flex min-w-0 flex-col items-start gap-5">
            <PillBadge
              variant="category"
              className="ib-pop border-secondary/20 bg-secondary/10 py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-deep-blue-dark"
              style={{ animationDelay: "0.05s" }}
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-blue">
                <Sparkles className="h-3 w-3 text-secondary-foreground" aria-hidden="true" />
              </span>
              <span className="text-balance text-left">{t(`offerDetails.${slug}.eyebrow`)}</span>
            </PillBadge>

            <h1
              className="ib-pop text-3xl font-extrabold leading-[1.06] tracking-tight text-foreground text-balance md:text-5xl"
              style={{ animationDelay: "0.12s" }}
            >
              {t(`offerDetails.${slug}.h1Pre`)}
              <span className="text-gradient-brand">{t(`offerDetails.${slug}.h1Accent`)}</span>
              {t(`offerDetails.${slug}.h1Post`)}
            </h1>

            <h2
              className="ib-pop text-base font-semibold text-secondary md:text-lg"
              style={{ animationDelay: "0.18s" }}
            >
              {t(`offerDetails.${slug}.subheading`)}
            </h2>

            <p
              className="ib-pop max-w-[47ch] text-base leading-relaxed text-muted-foreground text-pretty md:text-[17px]"
              style={{ animationDelay: "0.24s" }}
            >
              {t(`offerDetails.${slug}.heroDescription`)}
            </p>

            {/* Fact chips */}
            <ul className="ib-pop flex flex-wrap items-center gap-2.5" style={{ animationDelay: "0.3s" }}>
              <li className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-[13.5px] font-semibold text-deep-blue-dark shadow-sm">
                <Clock className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
                {t(`offerDetails.${slug}.timeline`)}
              </li>
              {facts.slice(0, 1).map((fact) => (
                <li
                  key={fact}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-[13.5px] font-semibold text-deep-blue-dark shadow-sm"
                >
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="ib-pop flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "0.36s" }}>
              <Button
                variant="hero"
                size="lg"
                onClick={onScopeClick}
                className="w-full min-h-[52px] px-6 text-sm sm:w-auto sm:text-base"
              >
                {t("offerPage.ui.ctaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="hero-outline"
                size="lg"
                onClick={onBookClick}
                className="w-full min-h-[52px] px-6 text-sm sm:w-auto sm:text-base"
              >
                <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("offerPage.ui.ctaSecondary")}
              </Button>
            </div>

            <p className="ib-pop text-xs text-muted-foreground" style={{ animationDelay: "0.4s" }}>
              {t("offerPage.ui.ctaMicrocopy")}
            </p>

            {/* Compliance trust row */}
            <ul
              className="ib-pop flex w-full flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-border pt-5"
              style={{ animationDelay: "0.44s" }}
            >
              {trust.map(({ key, Icon }) => (
                <li key={key} className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  {t(`offerPage.ui.trustRow.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Animated visual ---- */}
          <MvpHeroVisual />
        </div>
      </div>
    </section>
  );
}

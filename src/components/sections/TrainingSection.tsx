import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MonitorPlay, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnifiedCard } from "@/components/ui/unified-card";
import { PillBadge } from "@/components/ui/pill-badge";
import { Reveal } from "@/components/lp/Reveal";
import { TrainingRoomVisual } from "@/components/sections/heroes/TrainingRoomVisual";

// Icons map 1:1 to trainingSection.formats (workshops · cohorts · partner-certified).
const FORMAT_ICONS = [MonitorPlay, Users, Award];

// Partner logos are not signed off yet — render five obvious placeholders rather
// than invent accreditations (same honesty rule as the "case studies coming
// soon" listing). Swap for real logo images once partners are confirmed.
const PARTNER_PLACEHOLDER_COUNT = 5;

interface Format {
  title: string;
  description: string;
}

interface TrainingSectionProps {
  /** Opens the scope/request flow (RequestModal), prefilled with the training interest. */
  onRequestClick?: () => void;
  /** Opens the 15-min call booking flow (BookingModal). */
  onBookingClick?: () => void;
}

/**
 * Homepage Training band — sits directly after the MVP section and pitches the
 * partner-delivered AI & automation training. Follows the standard section
 * rhythm (gradient-brand heading + card grid + hero CTA) but runs a two-column
 * copy/illustration split so it reads differently from the bands around it.
 *
 * Background is `bg-background` on purpose: it lands between MVP
 * (`bg-gradient-hero`) and Solutions (`bg-muted/30`), keeping the alternating
 * band rhythm intact.
 */
export function TrainingSection({ onRequestClick, onBookingClick }: TrainingSectionProps = {}) {
  const { t } = useTranslation();
  const formats = t("trainingSection.formats", { returnObjects: true }) as Format[];

  return (
    // scroll-mt clears the fixed navbar when arriving via the #training anchor
    <section
      id="training"
      className="py-20 lg:py-28 bg-background overflow-hidden scroll-mt-24"
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Two columns only from xl — at lg the split leaves the copy column
            ~456px, which cramps the format cards and wraps the CTA row. */}
        <div className="grid xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* ── Copy column ─────────────────────────────────────────────── */}
          <div className="min-w-0">
            <Reveal>
              <PillBadge variant="category" size="lg">
                <span
                  className="w-2 h-2 rounded-full bg-orange shrink-0"
                  aria-hidden="true"
                />
                {t("trainingSection.eyebrow")}
              </PillBadge>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.1] font-bold text-foreground text-balance">
                {t("trainingSection.title")}{" "}
                <span className="text-gradient-brand">
                  {t("trainingSection.titleHighlight")}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
                {t("trainingSection.subtitle")}
              </p>
            </Reveal>

            {/* Formats */}
            <Reveal delay={240}>
              <div className="mt-10 grid sm:grid-cols-3 gap-4">
                {Array.isArray(formats) &&
                  formats.map((format, i) => {
                    const Icon = FORMAT_ICONS[i] ?? MonitorPlay;
                    // The third format (partner-certified) carries the orange
                    // accent — orange is an accent colour here, never a CTA.
                    const isAccent = i === 2;
                    return (
                      <UnifiedCard
                        key={format.title}
                        variant="default"
                        padding="none"
                        className="relative p-5 hover:shadow-card-hover hover:-translate-y-0.5"
                      >
                        <span
                          className="absolute top-4 right-4 text-xs font-semibold tabular-nums text-muted-foreground/50"
                          aria-hidden="true"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            isAccent ? "bg-gradient-cta" : "bg-gradient-blue"
                          }`}
                        >
                          <Icon
                            className="w-5 h-5 text-primary-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-foreground">
                          {format.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {format.description}
                        </p>
                      </UnifiedCard>
                    );
                  })}
              </div>
            </Reveal>

            {/* CTAs — primary opens the scope/request flow, secondary the call booking */}
            <Reveal delay={320}>
              <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={onRequestClick}
                  className="w-full sm:w-auto min-h-[48px]"
                >
                  {t("trainingSection.cta")}
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
                <Button
                  variant="hero-outline"
                  size="lg"
                  onClick={onBookingClick}
                  className="w-full sm:w-auto min-h-[48px]"
                >
                  {t("trainingSection.secondaryCta")}
                </Button>
              </div>
            </Reveal>

            {/* Crawlable link to the full /training page (the CTAs above open
                modals, so this is the only real href — keeps the training pillar
                discoverable and passes link equity with descriptive anchor text). */}
            <Reveal delay={360}>
              <Link
                to="/training"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 rounded-sm"
              >
                {t("trainingSection.viewAll")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Reveal>



            {/* Partner logos — explicit placeholders until accreditations are confirmed */}
            {/* <Reveal delay={400}>
              <div className="mt-12 pt-8 border-t border-border max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t("trainingSection.partnersLabel")}
                </p>
                <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 list-none p-0">
                  {Array.from({ length: PARTNER_PLACEHOLDER_COUNT }).map((_, i) => (
                    <li
                      key={i}
                      className="h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center gap-2 px-3"
                    >
                      <span
                        className="w-4 h-4 rounded-sm bg-accent/15 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-semibold text-muted-foreground truncate">
                        {t("trainingSection.partnerPlaceholder")}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {t("trainingSection.partnersNote")}
                </p>
              </div>
            </Reveal> */}
          </div>

          {/* ── Illustration column ─────────────────────────────────────── */}
          <Reveal delay={160} className="min-w-0">
            <TrainingRoomVisual className="w-full max-w-[560px] mx-auto" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComingSoonIllustration } from "@/components/sections/heroes/ComingSoonIllustration";

/**
 * Reusable "coming soon / under construction" state.
 *
 * Composes the illustration with a headline, one line of copy and the two ways
 * out: back to home, or book a call. Written to be dropped into any in-progress
 * surface, not just /coming-soon. An untranslated locale or an unfinished
 * section can render it with its own title and description while everything
 * else stays identical.
 *
 * Every default comes from i18n, so a caller that passes nothing still gets
 * fully localized copy rather than English baked into the component.
 */
export interface ComingSoonProps {
  /** Overrides the default headline. */
  title?: string;
  /** Overrides the default one-line explanation. */
  description?: string;
  /** Where the primary CTA goes. Defaults to the home page. */
  backHref?: string;
  /**
   * Opens the booking modal. Optional because this can be dropped onto a
   * surface that mounts no modal, in which case the secondary CTA links to the
   * homepage contact section instead.
   */
  onBookCall?: () => void;
  /**
   * Heading level for the title. Defaults to `h1` because the usual case is a
   * whole page standing in for missing content. Drop to `h2` when embedding it
   * as an unfinished section inside a page that already owns its h1, so the
   * page keeps exactly one.
   */
  headingLevel?: "h1" | "h2";
  className?: string;
}

export function ComingSoon({
  title,
  description,
  backHref = "/",
  onBookCall,
  headingLevel: Heading = "h1",
  className = "",
}: ComingSoonProps) {
  const { t } = useTranslation();

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-9 rounded-3xl border border-border bg-card px-6 py-12 shadow-card sm:px-12">
          <ComingSoonIllustration />

          <div className="flex flex-col items-center gap-3.5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 py-1.5 pl-2.5 pr-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-deep-blue-dark">
                {t("comingSoon.state.eyebrow")}
              </span>
            </span>

            <Heading className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
              {title ?? t("comingSoon.state.title")}
            </Heading>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty">
              {description ?? t("comingSoon.state.description")}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="hero" size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
              <Link to={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("comingSoon.state.backCta")}
              </Link>
            </Button>

            {onBookCall ? (
              <Button
                variant="hero-outline"
                size="lg"
                onClick={onBookCall}
                className="w-full sm:w-auto min-h-[48px]"
              >
                <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("comingSoon.state.bookCta")}
              </Button>
            ) : (
              <Button variant="hero-outline" size="lg" asChild className="w-full sm:w-auto min-h-[48px]">
                <Link to="/#contact">
                  <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
                  {t("comingSoon.state.bookCta")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComingSoon;

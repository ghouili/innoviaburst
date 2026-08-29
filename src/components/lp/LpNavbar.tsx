import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/innoviaburst-logo.webp";
import logoT from "@/assets/Logo-Text.webp";

interface LpNavbarProps {
  /** Single CTA label (short; scrolls to the scope form). */
  ctaLabel: string;
  /** Single CTA action — typically "scroll to the scope form". */
  onCtaClick: () => void;
}

/**
 * Stripped landing-page header: logo + ONE call-to-action. No nav links, no
 * language switcher, no mobile menu — every pixel points at the conversion.
 * The logo still links home so the brand is verifiable (not a nav "leak").
 */
export function LpNavbar({ ctaLabel, onCtaClick }: LpNavbarProps) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-navbar transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav aria-label={t("lpMvp.a11y.primaryNav")} className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link
            to="/"
            aria-label={t("lpMvp.a11y.home")}
            className="flex shrink-0 items-end gap-0.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img src={logo} alt="InnoviaBurst" width={256} height={256} className="h-10 w-auto lg:h-16" />
            <span className="flex h-full items-end">
              <img src={logoT} alt="" aria-hidden="true" width={480} height={96} className="h-5 w-auto lg:h-8" />
            </span>
          </Link>

          <Button
            variant="hero"
            size="default"
            onClick={onCtaClick}
            className="min-h-[44px]"
          >
            {ctaLabel}
          </Button>
        </div>
      </nav>
    </header>
  );
}

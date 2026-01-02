import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

// Cookie consent storage key (must match CookieConsent.tsx)
const COOKIE_CONSENT_KEY = "innoviaburst_cookie_consent";

interface StickyNextStepProps {
  onRequestClick: () => void;
  onBookClick: () => void;
}

export function StickyNextStep({
  onRequestClick,
  onBookClick,
}: StickyNextStepProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);

  const [cookiesOpen, setCookiesOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    setCookiesOpen(!stored);

    const handleConsent = () => {
      setCookiesOpen(false);
    };
    window.addEventListener("cookie_consent", handleConsent);
    return () => window.removeEventListener("cookie_consent", handleConsent);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approximately 600px)
      setIsVisible(window.scrollY > 600);
    };

    // Check if cookie banner is showing
    const checkCookieBanner = () => {
      const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setCookieBannerVisible(!hasConsent);
    };

    // Listen for cookie consent changes
    const handleCookieConsent = () => {
      setCookieBannerVisible(false);
    };

    // Initial check
    checkCookieBanner();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("cookie_consent", handleCookieConsent);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cookie_consent", handleCookieConsent);
    };
  }, []);

  if (!isVisible) return null;

  // When cookie banner is visible, add extra bottom padding to avoid focus obstruction
  // Cookie banner is approximately 200px tall on mobile, 160px on desktop
  const bottomOffset = cookieBannerVisible
    ? "bottom-[180px] lg:bottom-[140px]"
    : "bottom-0";
  if (cookiesOpen) return null;
  return (
    <div
      className={`fixed left-0 right-0 z-[80] bg-card/95 backdrop-blur-md border-t border-border shadow-lg animate-fade-in transition-all duration-300 ${bottomOffset}`}
      role="navigation"
      aria-label={t("stickyBar.label")}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="hero"
            size="default"
            onClick={onRequestClick}
            className="min-h-[44px] gap-2"
          >
            {t("stickyBar.primaryCta")}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={onBookClick}
            className="min-h-[44px] gap-2 hidden sm:inline-flex"
          >
            <Calendar className="w-4 h-4" />
            {t("stickyBar.secondaryCta")}
          </Button>
        </div>
      </div>
    </div>
  );
}

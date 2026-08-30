
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, Shield, BarChart3, Megaphone, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { loadMetaPixel } from "@/lib/meta-pixel";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface ConsentRecord {
  preferences: CookiePreferences;
  timestamp: string;
  version: string;
}

const COOKIE_CONSENT_KEY = "innoviaburst_cookie_consent";
const CONSENT_VERSION = "1.0";

// Event for reopening cookie settings without page reload
const COOKIE_SETTINGS_EVENT = "open_cookie_settings";

/**
 * Custom toggle (less rounded + bigger + better spacing) instead of shadcn Switch.
 * Reason: shadcn switch is rounded-full by default and doesn't let you style the thumb easily from usage.
 * This keeps the change scoped to this component. :contentReference[oaicite:1]{index=1}
 */
function PreferenceToggle({
  id,
  checked,
  disabled,
  onChange,
  ariaLabel,
}: {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
  ariaLabel: string;
}) {
  const isRTL =
    typeof document !== "undefined" &&
    document.documentElement.dir?.toLowerCase() === "rtl";

  const translateClass = checked
    ? isRTL
      ? "-translate-x-6"
      : "translate-x-6"
    : "translate-x-0";

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={[
        // bigger hit area + "py-2" feel
        "relative inline-flex min-h-[35px] w-14 items-center justify-center p-2",
        // less-round than pill
        "rounded-xl border",
        // colors + transitions
        checked
          ? "bg-primary/15 border-primary/30"
          : "bg-muted/60 border-border",
        disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
        "shadow-sm transition-colors",
        // a11y focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
      ].join(" ")}
    >
      {/* track labels (subtle) */}

      {/* thumb */}
      <span
        className={[
          "absolute top-1 start-1 h-6 w-6",
          // less-rounded thumb
          "rounded-lg bg-background shadow",
          "transition-transform duration-200 ease-out",
          translateClass,
        ].join(" ")}
      />
    </button>
  );
}

export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      try {
        const record: ConsentRecord = JSON.parse(stored);
        setPreferences(record.preferences);
        applyConsent(record.preferences);
      } catch {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        setIsVisible(true);
      }
    }

    // Listen for reopen event from footer "Cookie settings" button
    const handleReopenSettings = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, handleReopenSettings);
    return () =>
      window.removeEventListener(COOKIE_SETTINGS_EVENT, handleReopenSettings);
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Deny-by-default: the Meta Pixel loads ONLY with marketing consent, and
    // never before this point (no connect.facebook.net / facebook.com/tr until
    // here). Idempotent across reloads/navigation.
    if (prefs.marketing) loadMetaPixel();
    // No analytics vendor is wired yet — add its loader here behind prefs.analytics.
    window.dispatchEvent(new CustomEvent("cookie_consent", { detail: prefs }));
  };

  const saveConsent = (prefs: CookiePreferences) => {
    const record: ConsentRecord = {
      preferences: prefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
    applyConsent(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  };

  const handleConfirmChoices = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] animate-fade-in"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      {/* Full-width shell */}
      <div className="w-full bg-white backdrop-blur supports-[backdrop-filter]:bg-card border-t border-border shadow-2xl">
        {/* Side padding only (no max-width container) */}
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full">
            {/* Main Banner */}
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl bg-accent/20 shrink-0"
                  aria-hidden="true"
                >
                  <Cookie className="w-6 h-6 text-accent" />
                </div>

                <div className="flex-1 space-y-2">
                  <h2
                    id="cookie-banner-title"
                    className="text-lg font-bold text-foreground"
                  >
                    {t("cookies.bannerTitle")}
                  </h2>
                  <p
                    id="cookie-banner-desc"
                    className="text-sm text-muted-foreground"
                  >
                    {t("cookies.bannerDesc")} {" "}
                    <Link
                      to="/cookies"
                      className="text-accent-strong hover:underline font-medium"
                    >
                      {t("cookies.readPolicy")}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Three Equal Buttons - ICO Compliant */}
              {!showPreferences && (
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:shrink-0">
                  <Button
                    variant="hero"
                    size="default"
                    onClick={handleAcceptAll}
                    className="flex-1 min-h-[44px] whitespace-nowrap"
                  >
                    {t("cookies.actions.acceptAll")}
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleRejectNonEssential}
                    className="flex-1 min-h-[44px] whitespace-nowrap"
                  >
                    {t("cookies.actions.reject")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 min-h-[44px] gap-2 whitespace-nowrap"
                  >
                    <Settings2 className="w-4 h-4" />
                    {t("cookies.actions.manage")}
                  </Button>
                </div>
              )}
            </div>

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="mt-5 border-t border-border pt-5 space-y-6">
                <h3 className="text-base font-semibold text-foreground">
                  {t("cookies.preferencesTitle")}
                </h3>

                <div className="space-y-4">
                  {/* Essential - Always On */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                        <Shield className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {t("cookies.groups.essential.title")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("cookies.groups.essential.desc")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <PreferenceToggle
                        checked={true}
                        disabled
                        ariaLabel={t("cookies.groups.essential.aria")}
                      />
                    </div>
                  </div>

                  {/* Functional */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/20 shrink-0">
                        <Settings2 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <label
                          htmlFor="functional-toggle"
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          {t("cookies.groups.functional.title")}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("cookies.groups.functional.desc")}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <PreferenceToggle
                        id="functional-toggle"
                        checked={preferences.functional}
                        onChange={(next) =>
                          setPreferences((p) => ({ ...p, functional: next }))
                        }
                        ariaLabel={t("cookies.groups.functional.aria")}
                      />
                    </div>
                  </div>

                  {/* Analytics */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/20 shrink-0">
                        <BarChart3 className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <label
                          htmlFor="analytics-toggle"
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          {t("cookies.groups.analytics.title")}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("cookies.groups.analytics.desc")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <PreferenceToggle
                        id="analytics-toggle"
                        checked={preferences.analytics}
                        onChange={(next) =>
                          setPreferences((p) => ({ ...p, analytics: next }))
                        }
                        ariaLabel={t("cookies.groups.analytics.aria")}
                      />
                    </div>
                  </div>

                  {/* Marketing */}
                  <div className="flex items-start justify-between gap-4 p-4 bg-muted/20 rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/20 shrink-0">
                        <Megaphone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <label
                          htmlFor="marketing-toggle"
                          className="text-sm font-semibold text-foreground cursor-pointer"
                        >
                          {t("cookies.groups.marketing.title")}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("cookies.groups.marketing.desc")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <PreferenceToggle
                        id="marketing-toggle"
                        checked={preferences.marketing}
                        onChange={(next) =>
                          setPreferences((p) => ({ ...p, marketing: next }))
                        }
                        ariaLabel={t("cookies.groups.marketing.aria")}
                      />
                    </div>
                  </div>
                </div>

                {/* Confirm Choices */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="hero"
                    size="default"
                    onClick={handleConfirmChoices}
                    className="flex-1 min-h-[44px]"
                  >
                    {t("cookies.actions.confirm")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setShowPreferences(false)}
                    className="min-h-[44px]"
                  >
                    {t("cookies.actions.back")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export function to open cookie settings from footer (no reload)
export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent("open_cookie_settings"));
}

// Hook to check consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const record: ConsentRecord = JSON.parse(stored);
        setConsent(record.preferences);
      } catch {
        setConsent(null);
      }
    }

    const handleConsent = (e: CustomEvent<CookiePreferences>) => {
      setConsent(e.detail);
    };

    window.addEventListener("cookie_consent", handleConsent as EventListener);
    return () =>
      window.removeEventListener(
        "cookie_consent",
        handleConsent as EventListener
      );
  }, []);

  return consent;
}

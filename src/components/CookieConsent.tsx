// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Cookie, Shield, BarChart3, Megaphone, Settings2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import { Switch } from "@/components/ui/switch";

// interface CookiePreferences {
//   necessary: boolean;
//   analytics: boolean;
//   marketing: boolean;
//   functional: boolean;
// }

// interface ConsentRecord {
//   preferences: CookiePreferences;
//   timestamp: string;
//   version: string;
// }

// const COOKIE_CONSENT_KEY = "innoviaburst_cookie_consent";
// const CONSENT_VERSION = "1.0";

// // Event for reopening cookie settings without page reload
// const COOKIE_SETTINGS_EVENT = "open_cookie_settings";

// export function CookieConsent() {
//   const { t } = useTranslation();
//   const [isVisible, setIsVisible] = useState(false);
//   const [showPreferences, setShowPreferences] = useState(false);
//   const [preferences, setPreferences] = useState<CookiePreferences>({
//     necessary: true,
//     analytics: false,
//     marketing: false,
//     functional: false,
//   });

//   useEffect(() => {
//     const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
//     if (!stored) {
//       const timer = setTimeout(() => setIsVisible(true), 500);
//       return () => clearTimeout(timer);
//     } else {
//       try {
//         const record: ConsentRecord = JSON.parse(stored);
//         setPreferences(record.preferences);
//         applyConsent(record.preferences);
//       } catch {
//         localStorage.removeItem(COOKIE_CONSENT_KEY);
//         setIsVisible(true);
//       }
//     }

//     // Listen for reopen event from footer "Cookie settings" button
//     const handleReopenSettings = () => {
//       setShowPreferences(true);
//       setIsVisible(true);
//     };
//     window.addEventListener(COOKIE_SETTINGS_EVENT, handleReopenSettings);
//     return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, handleReopenSettings);
//   }, []);

//   const applyConsent = (prefs: CookiePreferences) => {
//     // Only load analytics/marketing scripts if consent given
//     if (prefs.analytics) {
//       console.log("Analytics consent granted - scripts can load");
//     }
//     if (prefs.marketing) {
//       console.log("Marketing consent granted - scripts can load");
//     }
//     window.dispatchEvent(new CustomEvent("cookie_consent", { detail: prefs }));
//   };

//   const saveConsent = (prefs: CookiePreferences) => {
//     const record: ConsentRecord = {
//       preferences: prefs,
//       timestamp: new Date().toISOString(),
//       version: CONSENT_VERSION,
//     };
//     localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
//     applyConsent(prefs);
//     setIsVisible(false);
//     setShowPreferences(false);
//   };

//   const handleAcceptAll = () => {
//     saveConsent({ necessary: true, analytics: true, marketing: true, functional: true });
//   };

//   const handleRejectNonEssential = () => {
//     saveConsent({ necessary: true, analytics: false, marketing: false, functional: false });
//   };

//   const handleConfirmChoices = () => {
//     saveConsent(preferences);
//   };

//   if (!isVisible) return null;

//   return (
//     <div
//       className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in"
//       role="dialog"
//       aria-labelledby="cookie-banner-title"
//       aria-describedby="cookie-banner-desc"
//     >
//       <div className="container mx-auto max-w-3xl">
//         <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
//           {/* Main Banner */}
//           <div className="p-6">
//             <div className="flex items-start gap-4">
//               <div className="p-3 rounded-xl bg-accent/20 shrink-0" aria-hidden="true">
//                 <Cookie className="w-6 h-6 text-accent" />
//               </div>

//               <div className="flex-1 space-y-4">
//                 <div>
//                   <h2 id="cookie-banner-title" className="text-lg font-bold text-foreground mb-2">
//                     We use cookies
//                   </h2>
//                   <p id="cookie-banner-desc" className="text-sm text-muted-foreground">
//                     We use cookies to improve your experience and analyse site usage. Non-essential cookies are off by default.{" "}
//                     <Link to="/cookies" className="text-accent hover:underline font-medium">
//                       Read our cookie policy
//                     </Link>
//                   </p>
//                 </div>

//                 {/* Three Equal Buttons - ICO Compliant */}
//                 {!showPreferences && (
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <Button
//                       variant="hero"
//                       size="default"
//                       onClick={handleAcceptAll}
//                       className="flex-1 min-h-[44px]"
//                     >
//                       Accept all
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="default"
//                       onClick={handleRejectNonEssential}
//                       className="flex-1 min-h-[44px]"
//                     >
//                       Reject non-essential
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="default"
//                       onClick={() => setShowPreferences(true)}
//                       className="flex-1 min-h-[44px] gap-2"
//                     >
//                       <Settings2 className="w-4 h-4" />
//                       Manage preferences
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Preferences Panel */}
//           {showPreferences && (
//             <div className="border-t border-border p-6 bg-muted/30 space-y-6">
//               <h3 className="text-base font-semibold text-foreground">Cookie preferences</h3>

//               <div className="space-y-4">
//                 {/* Essential - Always On */}
//                 <div className="flex items-start justify-between gap-4 p-4 bg-card rounded-xl border border-border">
//                   <div className="flex items-start gap-3">
//                     <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
//                       <Shield className="w-4 h-4 text-secondary" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-foreground">Essential cookies</p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Required for the website to function. These cannot be disabled.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="shrink-0">
//                     <Switch
//                       checked={true}
//                       disabled
//                       aria-label="Essential cookies (always enabled)"
//                     />
//                   </div>
//                 </div>

//                 {/* Analytics */}
//                 <div className="flex items-start justify-between gap-4 p-4 bg-card rounded-xl border border-border">
//                   <div className="flex items-start gap-3">
//                     <div className="p-2 rounded-lg bg-accent/20 shrink-0">
//                       <BarChart3 className="w-4 h-4 text-accent" />
//                     </div>
//                     <div>
//                       <label htmlFor="analytics-toggle" className="text-sm font-semibold text-foreground cursor-pointer">
//                         Analytics cookies
//                       </label>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Help us understand how visitors use our site so we can improve it.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="shrink-0">
//                     <Switch
//                       id="analytics-toggle"
//                       checked={preferences.analytics}
//                       onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
//                       aria-label="Analytics cookies"
//                     />
//                   </div>
//                 </div>

//                 {/* Marketing */}
//                 <div className="flex items-start justify-between gap-4 p-4 bg-card rounded-xl border border-border">
//                   <div className="flex items-start gap-3">
//                     <div className="p-2 rounded-lg bg-primary/20 shrink-0">
//                       <Megaphone className="w-4 h-4 text-primary" />
//                     </div>
//                     <div>
//                       <label htmlFor="marketing-toggle" className="text-sm font-semibold text-foreground cursor-pointer">
//                         Marketing cookies
//                       </label>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Used to deliver relevant advertisements and track campaign effectiveness.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="shrink-0">
//                     <Switch
//                       id="marketing-toggle"
//                       checked={preferences.marketing}
//                       onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
//                       aria-label="Marketing cookies"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Confirm Choices */}
//               <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                 <Button
//                   variant="hero"
//                   size="default"
//                   onClick={handleConfirmChoices}
//                   className="flex-1 min-h-[44px]"
//                 >
//                   Confirm my choices
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="default"
//                   onClick={() => setShowPreferences(false)}
//                   className="min-h-[44px]"
//                 >
//                   Back
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Export function to open cookie settings from footer (no reload)
// export function openCookieSettings() {
//   window.dispatchEvent(new CustomEvent("open_cookie_settings"));
// }

// // Hook to check consent status
// export function useCookieConsent() {
//   const [consent, setConsent] = useState<CookiePreferences | null>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
//     if (stored) {
//       try {
//         const record: ConsentRecord = JSON.parse(stored);
//         setConsent(record.preferences);
//       } catch {
//         setConsent(null);
//       }
//     }

//     const handleConsent = (e: CustomEvent<CookiePreferences>) => {
//       setConsent(e.detail);
//     };

//     window.addEventListener("cookie_consent", handleConsent as EventListener);
//     return () => window.removeEventListener("cookie_consent", handleConsent as EventListener);
//   }, []);

//   return consent;
// }

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cookie, Shield, BarChart3, Megaphone, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        "relative inline-flex h-10 w-16 items-center justify-center p-1",
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
      <span
        className={[
          "absolute inset-y-0 flex items-center text-[10px] font-semibold tracking-wide",
          "text-muted-foreground select-none",
          // logical positioning (start/end) for RTL/LTR
          "start-2",
          checked ? "opacity-0" : "opacity-100",
          "transition-opacity",
        ].join(" ")}
      >
        OFF
      </span>
      <span
        className={[
          "absolute inset-y-0 flex items-center text-[10px] font-semibold tracking-wide",
          checked ? "text-foreground/80" : "text-muted-foreground",
          "select-none",
          "end-2",
          checked ? "opacity-100" : "opacity-0",
          "transition-opacity",
        ].join(" ")}
      >
        ON
      </span>

      {/* thumb */}
      <span
        className={[
          "absolute top-1 start-1 h-8 w-8",
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
    if (prefs.analytics)
      console.log("Analytics consent granted - scripts can load");
    if (prefs.marketing)
      console.log("Marketing consent granted - scripts can load");

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
      <div className="w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border shadow-2xl">
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
                    We use cookies
                  </h2>
                  <p
                    id="cookie-banner-desc"
                    className="text-sm text-muted-foreground"
                  >
                    We use cookies to improve your experience and analyse site
                    usage. Non-essential cookies are off by default.{" "}
                    <Link
                      to="/cookies"
                      className="text-accent hover:underline font-medium"
                    >
                      Read our cookie policy
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
                    Accept all
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleRejectNonEssential}
                    className="flex-1 min-h-[44px] whitespace-nowrap"
                  >
                    Reject non-essential
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 min-h-[44px] gap-2 whitespace-nowrap"
                  >
                    <Settings2 className="w-4 h-4" />
                    <span className="hidden xs:inline">Manage</span> preferences
                  </Button>
                </div>
              )}
            </div>

            {/* Preferences Panel */}
            {showPreferences && (
              <div className="mt-5 border-t border-border pt-5 space-y-6">
                <h3 className="text-base font-semibold text-foreground">
                  Cookie preferences
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
                          Essential cookies
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Required for the website to function. These cannot be
                          disabled.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <PreferenceToggle
                        checked={true}
                        disabled
                        ariaLabel="Essential cookies (always enabled)"
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
                          Functional cookies
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enable helpful features and preferences to improve
                          usability.
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
                        ariaLabel="Functional cookies"
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
                          Analytics cookies
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Help us understand how visitors use our site so we can
                          improve it.
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
                        ariaLabel="Analytics cookies"
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
                          Marketing cookies
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Used to deliver relevant advertisements and track
                          campaign effectiveness.
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
                        ariaLabel="Marketing cookies"
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
                    Confirm my choices
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => setShowPreferences(false)}
                    className="min-h-[44px]"
                  >
                    Back
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

import { useEffect, useRef, useId, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNewsletterSignup,
  NEWSLETTER_CONSENT_TEXT,
  NEWSLETTER_CONSENT_TEXT_SHORT,
  type NewsletterPlacement,
} from "@/hooks/useNewsletterSignup";

interface NewsletterFormProps {
  /** Placement determines styling variant */
  placement: NewsletterPlacement;
  /** Optional lead magnet being offered */
  leadMagnet?: string;
  /** Use short consent text */
  shortConsent?: boolean;
  /** Show name field */
  showName?: boolean;
  /** Custom headline */
  headline?: string;
  /** Custom description */
  description?: string;
  /** Custom button text */
  buttonText?: string;
  /** Additional className for container */
  className?: string;
}

// Analytics helper for view tracking
function fireAnalyticsEvent(
  eventName: string,
  properties: Record<string, unknown>
) {
  window.dispatchEvent(
    new CustomEvent("analytics", {
      detail: { event: eventName, ...properties },
    })
  );
}

export function NewsletterForm({
  placement,
  leadMagnet,
  shortConsent = false,
  showName = false,
  headline,
  description,
  buttonText = "",
  className = "",
}: NewsletterFormProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const hasTrackedView = useRef(false);

  // Generate unique IDs for accessibility
  const formId = useId();
  const emailId = `${formId}-email`;
  const nameId = `${formId}-name`;
  const consentId = `${formId}-consent`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;

  const consentText = shortConsent
    ? t("newsletter.consent.short") || NEWSLETTER_CONSENT_TEXT_SHORT
    : t("newsletter.consent.full") || NEWSLETTER_CONSENT_TEXT;

  const { formData, setFormData, isLoading, isSuccess, error, submit, reset } =
    useNewsletterSignup({
      placement,
      leadMagnet,
      consentText,
    });

  // Track form view when it enters viewport
  useEffect(() => {
    if (hasTrackedView.current || !formRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fireAnalyticsEvent("newsletter_form_view", { placement });
          hasTrackedView.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [placement]);

  // Track focus on email input
  const handleEmailFocus = () => {
    fireAnalyticsEvent("newsletter_form_focus", { placement });
  };

  // Default content by placement
  const defaultContent = useMemo(
    () => ({
      footer: {
        headline: t("newsletter.default.footer.headline"),
        description: t("newsletter.default.footer.description"),
      },
      inline: {
        headline: t("newsletter.default.inline.headline"),
        description: t("newsletter.default.inline.description"),
      },
      library: {
        headline: t("newsletter.default.library.headline"),
        description: t("newsletter.default.library.description"),
      },
      "trust-sidebar": {
        headline: t("newsletter.default.trustSidebar.headline"),
        description: t("newsletter.default.trustSidebar.description"),
      },
    }),
    [t]
  );

  const content = {
    headline: headline || defaultContent[placement].headline,
    description: description || defaultContent[placement].description,
  };

  // Success state
  if (isSuccess) {
    return (
      <div
        className={`newsletter-form newsletter-form--${placement} ${className}`}
        role="status"
        aria-live="polite"
        id={successId}
      >
        <div
          className={`flex items-start gap-3 ${
            placement === "footer" ? "text-background" : "text-foreground"
          }`}
        >
          <CheckCircle
            className="w-5 h-5 text-accent shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold">{t("newsletter.success.title")}</p>
            <p
              className={`text-sm ${
                placement === "footer"
                  ? "text-background/70"
                  : "text-muted-foreground"
              }`}
            >
              {t("newsletter.success.description")}
            </p>
            <button
              type="button"
              onClick={reset}
              className={`text-sm underline underline-offset-4 hover:no-underline ${
                placement === "footer"
                  ? "text-background/70 hover:text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("newsletter.success.subscribeAnother")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Footer variant - compact horizontal layout
  if (placement === "footer") {
    return (
      <form
        ref={formRef}
        onSubmit={submit}
        className={`newsletter-form newsletter-form--footer space-y-4 ${className}`}
        aria-label={t("newsletter.aria.label")}
        noValidate
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-background">{content.headline}</h4>
          <p className="text-sm text-background/70">{content.description}</p>
        </div>

        <div className="space-y-3">
          {/* Email input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor={emailId} className="sr-only">
                {t("newsletter.fields.emailLabel")}
              </label>
              <input
                ref={emailInputRef}
                id={emailId}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                onFocus={handleEmailFocus}
                placeholder={t("newsletter.fields.emailPlaceholder")}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-background/60 focus:border-transparent disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              size="default"
              disabled={isLoading}
              className="min-h-[44px] gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>{t("newsletter.cta.subscribing")}</span>
                </>
              ) : (
                <>
                  <span>{buttonText || t("newsletter.cta.subscribe")}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>

          {/* Consent checkbox */}
          {/* Consent checkbox */}
          <div className="pt-1">
            <label
              htmlFor={consentId}
              className="flex items-start gap-2 cursor-pointer select-none"
            >
              {/* 24×24 hit area (good UX) but checkbox stays 16×16 visually */}
              <span className="-mt-2.5 inline-flex h-6 w-6 items-start justify-start shrink-0 ">
                <input
                  id={consentId}
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consent: e.target.checked,
                    }))
                  }
                  disabled={isLoading}
                  className={[
                    "h-4 w-4",
                    "rounded-sm border border-background/30 bg-background/10",
                    "text-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/60 focus-visible:ring-offset-0",
                    "disabled:opacity-50",
                  ].join(" ")}
                />
              </span>

              <span className="text-xs leading-snug text-background/70 ">
                {t("newsletter.consent.short")}{" "}
                <Link
                  to="/privacy"
                  className="underline underline-offset-2 hover:text-background"
                >
                  {t("newsletter.consent.linkLabel")}
                </Link>
              </span>
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div
              id={errorId}
              role="alert"
              className="flex items-start gap-2 text-sm text-orange-light"
            >
              <AlertCircle
                className="w-4 h-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}
        </div>
      </form>
    );
  }

  // Inline/Library/Trust-sidebar variant - card-style layout
  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className={`newsletter-form newsletter-form--${placement} p-6 bg-card rounded-2xl border border-border shadow-card ${className}`}
      aria-label={t("newsletter.aria.label")}
      noValidate
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-accent/20 shrink-0">
            <Mail className="w-5 h-5 text-accent" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">
              {content.headline}
            </h3>
            <p className="text-sm text-muted-foreground">
              {content.description}
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-3">
          {/* Name field (optional) */}
          {showName && (
            <div>
              <label htmlFor={nameId} className="sr-only">
                {t("newsletter.fields.nameLabel")}
              </label>
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("newsletter.fields.namePlaceholder")}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label htmlFor={emailId} className="sr-only">
              {t("newsletter.fields.emailLabel")}
            </label>
            <input
              ref={emailInputRef}
              id={emailId}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              onFocus={handleEmailFocus}
              placeholder={t("newsletter.fields.emailPlaceholder")}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Consent checkbox */}

          {/* Error message */}
          {error && (
            <div
              id={errorId}
              role="alert"
              className="flex items-start gap-2 text-sm text-destructive"
            >
              <AlertCircle
                className="w-4 h-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isLoading}
            className="w-full min-h-[44px] gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>{t("newsletter.cta.subscribing")}</span>
              </>
            ) : (
              <>
                <span>{buttonText || t("newsletter.cta.subscribe")}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

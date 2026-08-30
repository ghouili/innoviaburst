import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { submitLead } from "@/lib/submit-lead";

// Consent configuration - update version when consent text changes
export const NEWSLETTER_CONSENT_VERSION = "1.0";

export const NEWSLETTER_CONSENT_TEXT = 
  "I agree to receive occasional marketing emails from InnoviaBurst about automation insights, new templates, and service updates. Unsubscribe anytime.";

export const NEWSLETTER_CONSENT_TEXT_SHORT = 
  "Send me automation tips and updates. Unsubscribe anytime.";

export type NewsletterPlacement = "footer" | "inline" | "library" | "trust-sidebar";

export interface NewsletterFormData {
  email: string;
  name?: string;
  consent: boolean;
}

export interface NewsletterSubmitData extends NewsletterFormData {
  placement: NewsletterPlacement;
  leadMagnet?: string;
  consentVersion: string;
  consentText: string;
  sourcePath: string;
}

export interface UseNewsletterSignupOptions {
  placement: NewsletterPlacement;
  leadMagnet?: string;
  consentText?: string;
}

export interface UseNewsletterSignupReturn {
  formData: NewsletterFormData;
  setFormData: React.Dispatch<React.SetStateAction<NewsletterFormData>>;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  errorType: string | null;
  submit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Analytics helper
function fireAnalyticsEvent(eventName: string, properties: Record<string, unknown>) {
  window.dispatchEvent(
    new CustomEvent("analytics", {
      detail: { event: eventName, ...properties },
    })
  );
}

export function useNewsletterSignup({
  placement,
  leadMagnet,
  consentText = NEWSLETTER_CONSENT_TEXT,
}: UseNewsletterSignupOptions): UseNewsletterSignupReturn {
  const { t } = useTranslation();
  const location = useLocation();
  
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: "",
    name: "",
    consent: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFormData({ email: "", name: "", consent: false });
    setIsSuccess(false);
    setError(null);
    setErrorType(null);
  }, []);

  const validate = useCallback((): string | null => {
    if (!formData.email.trim()) {
      return t("newsletter.errors.emailRequired");
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      return t("newsletter.errors.emailInvalid");
    }
    if (!formData.consent) {
      return t("newsletter.errors.consentRequired");
    }
    return null;
  }, [formData.email, formData.consent, t]);

  const submit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validate
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setErrorType("validation");
      fireAnalyticsEvent("newsletter_form_error", {
        placement,
        errorType: "validation",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setErrorType(null);

    // Fire submit event
    fireAnalyticsEvent("newsletter_form_submit", {
      placement,
      leadMagnet,
    });

    const submitData: NewsletterSubmitData = {
      ...formData,
      placement,
      leadMagnet,
      consentVersion: NEWSLETTER_CONSENT_VERSION,
      consentText,
      sourcePath: location.pathname,
    };

    const result = await submitLead({
      type: "newsletter",
      email: submitData.email.trim(),
      name: submitData.name?.trim() || undefined,
      consent: submitData.consent,
      consentVersion: submitData.consentVersion,
      consentText: submitData.consentText,
      source: submitData.placement,
      extra: { leadMagnet: submitData.leadMagnet, sourcePath: submitData.sourcePath },
    });

    if (result.ok) {
      setIsSuccess(true);
      fireAnalyticsEvent("newsletter_form_success", {
        placement,
        requiresConfirmation: true, // Assuming double opt-in
      });
    } else {
      // Every failure is shown. This used to fake success on a network error,
      // which meant a subscriber who never subscribed saw a confirmation.
      setError(t("newsletter.errors.generic"));
      setErrorType(result.reason);
      fireAnalyticsEvent("newsletter_form_error", {
        placement,
        errorType: result.reason,
      });
    }

    setIsLoading(false);
  }, [formData, validate, placement, leadMagnet, consentText, location.pathname, t]);

  return {
    formData,
    setFormData,
    isLoading,
    isSuccess,
    error,
    errorType,
    submit,
    reset,
  };
}

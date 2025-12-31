import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

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
      return "Please enter your email address.";
    }
    if (!EMAIL_REGEX.test(formData.email)) {
      return "That doesn't look like a valid email.";
    }
    if (!formData.consent) {
      return "Please agree to receive emails to continue.";
    }
    return null;
  }, [formData.email, formData.consent]);

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

    try {
      // TODO: Replace with actual API endpoint
      // For now, simulate API call
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "server_error");
      }

      // const result = await response.json();
      
      setIsSuccess(true);
      fireAnalyticsEvent("newsletter_form_success", {
        placement,
        requiresConfirmation: true, // Assuming double opt-in
      });
    } catch (err) {
      // For demo: simulate success since API doesn't exist yet
      // Remove this block when API is implemented
      if (err instanceof TypeError && err.message.includes("fetch")) {
        // Network error / no API - simulate success for development
        console.log("[Newsletter] Simulated success (API not implemented)", submitData);
        setIsSuccess(true);
        fireAnalyticsEvent("newsletter_form_success", {
          placement,
          requiresConfirmation: true,
        });
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "server_error";
      
      let userMessage = "Something went wrong. Please try again.";
      if (errorMessage === "already_subscribed") {
        userMessage = "You're already on the list!";
      } else if (errorMessage === "invalid_email") {
        userMessage = "Please enter a valid email address.";
      }
      
      setError(userMessage);
      setErrorType(errorMessage);
      
      fireAnalyticsEvent("newsletter_form_error", {
        placement,
        errorType: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validate, placement, leadMagnet, consentText, location.pathname]);

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

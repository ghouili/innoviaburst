import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, CalendarClock, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, SuccessState } from "@/components/ui/modal-primitives";
import { cn } from "@/lib/utils";
import { trackLpConversion } from "@/lib/lp-tracking";

interface LpScopeFormProps {
  /** Primary submit label (campaign-driven). */
  submitLabel: string;
  /** Opens the "Book a 15-min call" flow. */
  onBookCall: () => void;
  /** Active A/B variant id — attached to the conversion event. */
  variant: string;
  /** Where on the page this instance lives (hero | final) — unique ids + tracking. */
  placement: string;
  /** Hide the form's own title/subtitle (e.g. when a section heading already frames it). */
  showHeader?: boolean;
  className?: string;
}

interface Errors {
  name?: string;
  email?: string;
  building?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_ORDER: (keyof Errors)[] = ["name", "email", "building"];

/**
 * The landing page's PRIMARY conversion surface: a short inline form
 * (Name · Work email · What are you building?) that submits to a free 48h scope.
 * On success it fires a consent-gated `lead_submit` conversion and offers the
 * secondary "book a call" path.
 */
export function LpScopeForm({
  submitLabel,
  onBookCall,
  variant,
  placement,
  showHeader = true,
  className,
}: LpScopeFormProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", building: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const successRef = useRef<HTMLDivElement | null>(null);

  const idFor = (field: string) => `lp-scope-${placement}-${field}`;
  const errIdFor = (field: string) => `${idFor(field)}-error`;

  // Announce + move focus to the success confirmation (WCAG 4.1.3 / 2.4.3).
  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const validate = (v = values): Errors => {
    const next: Errors = {};
    if (!v.name.trim()) next.name = t("lpMvp.form.errors.name");
    if (!v.email.trim() || !EMAIL_RE.test(v.email.trim())) next.email = t("lpMvp.form.errors.email");
    if (!v.building.trim()) next.building = t("lpMvp.form.errors.building");
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return; // re-entrancy guard
    const next = validate();
    setErrors(next);
    setTouched({ name: true, email: true, building: true });
    if (Object.keys(next).length > 0) {
      const first = FIELD_ORDER.find((f) => next[f]);
      if (first) document.getElementById(idFor(first))?.focus();
      return;
    }

    setSubmitError(false);
    setSubmitting(true);
    try {
      // Simulate the scope-request API (stubbed like the rest of the site).
      await new Promise((resolve) => setTimeout(resolve, 900));
      // Consent-gated conversion — fires only AFTER a successful submit.
      trackLpConversion("lead_submit", { variant, placement });
      setDone(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (field: keyof typeof values, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors(validate(next));
  };

  const inputClasses = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/60",
      "min-h-[48px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
      hasError ? "border-destructive" : "border-border",
    );

  if (done) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-2xl border border-border bg-card p-6 shadow-card outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8",
          className,
        )}
      >
        <SuccessState
          title={t("lpMvp.form.success.title")}
          description={t("lpMvp.form.success.body")}
          actions={
            <Button variant="hero" size="lg" className="min-h-[48px]" onClick={onBookCall}>
              <CalendarClock className="mr-2 h-4 w-4" aria-hidden="true" />
              {t("lpMvp.form.success.cta")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card sm:p-7",
        className,
      )}
    >
      {showHeader && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">{t("lpMvp.form.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("lpMvp.form.subtitle")}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label={t("lpMvp.form.name")}
          htmlFor={idFor("name")}
          required
          error={errors.name}
          touched={touched.name}
        >
          <input
            id={idFor("name")}
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            className={inputClasses(!!errors.name && !!touched.name)}
            placeholder={t("lpMvp.form.namePlaceholder")}
            aria-invalid={!!errors.name && !!touched.name}
            aria-describedby={errors.name && touched.name ? errIdFor("name") : undefined}
          />
        </FormField>

        <FormField
          label={t("lpMvp.form.email")}
          htmlFor={idFor("email")}
          required
          error={errors.email}
          touched={touched.email}
        >
          <input
            id={idFor("email")}
            type="email"
            autoComplete="email"
            required
            aria-required="true"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            className={inputClasses(!!errors.email && !!touched.email)}
            placeholder={t("lpMvp.form.emailPlaceholder")}
            aria-invalid={!!errors.email && !!touched.email}
            aria-describedby={errors.email && touched.email ? errIdFor("email") : undefined}
          />
        </FormField>

        <FormField
          label={t("lpMvp.form.building")}
          htmlFor={idFor("building")}
          required
          error={errors.building}
          touched={touched.building}
        >
          <textarea
            id={idFor("building")}
            rows={3}
            required
            aria-required="true"
            value={values.building}
            onChange={(e) => setField("building", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, building: true }))}
            className={cn(inputClasses(!!errors.building && !!touched.building), "min-h-[88px] resize-none")}
            placeholder={t("lpMvp.form.buildingPlaceholder")}
            aria-invalid={!!errors.building && !!touched.building}
            aria-describedby={errors.building && touched.building ? errIdFor("building") : undefined}
          />
        </FormField>

        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={submitting}
          className="w-full min-h-[52px] text-base"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              {t("lpMvp.form.submitting")}
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

        {submitError && (
          <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive-strong">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t("lpMvp.form.errors.submit")}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBookCall}
            className="rounded text-sm font-semibold text-secondary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("lpMvp.form.secondary")}
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span>
              {t("lpMvp.form.consent")}{" "}
              <Link to="/privacy" className="font-medium text-accent-strong underline-offset-2 hover:underline">
                {t("lpMvp.form.privacyLink")}
              </Link>
            </span>
          </span>
        </div>
      </form>
    </div>
  );
}

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CalendarDays, Handshake, Send, Info, Bot, Code2, Workflow, Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FormField,
  LoadingButton,
  SuccessState,
  CheckCardGroup,
  TrustBadge,
} from "@/components/ui/modal-primitives";
import { useToast } from "@/hooks/use-toast";

/**
 * Training enquiry modal, one component in two modes.
 *
 * `booking`  - a company asking for training dates.
 * `partner`  - a training centre applying to co-deliver.
 *
 * One component rather than two because the shell, validation, submit path and
 * success state are identical; only the field set and the payload label differ.
 *
 * Submission deliberately matches RequestModal/BookingModal: fire the shared
 * `analytics` CustomEvent, await the stubbed call, show the success state, and
 * fall back to the destructive toast on failure. There is no backend on this
 * branch, so inventing an endpoint here would be a lie the rest of the site
 * doesn't tell. The payload carries `type` so a submission reads unambiguously
 * as a booking request or a partner application once a real endpoint lands.
 */

export type TrainingModalMode = "booking" | "partner";

interface Props {
  isOpen: boolean;
  mode: TrainingModalMode;
  onClose: () => void;
}

interface Errors {
  name?: string;
  email?: string;
  company?: string;
  organization?: string;
  tracks?: string;
  delivers?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TrainingRequestModal({ isOpen, mode, onClose }: Props) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const uid = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const empty = useMemo(
    () => ({
      name: "",
      email: "",
      company: "",
      organization: "",
      tracks: [] as string[],
      format: "",
      teamSize: "",
      dateFirst: "",
      dateSecond: "",
      dateThird: "",
      timeframe: "",
      notes: "",
      delivers: "",
      accreditations: "",
      message: "",
    }),
    [],
  );
  const [form, setForm] = useState(empty);

  // Local calendar date, so "today" matches what the user sees in the picker
  // rather than a UTC day that can be off by one either side of midnight.
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  // Reset whenever the modal opens, or the caller switches mode while open, so
  // a partner application never inherits a half-typed booking.
  useEffect(() => {
    if (!isOpen) return;
    setForm(empty);
    setErrors({});
    setTouched({});
    setDone(false);
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [isOpen, mode, empty]);

  const copy = t(`trainingPage.forms.${mode}`, { returnObjects: true }) as Record<string, string | string[]>;
  const f = t("trainingPage.forms.fields", { returnObjects: true }) as Record<string, string>;
  const err = t("trainingPage.forms.errors", { returnObjects: true }) as Record<string, string>;
  const trackOptions = t("trainingPage.forms.trackOptions", { returnObjects: true }) as string[];
  const TRACK_ICONS = [Bot, Code2, Workflow, Scale];
  const trackCards = trackOptions.map((label, i) => {
    const TrackIcon = TRACK_ICONS[i] ?? Bot;
    return { value: label, label, icon: <TrackIcon className="h-4 w-4" aria-hidden="true" /> };
  });
  const formatOptions = t("trainingPage.forms.formatOptions", { returnObjects: true }) as string[];

  // Editing a field clears its error immediately rather than leaving a stale
  // "this is required" under a field the user has just filled in. Validation
  // itself still runs on submit, same as RequestModal.
  const set = <K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (key in prev ? { ...prev, [key]: undefined } : prev));
  };

  const toggleTrack = (track: string) => {
    setForm((prev) => ({
      ...prev,
      tracks: prev.tracks.includes(track) ? prev.tracks.filter((x) => x !== track) : [...prev.tracks, track],
    }));
    setErrors((prev) => ({ ...prev, tracks: undefined }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.email.trim()) next.email = err.emailRequired;
    else if (!EMAIL_RE.test(form.email)) next.email = err.emailInvalid;

    if (mode === "booking") {
      if (!form.name.trim()) next.name = err.nameRequired;
      if (!form.company.trim()) next.company = err.companyRequired;
      if (form.tracks.length === 0) next.tracks = err.tracksRequired;
    } else {
      if (!form.organization.trim()) next.organization = err.organizationRequired;
      if (!form.name.trim()) next.name = err.nameRequired;
      if (!form.delivers.trim()) next.delivers = err.deliversRequired;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, company: true, organization: true, tracks: true, delivers: true });
    if (!validate()) return;

    setSubmitting(true);
    try {
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: {
            event: "training_enquiry",
            // Labels the payload so a submission reads as one or the other.
            type: mode === "booking" ? "training_booking_request" : "training_partner_application",
            tracks: form.tracks,
            format: form.format || undefined,
            teamSize: form.teamSize || undefined,
            preferredDates: [form.dateFirst, form.dateSecond, form.dateThird].filter(Boolean),
          },
        }),
      );

      // Same stubbed call the other modals use until a real endpoint exists.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDone(true);
    } catch {
      toast({
        title: t("request.toast.errorTitle"),
        description: t("request.toast.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (key: keyof Errors) => ({
    "aria-invalid": errors[key] && touched[key] ? true : undefined,
    "aria-describedby": errors[key] && touched[key] ? `${uid}-${key}-error` : undefined,
    onBlur: () => setTouched((p) => ({ ...p, [key]: true })),
  });

  const Icon = mode === "booking" ? CalendarDays : Handshake;

  // Small uppercase group label with a hairline divider, so a long form reads
  // as three short ones.
  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto [scrollbar-gutter:stable]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-blue">
              <Icon className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </span>
            {copy.title as string}
          </DialogTitle>
          <DialogDescription>{copy.description as string}</DialogDescription>
        </DialogHeader>

        {done ? (
          <SuccessState
            title={copy.successTitle as string}
            description={copy.successBody as string}
            details={copy.successDetails as string[]}
            actions={
              <div className="flex w-full flex-col items-center gap-5">
                <TrustBadge items={(copy.trustBadges as string[]) ?? []} />
                <Button variant="hero-outline" onClick={onClose}>
                  {t("trainingPage.forms.close")}
                </Button>
              </div>
            }
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {mode === "booking" ? (
              <>
                <GroupLabel>{t("trainingPage.forms.groups.about")}</GroupLabel>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label={f.name} htmlFor={`${uid}-name`} required error={errors.name} touched={touched.name}>
                    <Input
                      id={`${uid}-name`}
                      ref={firstFieldRef}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                      {...fieldProps("name")}
                    />
                  </FormField>
                  <FormField label={f.workEmail} htmlFor={`${uid}-email`} required error={errors.email} touched={touched.email}>
                    <Input
                      id={`${uid}-email`}
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      autoComplete="email"
                      {...fieldProps("email")}
                    />
                  </FormField>
                </div>

                <FormField label={f.company} htmlFor={`${uid}-company`} required error={errors.company} touched={touched.company}>
                  <Input
                    id={`${uid}-company`}
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                    autoComplete="organization"
                    {...fieldProps("company")}
                  />
                </FormField>

                <GroupLabel>{t("trainingPage.forms.groups.what")}</GroupLabel>

                {/* Multi-select cards rather than bare checkbox rows: same
                    affordance as RadioCardGroup elsewhere, 44px+ targets. */}
                <div>
                  <p className="block text-sm font-semibold text-foreground">
                    {f.tracks}
                    <span className="text-destructive ml-0.5">*</span>
                  </p>
                  <p className="mt-1 mb-3 text-xs text-muted-foreground">{f.tracksHint}</p>
                  <CheckCardGroup
                    name={f.tracks}
                    options={trackCards}
                    values={form.tracks}
                    onToggle={toggleTrack}
                    columns={2}
                    invalid={!!(errors.tracks && touched.tracks)}
                    describedBy={errors.tracks && touched.tracks ? `${uid}-tracks-error` : undefined}
                  />
                  {errors.tracks && touched.tracks && (
                    <p id={`${uid}-tracks-error`} className="mt-2 text-xs text-destructive-strong">
                      {errors.tracks}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label={f.format} htmlFor={`${uid}-format`}>
                    <select
                      id={`${uid}-format`}
                      value={form.format}
                      onChange={(e) => set("format", e.target.value)}
                      className="flex h-10 min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">{f.format}</option>
                      {formatOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label={f.teamSize} htmlFor={`${uid}-size`} hint={f.teamSizeHint}>
                    <Input
                      id={`${uid}-size`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={form.teamSize}
                      onChange={(e) => set("teamSize", e.target.value)}
                    />
                  </FormField>
                </div>

                <GroupLabel>{t("trainingPage.forms.groups.when")}</GroupLabel>

                {/* Preferred dates: native date inputs, no calendar library.
                    The request-not-availability caveat is a visible callout
                    rather than a grey hint, because it sets the expectation the
                    whole booking model depends on. */}
                <div>
                  <p className="block text-sm font-semibold text-foreground">{f.dates}</p>
                  <div className="mt-2 flex items-start gap-2.5 rounded-xl bg-accent/10 p-3.5">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />
                    <p className="text-xs leading-relaxed text-foreground">{f.datesCallout}</p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {(
                      [
                        ["dateFirst", f.dateFirst],
                        ["dateSecond", f.dateSecond],
                        ["dateThird", f.dateThird],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`${uid}-${key}`} className="font-normal">
                          {label}
                        </Label>
                        <Input
                          id={`${uid}-${key}`}
                          type="date"
                          min={today}
                          value={form[key]}
                          onChange={(e) => set(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <FormField label={f.timeframe} htmlFor={`${uid}-timeframe`} hint={f.timeframeHint}>
                  <Input
                    id={`${uid}-timeframe`}
                    value={form.timeframe}
                    onChange={(e) => set("timeframe", e.target.value)}
                  />
                </FormField>

                <FormField label={f.notes} htmlFor={`${uid}-notes`} hint={f.notesHint}>
                  <Textarea
                    id={`${uid}-notes`}
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                  />
                </FormField>
              </>
            ) : (
              <>
                <GroupLabel>{t("trainingPage.forms.groups.organisation")}</GroupLabel>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label={f.organization}
                    htmlFor={`${uid}-org`}
                    required
                    error={errors.organization}
                    touched={touched.organization}
                  >
                    <Input
                      id={`${uid}-org`}
                      ref={firstFieldRef}
                      value={form.organization}
                      onChange={(e) => set("organization", e.target.value)}
                      autoComplete="organization"
                      {...fieldProps("organization")}
                    />
                  </FormField>
                  <FormField label={f.contactName} htmlFor={`${uid}-contact`} required error={errors.name} touched={touched.name}>
                    <Input
                      id={`${uid}-contact`}
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      autoComplete="name"
                      {...fieldProps("name")}
                    />
                  </FormField>
                </div>

                <FormField label={f.email} htmlFor={`${uid}-pemail`} required error={errors.email} touched={touched.email}>
                  <Input
                    id={`${uid}-pemail`}
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    {...fieldProps("email")}
                  />
                </FormField>

                <GroupLabel>{t("trainingPage.forms.groups.delivery")}</GroupLabel>

                <FormField
                  label={f.delivers}
                  htmlFor={`${uid}-delivers`}
                  required
                  hint={f.deliversHint}
                  error={errors.delivers}
                  touched={touched.delivers}
                >
                  <Textarea
                    id={`${uid}-delivers`}
                    rows={3}
                    value={form.delivers}
                    onChange={(e) => set("delivers", e.target.value)}
                    {...fieldProps("delivers")}
                  />
                </FormField>

                <FormField label={f.accreditations} htmlFor={`${uid}-accred`} hint={f.accreditationsHint}>
                  <Input
                    id={`${uid}-accred`}
                    value={form.accreditations}
                    onChange={(e) => set("accreditations", e.target.value)}
                  />
                </FormField>

                <div>
                  <p className="block text-sm font-semibold text-foreground">{f.coDeliverTracks}</p>
                  <p className="mt-1 mb-3 text-xs text-muted-foreground">{f.tracksHint}</p>
                  <CheckCardGroup
                    name={f.coDeliverTracks}
                    options={trackCards}
                    values={form.tracks}
                    onToggle={toggleTrack}
                    columns={2}
                  />
                </div>

                <FormField label={f.message} htmlFor={`${uid}-message`} hint={f.messageHint}>
                  <Textarea
                    id={`${uid}-message`}
                    rows={3}
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                  />
                </FormField>
              </>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("trainingPage.forms.consent")}{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
                {t("footer.links.privacy")}
              </Link>
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="hero-outline" onClick={onClose} className="sm:w-auto">
                {t("trainingPage.forms.close")}
              </Button>
              <LoadingButton
                type="submit"
                loading={submitting}
                loadingText={copy.submitting as string}
                icon={<Send className="h-4 w-4" aria-hidden="true" />}
              >
                {copy.submit as string}
              </LoadingButton>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

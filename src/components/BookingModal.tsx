import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  CalendarPlus,
} from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Stepper,
  ModalHeader,
  FormField,
  NavigationButtons,
  SuccessState,
  TrustBadge,
} from "@/components/ui/modal-primitives";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Placeholder URL - replace with actual Calendly/Cal.com URL
const BOOKING_URL = "";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledAutomation?: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  goal: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

type FormStep = 1 | 2 | "success";

export function BookingModal({ isOpen, onClose, prefilledAutomation }: BookingModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    role: "",
    goal: prefilledAutomation || "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstStep2InputRef = useRef<HTMLInputElement>(null);

  // Move focus to the first field of a NEW step. Opening the modal is handled by
  // Radix (onOpenAutoFocus below), so no timer races the dialog's own focus.
  const focusedStep = useRef<FormStep>(step);
  useEffect(() => {
    if (!isOpen || focusedStep.current === step) {
      focusedStep.current = step;
      return;
    }
    focusedStep.current = step;
    if (step === 1) {
      nameInputRef.current?.focus();
    } else if (step === 2) {
      firstStep2InputRef.current?.focus();
    }
  }, [step, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        name: "",
        email: "",
        company: "",
        role: "",
        goal: prefilledAutomation || "",
        notes: "",
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen, prefilledAutomation]);

  // Update goal if prefilledAutomation changes
  useEffect(() => {
    if (prefilledAutomation) {
      setFormData(prev => ({ ...prev, goal: prefilledAutomation }));
    }
  }, [prefilledAutomation]);

  const validateStep1 = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("booking.errors.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("booking.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("booking.errors.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.email, t]);

  const handleNext = () => {
    setTouched({ name: true, email: true });
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Analytics event
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: {
            event: "booking_request",
            formData: {
              name: formData.name,
              email: formData.email,
              company: formData.company,
              role: formData.role,
              hasGoal: !!formData.goal,
            },
          },
        })
      );

      // Simulate API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep("success");
    } catch {
      toast({
        title: t("booking.toast.errorTitle"),
        description: t("booking.toast.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateStep1();
    }
  };

  const handleBlur = (field: string) => {
    // Only give live feedback on blur AFTER the user has already tried to submit
    // once. Validating on every blur made required-field errors appear the moment
    // you left an empty field on a freshly opened form, which reads as broken.
    if (!touched[field]) return;
    validateStep1();
  };

  const handleClose = () => {
    onClose();
  };

  const invalid = (hasError: boolean) => cn(hasError && "border-destructive");

  const stepFields =
    step === 1 ? (
      <div className="space-y-5">
        <FormField
          label={t("booking.fields.nameLabel")}
          htmlFor="booking-name"
          required
          error={errors.name}
          touched={touched.name}
        >
          <Input
            ref={nameInputRef}
            id="booking-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={invalid(!!errors.name && !!touched.name)}
            placeholder={t("booking.fields.namePlaceholder")}
            aria-invalid={errors.name && touched.name ? "true" : "false"}
            aria-describedby={errors.name ? "booking-name-error" : undefined}
          />
        </FormField>

        <FormField
          label={t("booking.fields.emailLabel")}
          htmlFor="booking-email"
          required
          error={errors.email}
          touched={touched.email}
        >
          <Input
            id="booking-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={invalid(!!errors.email && !!touched.email)}
            placeholder={t("booking.fields.emailPlaceholder")}
            aria-invalid={errors.email && touched.email ? "true" : "false"}
            aria-describedby={errors.email ? "booking-email-error" : undefined}
          />
        </FormField>

        {prefilledAutomation && (
          <div className="rounded-lg border border-secondary/20 bg-secondary/10 p-3">
            <p className="text-sm font-medium text-secondary">
              {t("booking.fields.interestedIn", { topic: prefilledAutomation })}
            </p>
          </div>
        )}
      </div>
    ) : (
      <div className="space-y-5">
        <FormField label={t("booking.fields.companyLabel")} htmlFor="booking-company" hint={t("common.optional", "Optional")}>
          <Input
            ref={firstStep2InputRef}
            id="booking-company"
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder={t("booking.fields.companyPlaceholder")}
          />
        </FormField>

        <FormField label={t("booking.fields.roleLabel")} htmlFor="booking-role" hint={t("common.optional", "Optional")}>
          <Input
            id="booking-role"
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            placeholder={t("booking.fields.rolePlaceholder")}
          />
        </FormField>

        <FormField label={t("booking.fields.goalLabel")} htmlFor="booking-goal" hint={t("common.optional", "Optional")}>
          <Textarea
            id="booking-goal"
            value={formData.goal}
            onChange={(e) => handleInputChange("goal", e.target.value)}
            rows={3}
            className="min-h-[80px] resize-none"
            placeholder={t("booking.fields.goalPlaceholder")}
          />
        </FormField>
      </div>
    );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        size="lg"
        onOpenAutoFocus={(event) => {
          // Land on the first field rather than the close button.
          if (step === 1 && nameInputRef.current) {
            event.preventDefault();
            nameInputRef.current.focus();
          }
        }}
      >
        {step === "success" ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{t("booking.success.title")}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <SuccessState
                title={t("booking.success.title")}
                description={t("booking.success.description")}
                details={t("booking.success.checklist", { returnObjects: true }) as string[]}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" size="lg" onClick={handleClose}>
                {t("booking.cta.back")}
              </Button>
              <Button variant="hero" size="lg" asChild>
                <a href="mailto:hello@innoviaburst.com">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  {t("booking.cta.addToCalendar")}
                </a>
              </Button>
            </DialogFooter>
          </>
        ) : BOOKING_URL ? (
          <>
            <ModalHeader
              icon={<Calendar className="h-6 w-6 text-accent" />}
              title={t("booking.title")}
              description={t("booking.description")}
            />
            <DialogBody className="pb-6">
              <iframe
                src={BOOKING_URL}
                className="h-[500px] w-full rounded-lg border border-border"
                title={t("booking.title")}
              />
            </DialogBody>
          </>
        ) : (
          <>
            <ModalHeader
              icon={<Calendar className="h-6 w-6 text-accent" />}
              title={t("booking.title")}
              description={t("booking.description")}
            />

            <DialogBody className="space-y-6">
              <Stepper
                currentStep={step as number}
                totalSteps={2}
                labels={[t("booking.stepper.step1"), t("booking.stepper.step2")]}
              />

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>{t("booking.benefits.duration")}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>{t("booking.benefits.timezone")}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-accent" />
                  <span>{t("booking.benefits.privacy")}</span>
                </div>
              </div>

              {stepFields}

              {step === 1 && (
                <div className="border-t border-border pt-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    {t("booking.whatNext.title")}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(t("booking.whatNext.steps", { returnObjects: true }) as string[]).map((label, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent-strong">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="border-t border-border pt-4">
                  <TrustBadge items={t("booking.trustBadges", { returnObjects: true }) as string[]} />
                </div>
              )}
            </DialogBody>

            <DialogFooter>
              {step === 1 ? (
                <NavigationButtons
                  onNext={handleNext}
                  showBack={false}
                  nextLabel={t("booking.cta.continue")}
                />
              ) : (
                <NavigationButtons
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  loading={isSubmitting}
                  showBack={true}
                  isLastStep={true}
                  submitLabel={t("booking.cta.submit")}
                />
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

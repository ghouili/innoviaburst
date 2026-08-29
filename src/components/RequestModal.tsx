import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Zap,
  Bot,
  Rocket,
  Sparkles,
  Clock,
  Shield,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  ModalHeader,
  FormField,
  NavigationButtons,
  SuccessState,
  TrustBadge,
  RadioCardGroup,
} from "@/components/ui/modal-primitives";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledInterest?: string;
  source?: string;
}

interface FormData {
  email: string;
  company: string;
  role: string;
  primaryGoal: string;
  tools: string[];
  timeline: string;
  notes: string;
}

interface FormErrors {
  email?: string;
  primaryGoal?: string;
}

const primaryGoalOptions = [
  {
    value: "reduce-ops",
    labelKey: "request.primaryGoals.reduceOps.title",
    descriptionKey: "request.primaryGoals.reduceOps.description",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: "lead-handling",
    labelKey: "request.primaryGoals.leadHandling.title",
    descriptionKey: "request.primaryGoals.leadHandling.description",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    value: "reporting",
    labelKey: "request.primaryGoals.reporting.title",
    descriptionKey: "request.primaryGoals.reporting.description",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    value: "ai-assistant",
    labelKey: "request.primaryGoals.aiAssistant.title",
    descriptionKey: "request.primaryGoals.aiAssistant.description",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    value: "mvp",
    labelKey: "request.primaryGoals.mvp.title",
    descriptionKey: "request.primaryGoals.mvp.description",
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    value: "custom",
    labelKey: "request.primaryGoals.custom.title",
    descriptionKey: "request.primaryGoals.custom.description",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const toolOptionsList = [
  { value: "HubSpot", translationKey: "request.toolOptions.hubspot" },
  { value: "Salesforce", translationKey: "request.toolOptions.salesforce" },
  { value: "Slack", translationKey: "request.toolOptions.slack" },
  { value: "Microsoft 365", translationKey: "request.toolOptions.microsoft365" },
  { value: "Google Workspace", translationKey: "request.toolOptions.googleWorkspace" },
  { value: "Notion", translationKey: "request.toolOptions.notion" },
  { value: "Airtable", translationKey: "request.toolOptions.airtable" },
  { value: "Zapier/Make", translationKey: "request.toolOptions.zapierMake" },
  { value: "Zendesk", translationKey: "request.toolOptions.zendesk" },
  { value: "Intercom", translationKey: "request.toolOptions.intercom" },
  { value: "Xero", translationKey: "request.toolOptions.xero" },
  { value: "QuickBooks", translationKey: "request.toolOptions.quickbooks" },
  { value: "Other", translationKey: "request.toolOptions.other" },
];

const timelineOptions = [
  { value: "urgent", labelKey: "request.timelineOptions.urgent" },
  { value: "soon", labelKey: "request.timelineOptions.soon" },
  { value: "planning", labelKey: "request.timelineOptions.planning" },
  { value: "exploring", labelKey: "request.timelineOptions.exploring" },
];

type FormStep = 1 | 2 | "success";

export function RequestModal({
  isOpen,
  onClose,
  prefilledInterest,
  source,
}: RequestModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    company: "",
    role: "",
    primaryGoal: "",
    tools: [],
    timeline: "",
    notes: prefilledInterest || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when opened
  useEffect(() => {
    if (isOpen && step === 1) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        email: "",
        company: "",
        role: "",
        primaryGoal: "",
        tools: [],
        timeline: "",
        notes: prefilledInterest || "",
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen, prefilledInterest]);

  // Update notes if prefilledInterest changes
  useEffect(() => {
    if (prefilledInterest) {
      setFormData((prev) => ({ ...prev, notes: prefilledInterest }));
    }
  }, [prefilledInterest]);

  const goalOptions = useMemo(
    () =>
      primaryGoalOptions.map((option) => ({
        ...option,
        label: t(option.labelKey),
        description: t(option.descriptionKey),
      })),
    [t]
  );

  const localizedTimelineOptions = useMemo(
    () => timelineOptions.map((option) => ({ ...option, label: t(option.labelKey) })),
    [t]
  );

  const localizedTools = useMemo(
    () =>
      toolOptionsList.map((tool) => ({
        ...tool,
        label: t(tool.translationKey),
      })),
    [t]
  );

  const successDetails = useMemo(
    () => t("request.success.details", { returnObjects: true }) as string[],
    [t]
  );

  const trustBadges = useMemo(
    () => t("request.trustBadges", { returnObjects: true }) as string[],
    [t]
  );

  const whatNextItems = useMemo(
    () => t("request.whatNext.items", { returnObjects: true }) as string[],
    [t]
  );

  const validateStep1 = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t("request.errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("request.errors.emailInvalid");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, t]);

  const validateStep2 = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = t("request.errors.primaryGoalRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.primaryGoal, t]);

  const handleNext = () => {
    setTouched({ email: true });
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setTouched((prev) => ({ ...prev, primaryGoal: true }));
    if (!validateStep2()) return;

    setIsSubmitting(true);

    try {
      // Analytics event
      window.dispatchEvent(
        new CustomEvent("analytics", {
          detail: {
            event: "lead_request",
            source: source || "modal",
            goal: formData.primaryGoal,
            interest: prefilledInterest,
          },
        })
      );

      // Simulate API call (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep("success");
    } catch {
      toast({
        title: t("request.toast.errorTitle"),
        description: t("request.toast.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const invalid = (hasError: boolean) => cn(hasError && "border-destructive");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        size="lg"
        onOpenAutoFocus={(event) => {
          // Land on the first field rather than the close button.
          if (step === 1 && emailInputRef.current) {
            event.preventDefault();
            emailInputRef.current.focus();
          }
        }}
      >
        {step === "success" ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>{t("request.success.title")}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <SuccessState
                title={t("request.success.title")}
                description={t("request.success.description")}
                details={successDetails}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" size="lg" onClick={handleClose}>
                {t("request.cta.backToSite")}
              </Button>
              <Button
                variant="hero"
                size="lg"
                onClick={() => {
                  handleClose();
                  // Trigger booking modal if available
                  window.dispatchEvent(new CustomEvent("openBookingModal"));
                }}
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                {t("request.cta.bookCall")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <ModalHeader
              icon={<FileText className="h-6 w-6 text-secondary" />}
              title={t("request.title")}
              description={t("request.description")}
            />

            <DialogBody className="space-y-6">
              <Stepper
                currentStep={step as number}
                totalSteps={2}
                labels={[t("request.stepper.step1"), t("request.stepper.step2")]}
              />

              {step === 1 ? (
                /* Step 1: Contact Info */
                <div className="space-y-5">
                  <FormField
                    label={t("request.fields.emailLabel")}
                    htmlFor="request-email"
                    required
                    error={errors.email}
                    touched={touched.email}
                  >
                    <Input
                      ref={emailInputRef}
                      id="request-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        const email = e.target.value;
                        setFormData((prev) => ({ ...prev, email }));
                        // Once a submit attempt has flagged the field, clear/update
                        // the error as the user corrects it (matches BookingModal).
                        if (touched.email) validateStep1();
                      }}
                      onBlur={() => {
                        // Live feedback on blur only AFTER a submit attempt (which
                        // sets `touched`). Otherwise a required-field error would
                        // appear the moment you leave an empty field on a fresh form.
                        if (touched.email) validateStep1();
                      }}
                      className={invalid(!!errors.email && !!touched.email)}
                      placeholder={t("request.fields.emailPlaceholder")}
                      aria-invalid={
                        errors.email && touched.email ? "true" : "false"
                      }
                      aria-describedby={
                        errors.email ? "request-email-error" : undefined
                      }
                    />
                  </FormField>

                  <FormField
                    label={t("request.fields.companyLabel")}
                    htmlFor="request-company"
                    hint={t("common.optional")}
                  >
                    <Input
                      id="request-company"
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder={t("request.fields.companyPlaceholder")}
                    />
                  </FormField>

                  <FormField
                    label={t("request.fields.roleLabel")}
                    htmlFor="request-role"
                    hint={t("common.optional")}
                  >
                    <Input
                      id="request-role"
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder={t("request.fields.rolePlaceholder")}
                    />
                  </FormField>

                  {prefilledInterest && (
                    <p className="text-sm font-medium text-secondary">
                      {t("request.fields.interestedIn", {
                        topic: prefilledInterest,
                      })}
                    </p>
                  )}

                  {/* Trust indicators */}
                  <TrustBadge items={trustBadges} />
                </div>
              ) : (
                /* Step 2: Goal Selection */
                <div className="space-y-6">
                  {/* Primary outcome (keep as the only "required" big choice) */}
                  <FormField
                    label={t("request.fields.primaryGoalLabel")}
                    required
                    error={errors.primaryGoal}
                    touched={touched.primaryGoal}
                  >
                    <RadioCardGroup
                      name="primary-goal"
                      options={goalOptions}
                      value={formData.primaryGoal}
                      onChange={(value) => {
                        setFormData((prev) => ({ ...prev, primaryGoal: value }));
                        setTouched((prev) => ({ ...prev, primaryGoal: true }));
                      }}
                      // calmer density on mobile, still 2 cols on desktop
                      columns={1}
                      className="sm:[&_[data-card]]:max-w-none sm:[&_[data-grid]]:grid-cols-2"
                    />
                  </FormField>

                  {/* Advanced (optional) — collapsible so Step 2 feels smaller */}
                  <Accordion
                    type="single"
                    collapsible
                    className="rounded-lg border border-border bg-muted/20"
                  >
                    <AccordionItem value="optional" className="border-none">
                      <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                        {t("request.accordion.optionalDetails")}
                      </AccordionTrigger>

                      <AccordionContent className="space-y-5 px-4 pb-4">
                        {/* Tools (chips, but visually lighter) */}
                        <FormField
                          label={t("request.fields.toolsLabel")}
                          hint={t("request.fields.toolsHint")}
                        >
                          <div className="flex flex-wrap gap-2">
                            {localizedTools.map((tool) => {
                              const active = formData.tools.includes(tool.value);
                              return (
                                <button
                                  key={tool.value}
                                  type="button"
                                  onClick={() => toggleTool(tool.value)}
                                  className={cn(
                                    "h-9 rounded-full border px-3 text-xs font-medium transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                    active
                                      ? "border-accent/30 bg-accent/15 text-foreground"
                                      : "border-border bg-background/40 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                                  )}
                                  aria-pressed={active}
                                >
                                  {tool.label}
                                </button>
                              );
                            })}
                          </div>
                        </FormField>

                        {/* Timeline (dropdown = less visual noise) */}
                        <FormField
                          label={t("request.fields.timelineLabel")}
                          hint={t("request.fields.timelineHint")}
                        >
                          <Select
                            value={formData.timeline || "none"}
                            onValueChange={(val) =>
                              setFormData((prev) => ({
                                ...prev,
                                timeline: val === "none" ? "" : val,
                              }))
                            }
                          >
                            <SelectTrigger className="h-11 bg-background/40">
                              <SelectValue
                                placeholder={t("request.fields.timelinePlaceholder")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                {t("request.timelineOptions.none")}
                              </SelectItem>
                              {localizedTimelineOptions.map((timelineOption) => (
                                <SelectItem
                                  key={timelineOption.value}
                                  value={timelineOption.value}
                                >
                                  {timelineOption.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Notes (still optional, but calmer) */}
                        <FormField
                          label={t("request.fields.notesLabel")}
                          htmlFor="request-notes"
                          hint={t("request.fields.notesHint")}
                        >
                          <Textarea
                            id="request-notes"
                            value={formData.notes}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            rows={3}
                            className="min-h-[96px] resize-none"
                            placeholder={t("request.fields.notesPlaceholder")}
                          />
                        </FormField>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {/* What happens next - visible on both steps */}
              <div className="border-t border-border pt-6">
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  {t("request.whatNext.title")}
                </h3>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {whatNextItems[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20">
                      <Shield className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {whatNextItems[1]}
                    </span>
                  </div>
                </div>
              </div>
            </DialogBody>

            <DialogFooter>
              {step === 1 ? (
                <NavigationButtons
                  onNext={handleNext}
                  showBack={false}
                  nextLabel={t("request.cta.continue")}
                />
              ) : (
                <NavigationButtons
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  loading={isSubmitting}
                  showBack={true}
                  isLastStep={true}
                  backLabel={t("request.cta.back")}
                  submitLabel={t("request.cta.submit")}
                />
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

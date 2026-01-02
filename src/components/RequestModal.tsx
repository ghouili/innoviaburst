import { useState, useRef, useEffect, useCallback } from "react";
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Stepper,
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
    label: "Reduce ops time",
    description: "Automate repetitive manual tasks",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    value: "lead-handling",
    label: "Lead handling",
    description: "Qualify & route leads faster",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    value: "reporting",
    label: "Reporting & dashboards",
    description: "Auto-generate reports & insights",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    value: "ai-assistant",
    label: "AI assistant / copilot",
    description: "Build a custom AI helper",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    value: "mvp",
    label: "MVP / product build",
    description: "Ship a working product fast",
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    value: "custom",
    label: "Something else",
    description: "Tell us in your own words",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const toolOptions = [
  "HubSpot",
  "Salesforce",
  "Slack",
  "Microsoft 365",
  "Google Workspace",
  "Notion",
  "Airtable",
  "Zapier/Make",
  "Zendesk",
  "Intercom",
  "Xero",
  "QuickBooks",
  "Other",
];

const timelineOptions = [
  { value: "urgent", label: "ASAP (within 2 weeks)" },
  { value: "soon", label: "This quarter" },
  { value: "planning", label: "Next quarter" },
  { value: "exploring", label: "Just exploring" },
];

type FormStep = 1 | 2 | "success";

export function RequestModal({
  isOpen,
  onClose,
  prefilledInterest,
  source,
}: RequestModalProps) {
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

  const validateStep1 = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your work email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email]);

  const validateStep2 = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.primaryGoal) {
      newErrors.primaryGoal = "Please select a primary outcome";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.primaryGoal]);

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
        title: "Something went wrong",
        description:
          "Please try again or email us directly at hello@innoviaburst.com",
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

  const inputClasses = (hasError: boolean) =>
    cn(
      "w-full px-4 py-3 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px] transition-colors",
      hasError ? "border-destructive" : "border-border"
    );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] mt-8 overflow-y-auto p-0 [scrollbar-gutter:stable]">
        {step === "success" ? (
          <div className="p-6 lg:p-8">
            <SuccessState
              title="Request received!"
              description="We'll review your requirements and get back to you with clarifying questions or a plan link."
              details={[
                "Response within 24 hours (UK business days)",
                "Tailored automation plan",
                "Clear next steps",
              ]}
              actions={
                <>
                  <Button
                    variant="hero"
                    size="lg"
                    className="min-h-[48px]"
                    onClick={() => {
                      handleClose();
                      // Trigger booking modal if available
                      window.dispatchEvent(new CustomEvent("openBookingModal"));
                    }}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Book a call instead
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-h-[48px]"
                    onClick={handleClose}
                  >
                    Back to site
                  </Button>
                </>
              }
            />
          </div>
        ) : (
          <div className="p-6 lg:p-8">
            {/* Header */}
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-secondary/20">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  Request an automation plan
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground">
                Tell us what you're looking to automate — we'll reply with a
                tailored plan.
              </DialogDescription>
            </DialogHeader>

            {/* Stepper */}
            <div className="mb-6">
              <Stepper
                currentStep={step as number}
                totalSteps={2}
                labels={["Your details", "Your goal"]}
              />
            </div>

            {step === 1 ? (
              /* Step 1: Contact Info */
              <div className="space-y-5">
                <FormField
                  label="Work email"
                  htmlFor="request-email"
                  required
                  error={errors.email}
                  touched={touched.email}
                >
                  <input
                    ref={emailInputRef}
                    id="request-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      validateStep1();
                    }}
                    className={inputClasses(!!errors.email && !!touched.email)}
                    placeholder="john@company.com"
                    aria-invalid={
                      errors.email && touched.email ? "true" : "false"
                    }
                    aria-describedby={
                      errors.email ? "request-email-error" : undefined
                    }
                  />
                </FormField>

                <FormField
                  label="Company"
                  htmlFor="request-company"
                  hint="Optional"
                >
                  <input
                    id="request-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className={inputClasses(false)}
                    placeholder="Acme Ltd"
                  />
                </FormField>

                <FormField
                  label="Your role"
                  htmlFor="request-role"
                  hint="Optional"
                >
                  <input
                    id="request-role"
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className={inputClasses(false)}
                    placeholder="Head of Operations"
                  />
                </FormField>

                {prefilledInterest && (
                  <div className=" ">
                    <p className="text-sm font-medium text-secondary">
                      Interested in: {prefilledInterest}
                    </p>
                  </div>
                )}

                <NavigationButtons
                  onNext={handleNext}
                  showBack={false}
                  nextLabel="Continue"
                />

                {/* Trust indicators */}
                <div className="pt-4">
                  <TrustBadge
                    items={["Reply in 24h", "DPA on request", "UK/EU focus"]}
                  />
                </div>
              </div>
            ) : (
              /* Step 2: Goal Selection */

              <div className="space-y-6">
                {/* Primary outcome (keep as the only “required” big choice) */}
                <FormField
                  label="What's your primary outcome?"
                  required
                  error={errors.primaryGoal}
                  touched={touched.primaryGoal}
                >
                  <RadioCardGroup
                    name="primary-goal"
                    options={primaryGoalOptions}
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
                  className="rounded-2xl border border-border bg-muted/20"
                >
                  <AccordionItem value="optional" className="border-none">
                    <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                      Optional details (recommended)
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4 space-y-5">
                      {/* Tools (chips, but visually lighter) */}
                      <FormField
                        label="Tools you use"
                        hint="Optional — select any"
                      >
                        <div className="flex flex-wrap gap-2">
                          {toolOptions.map((tool) => {
                            const active = formData.tools.includes(tool);
                            return (
                              <button
                                key={tool}
                                type="button"
                                onClick={() => toggleTool(tool)}
                                className={cn(
                                  "h-9 px-3 rounded-full text-xs font-medium border transition-colors",
                                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                  active
                                    ? "bg-accent/15 text-foreground border-accent/30"
                                    : "bg-background/40 text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
                                )}
                                aria-pressed={active}
                              >
                                {tool}
                              </button>
                            );
                          })}
                        </div>
                      </FormField>

                      {/* Timeline (dropdown = less visual noise) */}
                      <FormField label="Timeline" hint="Optional">
                        <Select
                          value={formData.timeline || "none"}
                          onValueChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              timeline: val === "none" ? "" : val,
                            }))
                          }
                        >
                          <SelectTrigger className="h-11 rounded-xl bg-background/40">
                            <SelectValue placeholder="Select a timeline (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No preference</SelectItem>
                            {timelineOptions.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>

                      {/* Notes (still optional, but calmer) */}
                      <FormField
                        label="Anything else?"
                        htmlFor="request-notes"
                        hint="Optional — one sentence is enough"
                      >
                        <textarea
                          id="request-notes"
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          rows={3}
                          className={cn(
                            inputClasses(false),
                            "resize-none min-h-[96px]"
                          )}
                          placeholder="e.g. We want to automate support triage + draft replies using Zendesk + Slack."
                        />
                      </FormField>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <NavigationButtons
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  loading={isSubmitting}
                  showBack={true}
                  isLastStep={true}
                  submitLabel="Request my plan"
                />
              </div>
            )}

            {/* What happens next - visible on both steps */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                What happens next?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Reply within 24h (UK business days)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Least-privilege access
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

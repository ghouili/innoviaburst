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
        description: "Please try again or email us directly at hello@innoviaburst.com",
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0">
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
            <DialogHeader className="mb-6">
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
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      validateStep1();
                    }}
                    className={inputClasses(!!errors.email && !!touched.email)}
                    placeholder="john@company.com"
                    aria-invalid={errors.email && touched.email ? "true" : "false"}
                    aria-describedby={errors.email ? "request-email-error" : undefined}
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
                      setFormData((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className={inputClasses(false)}
                    placeholder="Acme Ltd"
                  />
                </FormField>

                <FormField label="Your role" htmlFor="request-role" hint="Optional">
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
                  <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
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
              <div className="space-y-5">
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
                    columns={2}
                  />
                </FormField>

                {/* Tools - optional multi-select */}
                <FormField label="Tools you use" hint="Optional, select all that apply">
                  <div className="flex flex-wrap gap-2">
                    {toolOptions.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium border transition-colors min-h-[36px]",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          formData.tools.includes(tool)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-muted text-muted-foreground border-border hover:border-accent/50"
                        )}
                        aria-pressed={formData.tools.includes(tool)}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Timeline - optional */}
                <FormField label="Timeline" hint="Optional">
                  <div className="grid grid-cols-2 gap-2">
                    {timelineOptions.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, timeline: t.value }))
                        }
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium border transition-colors min-h-[44px]",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          formData.timeline === t.value
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Notes - optional */}
                <FormField
                  label="Anything else?"
                  htmlFor="request-notes"
                  hint="Optional"
                >
                  <textarea
                    id="request-notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    rows={3}
                    className={cn(inputClasses(false), "resize-none min-h-[80px]")}
                    placeholder="Describe your workflow challenge or what you'd like to automate..."
                  />
                </FormField>

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
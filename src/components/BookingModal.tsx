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

  // Focus first input when step changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (step === 1) {
          nameInputRef.current?.focus();
        } else if (step === 2) {
          firstStep2InputRef.current?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
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
      newErrors.name = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your work email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.email]);

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
        title: "Something went wrong",
        description: "Please try again or email us directly at hello@innoviaburst.com",
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
    setTouched(prev => ({ ...prev, [field]: true }));
    validateStep1();
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {step === "success" ? (
          <div className="p-6 lg:p-8">
            <SuccessState
              title="You're booked!"
              description="We've received your request and will confirm your 25-minute call shortly."
              details={[
                "Check your inbox for confirmation",
                "We'll send a calendar invite",
                "Come with questions ready",
              ]}
              actions={
                <>
                  <Button variant="hero" size="lg" className="min-h-[48px]" asChild>
                    <a href="mailto:hello@innoviaburst.com">
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add to calendar
                    </a>
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
        ) : BOOKING_URL ? (
          <>
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent/20">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                {t("booking.title")}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Schedule your 25-minute discovery call
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-4">
              <iframe
                src={BOOKING_URL}
                className="w-full h-[500px] rounded-xl border border-border"
                title="Schedule a call"
              />
            </div>
          </>
        ) : (
          <div className="p-6 lg:p-8">
            {/* Header */}
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-accent/20">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  {t("booking.title")}
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground">
                25-minute call to map your automation opportunities
              </DialogDescription>
            </DialogHeader>

            {/* Stepper */}
            <div className="mb-6">
              <Stepper
                currentStep={step as number}
                totalSteps={2}
                labels={["Your details", "Optional info"]}
              />
            </div>

            {/* Call benefits - always visible */}
            <div className="mb-6 p-4 bg-accent/5 rounded-xl border border-accent/10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>25 min call</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>UK/EU timezone</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>No spam, ever</span>
                </div>
              </div>
            </div>

            {step === 1 ? (
              /* Step 1: Essential Info */
              <div className="space-y-5">
                <FormField
                  label="Your name"
                  htmlFor="booking-name"
                  required
                  error={errors.name}
                  touched={touched.name}
                >
                  <input
                    ref={nameInputRef}
                    id="booking-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={inputClasses(!!errors.name && !!touched.name)}
                    placeholder="John Smith"
                    aria-invalid={errors.name && touched.name ? "true" : "false"}
                    aria-describedby={errors.name ? "booking-name-error" : undefined}
                  />
                </FormField>

                <FormField
                  label="Work email"
                  htmlFor="booking-email"
                  required
                  error={errors.email}
                  touched={touched.email}
                >
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={inputClasses(!!errors.email && !!touched.email)}
                    placeholder="john@company.com"
                    aria-invalid={errors.email && touched.email ? "true" : "false"}
                    aria-describedby={errors.email ? "booking-email-error" : undefined}
                  />
                </FormField>

                {prefilledAutomation && (
                  <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                    <p className="text-sm font-medium text-secondary">
                      Interested in: {prefilledAutomation}
                    </p>
                  </div>
                )}

                <NavigationButtons
                  onNext={handleNext}
                  showBack={false}
                  nextLabel="Continue"
                />
              </div>
            ) : (
              /* Step 2: Optional Details */
              <div className="space-y-5">
                <FormField label="Company" htmlFor="booking-company" hint="Optional">
                  <input
                    ref={firstStep2InputRef}
                    id="booking-company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className={inputClasses(false)}
                    placeholder="Acme Ltd"
                  />
                </FormField>

                <FormField label="Your role" htmlFor="booking-role" hint="Optional">
                  <input
                    id="booking-role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={inputClasses(false)}
                    placeholder="Head of Operations"
                  />
                </FormField>

                <FormField label="What's your main goal?" htmlFor="booking-goal" hint="Optional">
                  <textarea
                    id="booking-goal"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    rows={3}
                    className={cn(inputClasses(false), "resize-none min-h-[80px]")}
                    placeholder="E.g., Automate lead follow-ups, reduce manual reporting..."
                  />
                </FormField>

                <NavigationButtons
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                  loading={isSubmitting}
                  showBack={true}
                  isLastStep={true}
                  submitLabel="Book my call"
                />
              </div>
            )}

            {/* What happens next - visible on step 1 */}
            {step === 1 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  What happens next?
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { step: "1", label: "15-min fit check" },
                    { step: "2", label: "Scope in 48h" },
                    { step: "3", label: "Start date + timeline" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges - visible on step 2 */}
            {step === 2 && (
              <div className="mt-6 pt-4 border-t border-border">
                <TrustBadge items={["Reply in 24h", "No pressure", "UK/EU focus"]} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useRef, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledInterest?: string;
  source?: string;
}

interface FormData {
  email: string;
  companySize: string;
  primaryGoal: string;
  tools: string[];
  timeline: string;
  budget: string;
  notes: string;
}

interface FormErrors {
  email?: string;
  companySize?: string;
  primaryGoal?: string;
}

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201+", label: "201+ employees" },
];

const goals = [
  { value: "automation", label: "Workflow Automation" },
  { value: "ai-copilot", label: "AI Copilot / Assistant" },
  { value: "mvp", label: "MVP / Product Build" },
];

const toolOptions = [
  "HubSpot", "Salesforce", "Slack", "Microsoft 365", 
  "Google Workspace", "Notion", "Airtable", "Zapier/Make",
  "Zendesk", "Intercom", "Xero", "QuickBooks", "Other"
];

const timelines = [
  { value: "urgent", label: "ASAP (within 2 weeks)" },
  { value: "soon", label: "This quarter" },
  { value: "planning", label: "Next quarter" },
  { value: "exploring", label: "Just exploring" },
];

const budgets = [
  { value: "under-5k", label: "Under £5,000" },
  { value: "5k-15k", label: "£5,000 – £15,000" },
  { value: "15k-50k", label: "£15,000 – £50,000" },
  { value: "50k+", label: "£50,000+" },
  { value: "unsure", label: "Not sure yet" },
];

export function RequestModal({ isOpen, onClose, prefilledInterest, source }: RequestModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    companySize: "",
    primaryGoal: prefilledInterest ? "automation" : "",
    tools: [],
    timeline: "",
    budget: "",
    notes: prefilledInterest || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap, ESC key, and initial focus
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => firstInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
        // Focus trap
        if (e.key === "Tab" && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  // Update notes if prefilledInterest changes
  useEffect(() => {
    if (prefilledInterest) {
      setFormData(prev => ({ ...prev, notes: prefilledInterest, primaryGoal: "automation" }));
    }
  }, [prefilledInterest]);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.primaryGoal) {
      newErrors.primaryGoal = "Please select what you're looking for";
    }
    
    // companySize is now optional in step 1, collected in step 2
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setTouched({ email: true, primaryGoal: true });
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
      window.dispatchEvent(new CustomEvent("analytics", { 
        detail: { 
          event: "lead_request", 
          source: source || "modal",
          goal: formData.primaryGoal,
          companySize: formData.companySize,
          interest: prefilledInterest
        } 
      }));

      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Request received!",
        description: "We'll respond within 24 hours (UK business days).",
      });

      setFormData({
        email: "",
        companySize: "",
        primaryGoal: "",
        tools: [],
        timeline: "",
        budget: "",
        notes: "",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
        className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 id="request-modal-title" className="text-2xl font-bold text-foreground">
              {step === 1 ? "Tell us about your project" : "A few more details"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step {step} of 2
            </p>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && touched.email && (
            <div 
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Please fix the following:</p>
                  <ul className="text-sm text-destructive/80 mt-1 list-disc list-inside">
                    {Object.values(errors).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Essential Info */
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-foreground mb-2"
                >
                  Work email <span className="text-destructive">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (touched.email) validateStep1();
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  className={`w-full px-4 py-3 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px] ${
                    errors.email && touched.email ? "border-destructive" : "border-border"
                  }`}
                  aria-invalid={errors.email && touched.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && touched.email && (
                  <p id="email-error" className="text-sm text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Company Size - MOVED TO STEP 2 for simpler initial form
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Company size <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Company size">
                  {companySizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, companySize: size.value }));
                        setTouched(prev => ({ ...prev, companySize: true }));
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.companySize === size.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                      }`}
                      role="radio"
                      aria-checked={formData.companySize === size.value}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                {errors.companySize && touched.companySize && (
                  <p className="text-sm text-destructive mt-1">{errors.companySize}</p>
                )}
              </div>
              */}

              {/* Primary Goal */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  What are you looking for? <span className="text-destructive">*</span>
                </label>
                <div className="space-y-2" role="radiogroup" aria-label="Primary goal">
                  {goals.map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, primaryGoal: goal.value }));
                        setTouched(prev => ({ ...prev, primaryGoal: true }));
                      }}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition-colors text-left min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.primaryGoal === goal.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                      }`}
                      role="radio"
                      aria-checked={formData.primaryGoal === goal.value}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
                {errors.primaryGoal && touched.primaryGoal && (
                  <p className="text-sm text-destructive mt-1">{errors.primaryGoal}</p>
                )}
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full min-h-[48px]" 
                onClick={handleNext}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            /* Step 2: Additional Details */
            <div className="space-y-5">
              {/* Company Size (optional) */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Company size (optional)
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Company size">
                  {companySizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, companySize: size.value }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.companySize === size.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                      }`}
                      role="radio"
                      aria-checked={formData.companySize === size.value}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Which tools do you use? (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors min-h-[36px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.tools.includes(tool)
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-muted text-muted-foreground border-border hover:border-accent/50"
                      }`}
                      aria-pressed={formData.tools.includes(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Timeline (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timelines.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, timeline: t.value }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.timeline === t.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Budget range (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgets.map((b) => (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, budget: b.value }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors min-h-[44px] focus:outline-none focus:ring-2 focus:ring-ring ${
                        formData.budget === b.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-muted text-muted-foreground border-border hover:border-secondary/50"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-foreground mb-2">
                  Anything else? (optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us about your specific workflow or challenge..."
                />
              </div>

              {/* Prefilled interest indicator */}
              {prefilledInterest && (
                <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                  <p className="text-sm text-accent font-medium">
                    Interested in: {prefilledInterest}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={handleBack}
                  className="min-h-[48px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="flex-1 min-h-[48px]" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Submit request
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* What happens next */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-muted-foreground">We respond within 24 hours (UK business days)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
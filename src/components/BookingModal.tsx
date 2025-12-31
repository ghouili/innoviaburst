import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Placeholder URL - replace with actual Calendly/Cal.com URL
const BOOKING_URL = "";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledAutomation?: string;
}

export function BookingModal({ isOpen, onClose, prefilledAutomation }: BookingModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: prefilledAutomation || "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "booking_request", formData } }));
    toast({
      title: "Request received!",
      description: "We'll be in touch within 24 hours to schedule your call.",
    });
    setFormData({ name: "", email: "", company: "", message: "" });
    onClose();
  };

  const steps = [
    { label: t("booking.step1"), desc: "Quick discovery call" },
    { label: t("booking.step2"), desc: "Detailed proposal" },
    { label: t("booking.step3"), desc: "Clear planning" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-accent/20">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{t("booking.title")}</h2>
          </div>

          {BOOKING_URL ? (
            /* Calendly/Cal.com embed */
            <iframe
              src={BOOKING_URL}
              className="w-full h-[500px] rounded-xl border border-border"
              title="Schedule a call"
            />
          ) : (
            /* Fallback contact form */
            <div className="space-y-6">
              <p className="text-muted-foreground">{t("booking.fallbackDesc")}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("booking.name")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("booking.email")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("booking.company")}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Acme Ltd"
                  />
                </div>

                {prefilledAutomation && (
                  <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-accent font-medium">Interested in: {prefilledAutomation}</p>
                  </div>
                )}

                <Button variant="hero" size="lg" className="w-full" type="submit">
                  {t("booking.submit")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          )}

          {/* What happens next */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("booking.whatNext")}</h3>
            <div className="grid grid-cols-3 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

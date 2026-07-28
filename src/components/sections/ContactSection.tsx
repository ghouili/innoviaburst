import { useTranslation } from "react-i18next";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  onBookingClick?: () => void;
}

export function ContactSection({ onBookingClick }: ContactSectionProps) {
  const { t } = useTranslation();

  const handleBookCall = () => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "contact_section" } }));
    if (onBookingClick) {
      onBookingClick();
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-hero relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            {t("contact.title", "Ready to automate")} <span className="text-gradient-brand">{t("contact.titleHighlight", "this month")}?</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8">
            {t("contact.subtitle", "Tell us about your workflow challenge. We'll respond with a clear scope within 48 hours.")}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleBookCall}
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] gap-2 text-sm sm:text-base px-5 sm:px-8"
            >
              {t("contact.primaryCta", "Get a fixed scope in 48h")}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <Button 
              variant="hero-outline" 
              size="lg" 
              asChild
              className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] text-sm sm:text-base px-5 sm:px-8"
            >
              <a href="mailto:hello@innoviaburst.com">
                <Mail className="w-4 h-4 mr-2" />
                {t("contact.emailCta", "Email us directly")}
              </a>
            </Button>
          </div>
          
          {/* Response SLA */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs sm:text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-accent" aria-hidden="true" />
            <span>{t("contact.responseTime", "We reply within 24 hours (UK business days)")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
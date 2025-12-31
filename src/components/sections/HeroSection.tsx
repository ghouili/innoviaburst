import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroVisual } from "./HeroVisual";
// import { Hero3DVisual } from "./Hero3DVisual";

interface HeroSectionProps {
  onBookingClick?: () => void;
  onRequestClick?: () => void;
}

export function HeroSection({ onBookingClick, onRequestClick }: HeroSectionProps) {
  const handlePrimaryClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_primary" } }));
    if (onRequestClick) {
      onRequestClick();
    } else if (onBookingClick) {
      onBookingClick();
    }
  }, [onBookingClick, onRequestClick]);

  const handleSecondaryClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("analytics", { detail: { event: "cta_click", location: "hero_secondary" } }));
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-20 lg:pt-24 overflow-hidden bg-gradient-hero">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              {/* Single promise headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-foreground">
                Ship <span className="text-gradient-brand">AI & automation</span> in weeks, not months.
              </h1>
              
              {/* One proof line */}
              <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                We build workflow automations, AI copilots, and MVPs for UK/EU SMEs with clear scope, measurable ROI, and compliance-ready delivery.
              </p>
            </div>

            {/* Two CTAs only */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={handlePrimaryClick}
                className="min-h-[52px] gap-2"
              >
                Request an automation plan
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="hero-outline" 
                size="xl" 
                onClick={handleSecondaryClick} 
                asChild
                className="min-h-[52px]"
              >
                <Link to="/automations">See automations</Link>
              </Button>
            </div>

            {/* Proof stats - compact */}
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                First delivery in ~10 days
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                UK GDPR ready
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                Tool-agnostic
              </span>
            </div>
          </div>

          {/* 3D Hero Visual - Lazy loaded with fallbacks */}
          {/* <Hero3DVisual className="animate-slide-in-right" /> */}
          <HeroVisual className="" />
        </div>
      </div>
    </section>
  );
}
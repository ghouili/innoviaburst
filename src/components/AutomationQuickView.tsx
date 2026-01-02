import { useEffect, useRef } from "react";
import { X, Clock, Zap, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface Automation {
  title: string;
  category: string;
  outcome: string;
  problem: string;
  steps: string[];
  tools: string[];
  kpi: string;
  deliveryTime: string;
}

interface AutomationQuickViewProps {
  automation: Automation | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestBuild: (title: string) => void;
}

export function AutomationQuickView({ 
  automation, 
  isOpen, 
  onClose, 
  onRequestBuild 
}: AutomationQuickViewProps) {
  const { t } = useTranslation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap and ESC handling
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
        // Focus trap
        if (e.key === "Tab" && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
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
      document.body.style.overflow = "hidden";
      
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !automation) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer - responsive: full width on mobile, max-w-lg on larger screens */}
      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        className="absolute right-0 top-0 bottom-0 w-full sm:max-w-lg bg-card shadow-2xl animate-slide-in-right overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-start justify-between gap-4 z-10">
          <div>
            <span className="inline-block px-2 py-1 rounded-md bg-secondary/20 text-secondary text-xs font-semibold mb-2">
              {automation.category}
            </span>
            <h2 id="quickview-title" className="text-xl font-bold text-foreground">
              {automation.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={t("automationsPage.quickView.close")}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Outcome */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t("automationsPage.quickView.outcome")}</h3>
            <p className="text-foreground font-medium">{automation.outcome}</p>
          </div>

          {/* KPIs */}
          <div className="flex flex-col gap-4">
            <div className="w-fit flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-lg">
              <Zap className="w-4 h-10 text-accent" />
              <span className="text-sm font-medium text-foreground">{automation.kpi}</span>
            </div>
            <div className="w-fit flex items-center gap-2 px-3 py-2 bg-secondary/10 rounded-lg">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">{automation.deliveryTime}</span>
            </div>
          </div>

          {/* Problem */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t("automationsPage.quickView.problem")}</h3>
            <p className="text-muted-foreground">{automation.problem}</p>
          </div>

          {/* Workflow Steps Diagram */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("automationsPage.quickView.workflowSteps")}</h3>
            <div className="relative">
              {automation.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold text-sm shrink-0">
                      {index + 1}
                    </div>
                    {index < automation.steps.length - 1 && (
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
                    )}
                  </div>
                  <p className="text-sm text-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t("automationsPage.quickView.toolsInvolved")}</h3>
            <div className="flex flex-wrap gap-2">
              {automation.tools.map((tool) => (
                <span 
                  key={tool} 
                  className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Typical Inputs/Outputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("automationsPage.quickView.typicalInputs")}</h4>
              <ul className="text-sm text-foreground space-y-1">
                {(t("automationsPage.quickView.inputs", { returnObjects: true }) as string[]).map((input, i) => (
                  <li key={i}>• {input}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{t("automationsPage.quickView.outputs")}</h4>
              <ul className="text-sm text-foreground space-y-1">
                {(t("automationsPage.quickView.outputsList", { returnObjects: true }) as string[]).map((output, i) => (
                  <li key={i}>• {output}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full min-h-[48px]"
            onClick={() => onRequestBuild(automation.title)}
          >
            {t("automationsPage.card.requestBuild")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Clock, Zap, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FlowText } from "@/components/ui/flow-text";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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

/**
 * Right-hand detail drawer for an automation card.
 *
 * Built on the shared Sheet (Radix Dialog) rather than a hand-rolled overlay, so
 * the focus trap, ESC, focus restore, body scroll lock and `aria-hidden` on the
 * rest of the page all come from the primitive instead of bespoke effects.
 */
export function AutomationQuickView({
  automation,
  isOpen,
  onClose,
  onRequestBuild,
}: AutomationQuickViewProps) {
  const { t } = useTranslation();

  if (!automation) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* No description node: the body is long-form content, not a summary. */}
      <SheetContent side="right" aria-describedby={undefined}>
        <SheetHeader>
          <span className="mb-1 inline-block w-fit rounded-md bg-secondary/20 px-2 py-1 text-xs font-semibold text-secondary">
            {automation.category}
          </span>
          <SheetTitle>
            <FlowText text={automation.title} />
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="space-y-6">
          {/* Outcome */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("automationsPage.quickView.outcome")}
            </h3>
            <p className="font-medium text-foreground">
              <FlowText text={automation.outcome} />
            </p>
          </div>

          {/* KPIs */}
          <div className="flex flex-col gap-4">
            <div className="flex w-fit items-center gap-2 rounded-lg bg-accent/10 px-3 py-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{automation.kpi}</span>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">{automation.deliveryTime}</span>
            </div>
          </div>

          {/* Problem */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("automationsPage.quickView.problem")}
            </h3>
            <p className="text-muted-foreground">{automation.problem}</p>
          </div>

          {/* Workflow Steps Diagram */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
              {t("automationsPage.quickView.workflowSteps")}
            </h3>
            <div className="relative">
              {automation.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="relative">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-semibold text-secondary">
                      {index + 1}
                    </div>
                    {index < automation.steps.length - 1 && (
                      <div className="absolute left-1/2 top-8 h-full w-0.5 -translate-x-1/2 bg-border" />
                    )}
                  </div>
                  <p className="pt-1 text-sm text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {t("automationsPage.quickView.toolsInvolved")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {automation.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Typical Inputs/Outputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("automationsPage.quickView.typicalInputs")}
              </h4>
              <ul className="space-y-1 text-sm text-foreground">
                {(t("automationsPage.quickView.inputs", { returnObjects: true }) as string[]).map((input, i) => (
                  <li key={i}>• {input}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("automationsPage.quickView.outputs")}
              </h4>
              <ul className="space-y-1 text-sm text-foreground">
                {(t("automationsPage.quickView.outputsList", { returnObjects: true }) as string[]).map((output, i) => (
                  <li key={i}>• {output}</li>
                ))}
              </ul>
            </div>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button
            variant="hero"
            size="lg"
            className="w-full min-h-[48px]"
            onClick={() => onRequestBuild(automation.title)}
          >
            {t("automationsPage.card.requestBuild")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

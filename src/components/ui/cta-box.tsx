import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

export interface CTABoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  primaryCta?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryCta?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  align?: "left" | "center";
}

const CTABox = React.forwardRef<HTMLDivElement, CTABoxProps>(
  (
    { title, subtitle, primaryCta, secondaryCta, align = "center", className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-muted p-8 md:p-12",
          align === "center" && "text-center",
          className
        )}
        {...props}
      >
        <h3 className="text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h3>
        {subtitle && (
          <p className={cn(
            "mt-3 text-muted-foreground leading-relaxed",
            align === "center" && "mx-auto max-w-xl"
          )}>
            {subtitle}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "mt-6 flex flex-col gap-3 sm:flex-row",
              align === "center" && "justify-center"
            )}
          >
            {primaryCta && (
              <Button
                variant="hero"
                size="lg"
                onClick={primaryCta.onClick}
                asChild={!!primaryCta.href}
                className="min-h-[48px] gap-2"
              >
                {primaryCta.href ? (
                  <a href={primaryCta.href}>
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <>
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
            {secondaryCta && (
              <Button
                variant="hero-outline"
                size="lg"
                onClick={secondaryCta.onClick}
                asChild={!!secondaryCta.href}
                className="min-h-[48px]"
              >
                {secondaryCta.href ? (
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                ) : (
                  secondaryCta.label
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);
CTABox.displayName = "CTABox";

export { CTABox };

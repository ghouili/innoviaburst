import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
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
  size?: "default" | "large";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon: Icon, title, description, primaryCta, secondaryCta, size = "default", className, children, ...props },
    ref
  ) => {
    const iconSize = size === "large" ? "h-16 w-16" : "h-12 w-12";
    const titleSize = size === "large" ? "text-3xl md:text-4xl" : "text-2xl";

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          size === "large" ? "py-16 md:py-24" : "py-12",
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="mb-6 flex items-center justify-center rounded-2xl bg-muted p-4">
            <Icon className={cn(iconSize, "text-muted-foreground")} aria-hidden="true" />
          </div>
        )}
        <h1 className={cn("font-bold text-foreground", titleSize)}>
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-md text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
        {children}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };

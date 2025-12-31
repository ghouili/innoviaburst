import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, subtitle, eyebrow, align = "left", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-3",
          align === "center" && "text-center",
          className
        )}
        {...props}
      >
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className={cn(
            "text-lg text-muted-foreground leading-relaxed",
            align === "center" && "mx-auto max-w-2xl"
          )}>
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = "SectionHeader";

export { SectionHeader };

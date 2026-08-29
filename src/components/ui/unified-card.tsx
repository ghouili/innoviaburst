import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const unifiedCardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-card border-border",
        interactive:
          "shadow-card border-border hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        highlight: "shadow-card border-accent/30 bg-gradient-to-b from-card to-muted/30",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      padding: {
        default: "p-6",
        compact: "p-4",
        spacious: "p-8",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface UnifiedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof unifiedCardVariants> {}

const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(unifiedCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
UnifiedCard.displayName = "UnifiedCard";

const UnifiedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
UnifiedCardHeader.displayName = "UnifiedCardHeader";

const UnifiedCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-tight tracking-tight text-foreground", className)}
    {...props}
  />
));
UnifiedCardTitle.displayName = "UnifiedCardTitle";

const UnifiedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
UnifiedCardDescription.displayName = "UnifiedCardDescription";

const UnifiedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4", className)} {...props} />
));
UnifiedCardContent.displayName = "UnifiedCardContent";

const UnifiedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-6 flex items-center gap-3", className)}
    {...props}
  />
));
UnifiedCardFooter.displayName = "UnifiedCardFooter";

export {
  UnifiedCard,
  UnifiedCardHeader,
  UnifiedCardTitle,
  UnifiedCardDescription,
  UnifiedCardContent,
  UnifiedCardFooter,
  unifiedCardVariants,
};

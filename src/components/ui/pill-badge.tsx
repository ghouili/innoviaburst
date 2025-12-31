import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        category: "bg-secondary/10 text-secondary border border-secondary/20",
        meta: "bg-muted text-muted-foreground",
        info: "bg-accent/10 text-accent border border-accent/20",
        success: "bg-green-500/10 text-green-700 border border-green-500/20",
        warning: "bg-orange/10 text-orange-dark border border-orange/20",
        neutral: "bg-muted text-foreground border border-border",
      },
      size: {
        default: "text-xs px-3 py-1",
        sm: "text-[11px] px-2 py-0.5",
        lg: "text-sm px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "category",
      size: "default",
    },
  }
);

export interface PillBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillBadgeVariants> {}

const PillBadge = React.forwardRef<HTMLSpanElement, PillBadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(pillBadgeVariants({ variant, size, className }))}
      {...props}
    />
  )
);
PillBadge.displayName = "PillBadge";

export { PillBadge, pillBadgeVariants };

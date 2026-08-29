import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal bg-foreground/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// The panel is a 3-row grid (header / body / footer) so that only the BODY
// scrolls. Putting overflow-y-auto on the whole panel scrolls the header out of
// view, which is what the per-modal `mt-3` / `mt-8` offsets used to compensate
// for. `minmax(0,1fr)` is what allows the middle row to actually shrink.
const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-modal grid max-h-[85dvh] w-full max-w-[calc(100vw-2rem)] translate-x-[-50%] translate-y-[-50%] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-xl border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      size: {
        sm: "sm:max-w-md",
        md: "sm:max-w-lg",
        lg: "sm:max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof dialogContentVariants> {}

const DialogContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, size, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn(dialogContentVariants({ size }), className)} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg opacity-70 ring-offset-background transition-opacity hover:bg-muted hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

/** Fixed top region. `pe-14` keeps the title clear of the close button. */
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 px-6 pb-4 pe-14 pt-6 text-start lg:px-8 lg:pe-14", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

/** The only scrolling region. */
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("overflow-y-auto px-6 [scrollbar-gutter:stable] lg:px-8", className)} {...props} />
);
DialogBody.displayName = "DialogBody";

/** Fixed bottom region. Primary action sits rightmost on desktop, on top when stacked. */
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-3 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:flex-row sm:justify-end lg:px-8",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

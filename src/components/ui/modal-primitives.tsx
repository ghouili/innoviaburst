import * as React from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Stepper - Step indicator for multi-step forms
// ============================================================================
interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function Stepper({ currentStep, totalSteps, labels, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between w-full px-8 gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  isCompleted && "bg-accent text-accent-foreground",
                  isActive && "bg-secondary text-secondary-foreground",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground border border-border"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              {labels?.[i] && (
                <span
                  className={cn(
                    "text-sm font-medium hidden sm:inline",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 min-w-4 max-w-full rounded-full transition-colors",
                  isCompleted ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================================
// ModalHeader - Consistent modal header with optional subtitle
// ============================================================================
interface ModalHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function ModalHeader({ icon, title, description, className }: ModalHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2.5 rounded-xl bg-accent/20 shrink-0">
            {icon}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
          {title}
        </h2>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// ============================================================================
// ModalFooter - Consistent modal footer with primary/secondary actions
// ============================================================================
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row gap-3 pt-4", className)}>
      {children}
    </div>
  );
}

// ============================================================================
// FieldError - Accessible inline error message
// ============================================================================
interface FieldErrorProps {
  id?: string;
  message?: string;
  className?: string;
}

export function FieldError({ id, message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn("text-sm text-destructive mt-1.5 flex items-center gap-1.5", className)}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

// ============================================================================
// FormField - Wrapper for form fields with label and error
// ============================================================================
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  touched,
  hint,
  className,
  children,
}: FormFieldProps) {
  const showError = error && touched;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !showError && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {showError && <FieldError id={errorId} message={error} />}
    </div>
  );
}

// ============================================================================
// LoadingButton - Button with loading state
// ============================================================================
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function LoadingButton({
  loading = false,
  loadingText = "Loading...",
  icon,
  iconPosition = "right",
  variant = "primary",
  size = "lg",
  className,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
  );

  const variantStyles = {
    primary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    secondary: "bg-muted text-foreground border border-border hover:bg-muted/80",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base min-h-[48px]",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}

// ============================================================================
// NavigationButtons - Back / Next button pair for multi-step forms
// ============================================================================
interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  showBack?: boolean;
  isLastStep?: boolean;
  className?: string;
}

export function NavigationButtons({
  onBack,
  onNext,
  onSubmit,
  backLabel = "Back",
  nextLabel = "Continue",
  submitLabel = "Submit",
  loading = false,
  showBack = true,
  isLastStep = false,
  className,
}: NavigationButtonsProps) {
  return (
    <div className={cn("flex gap-3 pt-4", className)}>
      {showBack && onBack && (
        <LoadingButton
          type="button"
          variant="ghost"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          {backLabel}
        </LoadingButton>
      )}
      <LoadingButton
        type={isLastStep ? "submit" : "button"}
        variant="primary"
        onClick={isLastStep ? onSubmit : onNext}
        loading={loading}
        loadingText={isLastStep ? "Sending..." : "Loading..."}
        icon={!isLastStep ? <ArrowRight className="w-4 h-4" /> : undefined}
        className="flex-1"
      >
        {isLastStep ? submitLabel : nextLabel}
      </LoadingButton>
    </div>
  );
}

// ============================================================================
// RadioCardGroup - Accessible radio card selection
// ============================================================================
interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioCardGroupProps {
  name: string;
  options: RadioCardOption[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function RadioCardGroup({
  name,
  options,
  value,
  onChange,
  columns = 1,
  className,
}: RadioCardGroupProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn("grid gap-3", gridCols[columns], className)}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border text-left transition-all min-h-[52px]",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected
                ? "bg-secondary/10 border-secondary text-foreground"
                : "bg-muted border-border text-muted-foreground hover:border-secondary/50 hover:bg-muted/80"
            )}
          >
            {option.icon && (
              <div
                className={cn(
                  "p-2 rounded-lg shrink-0",
                  isSelected ? "bg-secondary/20 text-secondary" : "bg-background text-muted-foreground"
                )}
              >
                {option.icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={cn("font-semibold text-sm", isSelected && "text-foreground")}>
                {option.label}
              </p>
              {option.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
              )}
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                isSelected ? "border-secondary bg-secondary" : "border-border"
              )}
            >
              {isSelected && <Check className="w-3 h-3 text-secondary-foreground" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// SuccessState - Modal success confirmation
// ============================================================================
interface SuccessStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  details?: string[];
  actions?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  icon,
  title,
  description,
  details,
  actions,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn("text-center py-6", className)}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
        {icon || <Check className="w-8 h-8 text-accent" />}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {details && details.length > 0 && (
        <ul className="text-sm text-muted-foreground space-y-2 mb-6 max-w-sm mx-auto">
          {details.map((detail, i) => (
            <li key={i} className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-accent shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      )}
      {actions && <div className="flex flex-col sm:flex-row gap-3 justify-center">{actions}</div>}
    </div>
  );
}

// ============================================================================
// TrustBadge - Small trust indicator for forms
// ============================================================================
interface TrustBadgeProps {
  items: string[];
  className?: string;
}

export function TrustBadge({ items, className }: TrustBadgeProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium"
        >
          <Check className="w-3 h-3" />
          {item}
        </span>
      ))}
    </div>
  );
}

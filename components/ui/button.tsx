import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes, forwardRef, ReactElement, cloneElement } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-smooth rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-md hover:shadow-lg",
      primary:
        "bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-md hover:shadow-lg",
      secondary:
        "bg-secondary text-white hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white active:scale-95",
      ghost:
        "hover:bg-muted text-foreground active:scale-95",
      danger:
        "bg-error text-white hover:opacity-90 active:scale-95 shadow-md hover:shadow-lg",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-base px-4 py-2 gap-2",
      lg: "text-lg px-6 py-3 gap-2.5",
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && children) {
      const child = children as ReactElement;
      const childClassName = (child.props as any)?.className;
      return cloneElement(child, {
        className: cn(childClassName, combinedClassName),
        ...props,
      } as any);
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

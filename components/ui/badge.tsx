import { cn } from "@/lib/utils/cn";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "secondary" | "destructive";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-primary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    error: "bg-error text-white",
    info: "bg-info text-white",
    outline: "border border-border text-foreground bg-transparent",
    secondary: "bg-secondary text-white",
    destructive: "bg-destructive text-white",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-smooth",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

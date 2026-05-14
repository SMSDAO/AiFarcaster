import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

/** Shared class-name helper — importable by non-button interactive elements (e.g. links) */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple/60",
    {
      // Sizes
      "text-xs px-3 py-1.5": size === "sm",
      "text-sm px-4 py-2": size === "md",
      "text-base px-6 py-3": size === "lg",
      // Variants
      "bg-gradient-to-r from-purple to-purple-light text-white shadow-soft hover:opacity-90 active:scale-95 glow-purple":
        variant === "primary",
      "border border-border/80 bg-card/60 text-textPrimary backdrop-blur-sm hover:bg-white/10 hover:border-purple/50 active:scale-95":
        variant === "secondary",
      "text-textSecondary hover:text-textPrimary hover:bg-white/5 active:scale-95":
        variant === "ghost",
    },
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  );
}

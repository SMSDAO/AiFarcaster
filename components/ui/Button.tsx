import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-DEFAULT/60",
          {
            // Sizes
            "text-xs px-3 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-6 py-3": size === "lg",
            // Variants
            "bg-gradient-to-r from-purple-DEFAULT to-purple-light text-white shadow-soft hover:opacity-90 active:scale-95 glow-purple":
              variant === "primary",
            "border border-border/80 bg-card/60 text-textPrimary backdrop-blur-sm hover:bg-white/10 hover:border-purple-DEFAULT/50 active:scale-95":
              variant === "secondary",
            "text-textSecondary hover:text-textPrimary hover:bg-white/5 active:scale-95":
              variant === "ghost",
          },
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
}

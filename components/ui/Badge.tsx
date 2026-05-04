import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type BadgeVariant = "purple" | "blue" | "green" | "orange" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  purple: "bg-purple/20 text-purple-light border-purple/30",
  blue: "bg-blue/20 text-blue-light border-blue/30",
  green: "bg-green/20 text-green-light border-green/30",
  orange: "bg-orange/20 text-orange-light border-orange/30",
  muted: "bg-white/5 text-textSecondary border-border/40",
};

export function Badge({ variant = "muted", children, className, pulse = false }: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
          variantStyles[variant],
          className
        )
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

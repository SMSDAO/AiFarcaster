import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass = false }: CardProps) {
  return (
    <div
      className={cn(
          "rounded-xl border shadow-soft",
          glass
            ? "glass-card"
            : "bg-card border-border/60",
          className
        )}
    >
      {children}
    </div>
  );
}

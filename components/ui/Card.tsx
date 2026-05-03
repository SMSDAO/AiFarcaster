import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className, glass = false }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-xl border shadow-soft",
          glass
            ? "glass-card"
            : "bg-card border-border/60",
          className
        )
      )}
    >
      {children}
    </div>
  );
}

import type { ElementType } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Plus, FolderPlus, Coins, BarChart2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary";

interface ActionItem {
  label: string;
  icon: ElementType;
  variant: ButtonVariant;
  href?: string;
}

const actions: ActionItem[] = [
  {
    label: "New Frame",
    icon: Plus,
    variant: "primary",
    href: "/dashboard/frames",
  },
  {
    label: "New Project",
    icon: FolderPlus,
    variant: "secondary",
    href: "/dashboard/projects",
  },
  {
    label: "Launch Token",
    icon: Coins,
    variant: "secondary",
  },
  {
    label: "Analytics",
    icon: BarChart2,
    variant: "secondary",
  },
];

function actionClassName(variant: ButtonVariant) {
  return twMerge(
    clsx(
      "inline-flex items-center justify-center gap-2 text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple/60",
      {
        "bg-gradient-to-r from-purple to-purple-light text-white shadow-soft hover:opacity-90 active:scale-95 glow-purple":
          variant === "primary",
        "border border-border/80 bg-card/60 text-textPrimary backdrop-blur-sm hover:bg-white/10 hover:border-purple/50 active:scale-95":
          variant === "secondary",
      }
    )
  );
}

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) =>
        action.href ? (
          <Link key={action.label} href={action.href} className={actionClassName(action.variant)}>
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Link>
        ) : (
          <button key={action.label} type="button" className={actionClassName(action.variant)}>
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

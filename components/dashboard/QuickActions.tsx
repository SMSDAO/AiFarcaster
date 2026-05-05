import type { ElementType } from "react";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";
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

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) =>
        action.href ? (
          <Link key={action.label} href={action.href} className={buttonClassName(action.variant, "sm")}>
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Link>
        ) : (
          <button key={action.label} type="button" className={buttonClassName(action.variant, "sm")}>
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

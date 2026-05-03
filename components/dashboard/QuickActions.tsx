import { Button } from "@/components/ui/Button";
import { Plus, FolderPlus, Coins, BarChart2 } from "lucide-react";

const actions = [
  {
    label: "New Frame",
    icon: Plus,
    variant: "primary" as const,
    href: "/dashboard/frames",
  },
  {
    label: "New Project",
    icon: FolderPlus,
    variant: "secondary" as const,
    href: "/dashboard/projects",
  },
  {
    label: "Launch Token",
    icon: Coins,
    variant: "secondary" as const,
    href: "#",
  },
  {
    label: "Analytics",
    icon: BarChart2,
    variant: "secondary" as const,
    href: "#",
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <a key={action.label} href={action.href}>
          <Button variant={action.variant} size="sm">
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </Button>
        </a>
      ))}
    </div>
  );
}

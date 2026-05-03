import { Badge } from "@/components/ui/Badge";
import {
  Zap,
  BarChart2,
  Bot,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Loader2,
} from "lucide-react";

type StatusVariant = "purple" | "blue" | "green" | "orange";

interface ActivityEvent {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  statusVariant: StatusVariant;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const events: ActivityEvent[] = [
  {
    id: "1",
    title: "Token Launch Frame",
    subtitle: "Published to Farcaster channel",
    status: "Published",
    statusVariant: "green",
    icon: Zap,
    iconBg: "bg-green-DEFAULT/20",
    iconColor: "text-green-light",
  },
  {
    id: "2",
    title: "Community Poll Frame",
    subtitle: "Active — 567 views, 234 interactions",
    status: "Live",
    statusVariant: "blue",
    icon: BarChart2,
    iconBg: "bg-blue-DEFAULT/20",
    iconColor: "text-blue-light",
  },
  {
    id: "3",
    title: "AI Growth Sprint",
    subtitle: "7-day campaign completed successfully",
    status: "Completed",
    statusVariant: "orange",
    icon: CheckCircle,
    iconBg: "bg-orange-DEFAULT/20",
    iconColor: "text-orange-light",
  },
  {
    id: "4",
    title: "NFT Mint Frame",
    subtitle: "Draft reviewed and approved",
    status: "Done",
    statusVariant: "green",
    icon: CheckCircle,
    iconBg: "bg-green-DEFAULT/20",
    iconColor: "text-green-light",
  },
  {
    id: "5",
    title: "AI Suggestion Batch",
    subtitle: "6 high-confidence prompts queued",
    status: "Queued",
    statusVariant: "purple",
    icon: Bot,
    iconBg: "bg-purple-DEFAULT/20",
    iconColor: "text-purple-light",
  },
  {
    id: "6",
    title: "Analytics Report",
    subtitle: "Monthly export generated",
    status: "Exported",
    statusVariant: "blue",
    icon: Upload,
    iconBg: "bg-blue-DEFAULT/20",
    iconColor: "text-blue-light",
  },
];

export function ActivityFeed() {
  return (
    <div className="rounded-xl bg-card border border-border/60 shadow-soft flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-light" />
          <h3 className="text-sm font-semibold text-textPrimary">Activity Feed</h3>
        </div>
        <button className="text-xs text-textMuted hover:text-purple-light transition-colors">
          View All
        </button>
      </div>

      {/* Events */}
      <ul className="divide-y divide-border/30">
        {events.map((event) => (
          <li
            key={event.id}
            className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.iconBg} ${event.iconColor}`}
            >
              <event.icon className="w-3.5 h-3.5" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-textPrimary truncate">{event.title}</p>
              <p className="text-[11px] text-textMuted truncate mt-0.5">{event.subtitle}</p>
            </div>

            {/* Badge */}
            <Badge variant={event.statusVariant} className="flex-shrink-0">
              {event.status}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Badge } from "@/components/ui/Badge";
import { Frame, FileText, Sparkles, Eye, Clock } from "lucide-react";

type FrameStatus = "Active" | "Draft" | "Scheduled" | "Paused";
type FrameType = "Engagement" | "Mint" | "Poll" | "Airdrop";

interface FrameRow {
  id: string;
  name: string;
  type: FrameType;
  views: number;
  status: FrameStatus;
  updated: string;
  icon: React.ElementType;
  iconColor: string;
}

const frames: FrameRow[] = [
  {
    id: "1",
    name: "Token Launch Frame",
    type: "Mint",
    views: 342,
    status: "Active",
    updated: "2h ago",
    icon: Frame,
    iconColor: "text-purple-light",
  },
  {
    id: "2",
    name: "Community Poll",
    type: "Poll",
    views: 567,
    status: "Active",
    updated: "4h ago",
    icon: FileText,
    iconColor: "text-blue-light",
  },
  {
    id: "3",
    name: "NFT Airdrop Frame",
    type: "Airdrop",
    views: 128,
    status: "Scheduled",
    updated: "1d ago",
    icon: Sparkles,
    iconColor: "text-orange-light",
  },
  {
    id: "4",
    name: "Growth Sprint CTA",
    type: "Engagement",
    views: 891,
    status: "Paused",
    updated: "3d ago",
    icon: Frame,
    iconColor: "text-green-light",
  },
  {
    id: "5",
    name: "NFT Mint Frame",
    type: "Mint",
    views: 0,
    status: "Draft",
    updated: "5d ago",
    icon: Frame,
    iconColor: "text-textMuted",
  },
];

const statusConfig: Record<FrameStatus, { variant: "purple" | "blue" | "green" | "orange" | "muted"; label: string }> = {
  Active: { variant: "green", label: "Active" },
  Draft: { variant: "muted", label: "Draft" },
  Scheduled: { variant: "orange", label: "Scheduled" },
  Paused: { variant: "blue", label: "Paused" },
};

export function FramesTable() {
  return (
    <div className="rounded-xl bg-card border border-border/60 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Frame className="w-4 h-4 text-purple-light" />
          <h3 className="text-sm font-semibold text-textPrimary">Recent Frames</h3>
        </div>
        <button className="text-xs text-textMuted hover:text-purple-light transition-colors">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left px-5 py-2.5 text-textMuted font-medium">Name</th>
              <th className="text-left px-4 py-2.5 text-textMuted font-medium hidden sm:table-cell">Type</th>
              <th className="text-right px-4 py-2.5 text-textMuted font-medium hidden md:table-cell">
                <span className="flex items-center justify-end gap-1">
                  <Eye className="w-3 h-3" />
                  Views
                </span>
              </th>
              <th className="text-left px-4 py-2.5 text-textMuted font-medium">Status</th>
              <th className="text-left px-4 py-2.5 text-textMuted font-medium hidden lg:table-cell">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {frames.map((frame) => (
              <tr
                key={frame.id}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                {/* Name */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-border/40 flex items-center justify-center flex-shrink-0">
                      <frame.icon className={`w-3.5 h-3.5 ${frame.iconColor}`} />
                    </div>
                    <span className="font-medium text-textPrimary group-hover:text-white transition-colors truncate max-w-[140px]">
                      {frame.name}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3 hidden sm:table-cell text-textSecondary">
                  {frame.type}
                </td>

                {/* Views */}
                <td className="px-4 py-3 text-right hidden md:table-cell text-textSecondary font-medium">
                  {frame.views.toLocaleString()}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge variant={statusConfig[frame.status].variant}>
                    {statusConfig[frame.status].label}
                  </Badge>
                </td>

                {/* Updated */}
                <td className="px-4 py-3 hidden lg:table-cell text-textMuted">
                  {frame.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

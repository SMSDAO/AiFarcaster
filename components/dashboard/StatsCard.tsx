import { TrendingUp, TrendingDown } from "lucide-react";

type AccentColor = "purple" | "blue" | "green" | "orange";

interface SparklineProps {
  data: number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 28;
  const step = width / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity="0.8"
      />
    </svg>
  );
}

const accentConfig: Record<
  AccentColor,
  {
    borderClass: string;
    iconBg: string;
    iconColor: string;
    valueColor: string;
    sparkColor: string;
    hoverBorderClass: string;
  }
> = {
  purple: {
    borderClass: "gradient-border-top-purple",
    iconBg: "bg-purple-DEFAULT/20",
    iconColor: "text-purple-light",
    valueColor: "text-textPrimary",
    sparkColor: "#a855f7",
    hoverBorderClass: "hover:border-purple-DEFAULT/40",
  },
  blue: {
    borderClass: "gradient-border-top-blue",
    iconBg: "bg-blue-DEFAULT/20",
    iconColor: "text-blue-light",
    valueColor: "text-textPrimary",
    sparkColor: "#60a5fa",
    hoverBorderClass: "hover:border-blue-DEFAULT/40",
  },
  green: {
    borderClass: "gradient-border-top-green",
    iconBg: "bg-green-DEFAULT/20",
    iconColor: "text-green-light",
    valueColor: "text-textPrimary",
    sparkColor: "#34d399",
    hoverBorderClass: "hover:border-green-DEFAULT/40",
  },
  orange: {
    borderClass: "gradient-border-top-orange",
    iconBg: "bg-orange-DEFAULT/20",
    iconColor: "text-orange-light",
    valueColor: "text-textPrimary",
    sparkColor: "#fbbf24",
    hoverBorderClass: "hover:border-orange-DEFAULT/40",
  },
};

interface StatsCardProps {
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
  icon: React.ReactNode;
  accent: AccentColor;
  sparkline?: number[];
}

export function StatsCard({
  label,
  value,
  trend,
  trendPositive = true,
  icon,
  accent,
  sparkline = [10, 15, 12, 18, 14, 22, 19, 25, 21, 28],
}: StatsCardProps) {
  const cfg = accentConfig[accent];

  return (
    <div
      className={`relative rounded-xl bg-card border border-border/60 p-5 shadow-soft transition-all duration-200 overflow-hidden ${cfg.borderClass} ${cfg.hoverBorderClass}`}
    >
      {/* Subtle glow effect in top-left */}
      <div
        className="absolute -top-8 -left-8 w-24 h-24 rounded-full opacity-10 blur-2xl pointer-events-none"
        style={{
          background:
            accent === "purple"
              ? "#7c3aed"
              : accent === "blue"
              ? "#2563eb"
              : accent === "green"
              ? "#059669"
              : "#d97706",
        }}
        aria-hidden="true"
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-textSecondary uppercase tracking-wide">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className={`text-2xl font-bold mb-1.5 ${cfg.valueColor}`}>{value}</div>

      {/* Trend + sparkline */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            trendPositive ? "text-green-light" : "text-orange-light"
          }`}
        >
          {trendPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend}
        </span>
        <Sparkline data={sparkline} color={cfg.sparkColor} />
      </div>
    </div>
  );
}

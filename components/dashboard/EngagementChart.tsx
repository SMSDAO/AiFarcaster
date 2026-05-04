'use client';

import { useState, useMemo } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

type Period = "7d" | "30d" | "90d";

interface ChartDataPoint {
  date: string;
  views: number;
  clicks: number;
  mints: number;
}

const generateData = (days: number): ChartDataPoint[] => {
  const result: ChartDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label =
      days <= 7
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    result.push({
      date: label,
      views: Math.floor(200 + Math.random() * 400 + i * 3),
      clicks: Math.floor(80 + Math.random() * 150 + i * 1.5),
      mints: Math.floor(10 + Math.random() * 60),
    });
  }
  return result;
};

const periodDays: Record<Period, number> = { "7d": 7, "30d": 30, "90d": 90 };

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-bgSecondary border border-border/60 px-3 py-2 shadow-soft text-xs">
      <p className="text-textMuted mb-1.5">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
          <span className="text-textSecondary capitalize">{item.name}:</span>
          <span className="font-semibold text-textPrimary">{item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function EngagementChart() {
  const [period, setPeriod] = useState<Period>("7d");
  const data = useMemo(() => generateData(periodDays[period]), [period]);

  return (
    <div className="rounded-xl bg-card border border-border/60 shadow-soft flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-blue-light" />
          <h3 className="text-sm font-semibold text-textPrimary">Engagement</h3>
        </div>

        {/* Period switch */}
        <div className="flex items-center gap-0.5 bg-bgSecondary rounded-lg p-0.5 border border-border/40">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                period === p
                  ? "bg-purple/80 text-white"
                  : "text-textMuted hover:text-textSecondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 pt-5 flex-1">
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2d2560"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8b8ab0", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={period === "7d" ? 0 : period === "30d" ? 4 : 9}
            />
            <YAxis
              tick={{ fill: "#8b8ab0", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Views - purple area */}
            <Area
              type="monotone"
              dataKey="views"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#viewsGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }}
            />

            {/* Clicks - blue dashed */}
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 3, fill: "#60a5fa", strokeWidth: 0 }}
            />

            {/* Mints - green dashed */}
            <Line
              type="monotone"
              dataKey="mints"
              stroke="#34d399"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
              activeDot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 px-2">
          {[
            { label: "Views", color: "#a855f7", dashed: false },
            { label: "Clicks", color: "#60a5fa", dashed: true },
            { label: "Mints", color: "#34d399", dashed: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <svg width="16" height="8" viewBox="0 0 16 8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="16"
                  y2="4"
                  stroke={item.color}
                  strokeWidth="2"
                  strokeDasharray={item.dashed ? "4 3" : undefined}
                />
              </svg>
              <span className="text-[11px] text-textSecondary">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Frame, FolderKanban, TrendingUp, DollarSign, Zap } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { FramesTable } from "@/components/dashboard/FramesTable";

// Mock data — easily replaceable with Firebase / API
const stats = {
  frames: 124,
  projects: 18,
  engagement: 8.4,
  revenue: 4280,
};

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Hero banner */}
      <section
        className="rounded-xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.08) 50%, rgba(37,99,235,0.15) 100%)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        <div>
          <h2 className="text-lg font-bold text-textPrimary">AI + Farcaster Growth OS</h2>
          <p className="mt-1 text-xs text-textSecondary max-w-md">
            Manage creator growth workflows, frame performance, and AI-assisted execution from one
            control center.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-purple-light border border-purple-DEFAULT/30"
            style={{ background: "rgba(124,58,237,0.12)" }}
          >
            <Zap className="h-3 w-3" />
            Live intelligence stream
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total Frames"
          value={stats.frames.toString()}
          trend="+12 this month"
          trendPositive
          accent="purple"
          icon={<Frame className="w-4 h-4" />}
          sparkline={[80, 95, 88, 102, 97, 110, 105, 118, 112, 124]}
        />
        <StatsCard
          label="Active Projects"
          value={stats.projects.toString()}
          trend="+3 this week"
          trendPositive
          accent="blue"
          icon={<FolderKanban className="w-4 h-4" />}
          sparkline={[10, 12, 11, 14, 13, 15, 14, 16, 17, 18]}
        />
        <StatsCard
          label="Engagement Rate"
          value={`${stats.engagement}%`}
          trend="+2.1% vs last week"
          trendPositive
          accent="green"
          icon={<TrendingUp className="w-4 h-4" />}
          sparkline={[6.2, 6.8, 6.5, 7.1, 6.9, 7.4, 7.8, 8.0, 8.2, 8.4]}
        />
        <StatsCard
          label="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          trend="+18% this month"
          trendPositive
          accent="orange"
          icon={<DollarSign className="w-4 h-4" />}
          sparkline={[2800, 3100, 2950, 3300, 3200, 3600, 3800, 4000, 4100, 4280]}
        />
      </section>

      {/* Engagement Chart + Activity Feed */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <EngagementChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </section>

      {/* Frames Table */}
      <section>
        <FramesTable />
      </section>
    </div>
  );
}


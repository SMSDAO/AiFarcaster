'use client';

import {
  Bot,
  BrainCircuit,
  Clock3,
  Frame,
  LineChart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-purple-700/40 via-purple-600/20 to-blue-700/30 p-6 backdrop-blur transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">AI + Farcaster Growth OS</h2>
            <p className="mt-1 text-sm text-purple-100/90">
              Manage creator growth workflows, frame performance, and AI-assisted execution from one control center.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/40 bg-purple-500/20 px-3 py-1.5 text-xs font-medium text-purple-100">
            <Zap className="h-3.5 w-3.5" />
            Live intelligence stream
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Frames"
          value="12"
          change="+3 this week"
          icon={<Frame className="h-5 w-5 text-violet-300" />}
        />
        <StatCard
          title="AI Suggestions"
          value="18"
          change="6 high-confidence"
          icon={<BrainCircuit className="h-5 w-5 text-indigo-300" />}
        />
        <StatCard
          title="Weekly Engagement"
          value="1.2K"
          change="+15% this week"
          icon={<Users className="h-5 w-5 text-emerald-300" />}
        />
        <StatCard
          title="Growth Velocity"
          value="$420"
          change="+22% conversion"
          icon={<TrendingUp className="h-5 w-5 text-orange-300" />}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">AI Activity Panel</h3>
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
              Streaming
            </span>
          </div>
          <div className="space-y-3">
            <ActivityItem title="Suggested best posting time based on follower behavior." time="2m ago" type="ai" />
            <ActivityItem title="Detected 27% uplift opportunity on Token Launch frame CTA." time="18m ago" type="analytics" />
            <ActivityItem title="Auto-generated campaign concept for next 7-day growth sprint." time="42m ago" type="suggestion" />
            <ActivityItem title="Engagement anomaly detected in Community Poll interactions." time="1h ago" type="alert" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-300" />
            <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
          </div>
          <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-6 text-center">
            <Bot className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-200">No queued recommendations yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Suggestions will appear here when enough signal is collected from your frames.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300">
          <div className="mb-4 flex items-center gap-2">
            <Frame className="h-5 w-5 text-violet-300" />
            <h3 className="text-lg font-semibold text-white">Frame Analytics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AnalyticsCard label="Avg. View Rate" value="68%" />
            <AnalyticsCard label="Replay Actions" value="221" />
            <AnalyticsCard label="Save Events" value="84" />
            <AnalyticsCard label="Share CTR" value="19.6%" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300">
          <div className="mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold text-white">Engagement Timeline</h3>
          </div>
          <div className="h-44 rounded-xl border border-white/10 bg-gradient-to-b from-cyan-500/5 to-transparent p-4">
            <div className="flex h-full items-end gap-2">
              {[18, 26, 14, 30, 20, 38, 28, 42, 35, 44].map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className="w-full rounded-sm bg-gradient-to-t from-cyan-500/30 to-violet-500/40 transition-all duration-300"
                  style={{ height: `${height * 2}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300">
        <div className="mb-4 flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-violet-300" />
          <h3 className="text-lg font-semibold text-white">Frame Timeline</h3>
        </div>
        <div className="space-y-3">
          <FrameCard title="Token Launch Frame" status="Active" views={342} interactions={89} />
          <FrameCard title="NFT Mint Frame" status="Draft" views={0} interactions={0} />
          <FrameCard title="Community Poll" status="Active" views={567} interactions={234} />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-5 shadow-lg transition-all duration-300 hover:border-purple-400/30">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon}
      </div>
      <div className="mb-1 text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-emerald-300">{change}</div>
    </div>
  );
}

function AnalyticsCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-200 hover:border-violet-400/30">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ActivityItem({ title, time, type }: { title: string; time: string; type: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3 transition-all duration-200 hover:border-purple-400/30">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-100">{title}</p>
          <p className="text-sm text-gray-400">{time}</p>
        </div>
        <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-200">
          {type}
        </span>
      </div>
    </div>
  );
}

function FrameCard({
  title,
  status,
  views,
  interactions,
}: {
  title: string;
  status: string;
  views: number;
  interactions: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-200 hover:border-purple-400/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-100">{title}</h3>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            status === "Active"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-gray-500/20 text-gray-300"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex space-x-6 text-sm text-gray-400">
        <div>
          <span className="font-medium">{views}</span> views
        </div>
        <div>
          <span className="font-medium">{interactions}</span> interactions
        </div>
      </div>
    </div>
  );
}

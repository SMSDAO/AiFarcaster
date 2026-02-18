'use client';

import { Frame, FolderKanban, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Frames"
          value="12"
          change="+3 this week"
          icon={<Frame className="w-8 h-8 text-purple-600" />}
        />
        <StatCard
          title="Active Projects"
          value="5"
          change="+1 this month"
          icon={<FolderKanban className="w-8 h-8 text-blue-600" />}
        />
        <StatCard
          title="Engagement"
          value="1.2K"
          change="+15% this week"
          icon={<Users className="w-8 h-8 text-green-600" />}
        />
        <StatCard
          title="Revenue"
          value="$420"
          change="+$120 this month"
          icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton icon={<Frame />} label="New Frame" />
          <QuickActionButton icon={<FolderKanban />} label="New Project" />
          <QuickActionButton icon={<Sparkles />} label="Browse Templates" />
          <QuickActionButton icon={<Zap />} label="AI Assistant" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <ActivityItem
            title="Frame created: Token Launch"
            time="2 hours ago"
            type="frame"
          />
          <ActivityItem
            title="Template purchased: NFT Gallery"
            time="5 hours ago"
            type="template"
          />
          <ActivityItem
            title="Project deployed: Community Hub"
            time="1 day ago"
            type="project"
          />
          <ActivityItem
            title="Airdrop completed: 100 participants"
            time="2 days ago"
            type="airdrop"
          />
        </div>
      </div>

      {/* Frames Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Frames Timeline</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <FrameCard
              title="Token Launch Frame"
              status="Active"
              views={342}
              interactions={89}
            />
            <FrameCard
              title="NFT Mint Frame"
              status="Draft"
              views={0}
              interactions={0}
            />
            <FrameCard
              title="Community Poll"
              status="Active"
              views={567}
              interactions={234}
            />
          </div>
        </div>
      </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</div>
      <div className="text-sm text-green-600">{change}</div>
    </div>
  );
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
      <div className="w-8 h-8 text-purple-600 mb-2">{icon}</div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
    </button>
  );
}

function ActivityItem({ title, time, type }: { title: string; time: string; type: string }) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-900 dark:text-white font-medium">{title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
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
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-500 transition">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            status === "Active"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
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

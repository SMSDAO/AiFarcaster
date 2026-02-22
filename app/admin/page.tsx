'use client';

import {
  Users,
  Bot,
  DollarSign,
  Activity,
} from 'lucide-react';
import { StatusCard } from './components/status-card';

// MOCK DATA — replace with Supabase query when table exists
const stats = [
  { title: 'Total Users', value: '1,284', change: '+12% this month', changeType: 'positive' as const, icon: <Users className="w-5 h-5" /> },
  { title: 'Active Agents', value: '47', change: '+3 today', changeType: 'positive' as const, icon: <Bot className="w-5 h-5" /> },
  { title: 'Revenue (MTD)', value: '$8,420', change: '+18% vs last month', changeType: 'positive' as const, icon: <DollarSign className="w-5 h-5" /> },
  { title: 'API Calls (24h)', value: '93,210', change: '-2% vs yesterday', changeType: 'negative' as const, icon: <Activity className="w-5 h-5" /> },
];

// MOCK DATA — replace with Supabase query when table exists
const recentActivity = [
  { id: 1, event: 'New user registered', user: 'alice@example.com', time: '2 min ago' },
  { id: 2, event: 'Agent deployed', user: 'bob@example.com', time: '15 min ago' },
  { id: 3, event: 'Payment received', user: 'carol@example.com', time: '1 hr ago' },
  { id: 4, event: 'API key created', user: 'dave@example.com', time: '3 hr ago' },
  { id: 5, event: 'User banned', user: 'eve@example.com', time: '5 hr ago' },
];

// MOCK DATA — replace with Supabase query when table exists
const systemHealth = [
  { name: 'API', status: 'operational' },
  { name: 'Database', status: 'operational' },
  { name: 'Auth', status: 'operational' },
  { name: 'Storage', status: 'degraded' },
];

function statusColor(status: string) {
  if (status === 'operational') return 'bg-green-500';
  if (status === 'degraded') return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatusCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{a.event}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{a.user}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h2>
          <div className="space-y-3">
            {systemHealth.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{s.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${statusColor(s.status)}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

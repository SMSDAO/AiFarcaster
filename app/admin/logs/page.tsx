'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'info' | 'warn' | 'error';
  message: string;
  source: string;
}

// MOCK DATA — replace with Supabase query when table exists
const mockLogs: LogEntry[] = [
  { id: 1, timestamp: '2024-04-10 12:00:01', type: 'info', message: 'User alice@example.com logged in', source: 'auth' },
  { id: 2, timestamp: '2024-04-10 12:01:15', type: 'info', message: 'Agent FarcasterBot deployed', source: 'agents' },
  { id: 3, timestamp: '2024-04-10 12:02:30', type: 'warn', message: 'Oracle feed DEGEN/USD stale for 10min', source: 'oracles' },
  { id: 4, timestamp: '2024-04-10 12:03:45', type: 'error', message: 'Payment processing failed for invoice #1042', source: 'billing' },
  { id: 5, timestamp: '2024-04-10 12:04:00', type: 'info', message: 'API key created by admin@admin.com', source: 'api-keys' },
  { id: 6, timestamp: '2024-04-10 12:05:10', type: 'warn', message: 'High memory usage on worker-2', source: 'system' },
  { id: 7, timestamp: '2024-04-10 12:06:22', type: 'error', message: 'Agent MarketMaker crashed with OOM error', source: 'agents' },
  { id: 8, timestamp: '2024-04-10 12:07:00', type: 'info', message: 'New user bob@example.com registered', source: 'auth' },
  { id: 9, timestamp: '2024-04-10 12:08:14', type: 'info', message: 'Webhook delivered to https://example.com/hook', source: 'webhooks' },
  { id: 10, timestamp: '2024-04-10 12:09:30', type: 'warn', message: 'Rate limit reached for API key sk_live_••1234', source: 'api-keys' },
  { id: 11, timestamp: '2024-04-10 12:10:45', type: 'info', message: 'User dave@example.com banned', source: 'users' },
  { id: 12, timestamp: '2024-04-10 12:11:00', type: 'error', message: 'Database connection timeout', source: 'system' },
];

const typeColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

type Filter = 'all' | 'info' | 'warn' | 'error';

export default function AdminLogsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? mockLogs : mockLogs.filter((l) => l.type === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Logs</h1>

      <div className="flex space-x-2">
        {(['all', 'info', 'warn', 'error'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize',
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Message</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-3">
                  <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', typeColors[log.type])}>
                    {log.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">{log.message}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{log.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

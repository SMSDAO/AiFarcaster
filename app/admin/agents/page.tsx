'use client';

import { DataTable, type Column } from '../components/data-table';
import { cn } from '@/lib/utils';

interface Agent {
  name: string;
  model: string;
  status: string;
  requests24h: number;
  created: string;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const mockAgents: Agent[] = [
  { name: 'FarcasterBot', model: 'gpt-4o', status: 'active', requests24h: 1204, created: '2024-01-10' },
  { name: 'OracleFeeder', model: 'gpt-3.5-turbo', status: 'paused', requests24h: 0, created: '2024-02-15' },
  { name: 'MarketMaker', model: 'claude-3', status: 'error', requests24h: 55, created: '2024-03-20' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const columns: Column<Agent>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'model', header: 'Model' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusColors[String(val)] ?? '')}>
        {String(val)}
      </span>
    ),
  },
  { key: 'requests24h', header: 'Requests (24h)', sortable: true },
  { key: 'created', header: 'Created', sortable: true },
];

export default function AdminAgentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agents</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable columns={columns} data={mockAgents} emptyMessage="No agents found" />
      </div>
    </div>
  );
}

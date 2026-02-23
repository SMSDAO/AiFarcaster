'use client';

import { Plus } from 'lucide-react';
import { DataTable, type Column } from '../components/data-table';
import { cn } from '@/lib/utils';

interface ApiKey {
  key: string;
  name: string;
  created: string;
  lastUsed: string;
  status: string;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const mockKeys: ApiKey[] = [
  { key: 'sk_live_••••••••1234', name: 'Production Key', created: '2024-01-01', lastUsed: '1 hr ago', status: 'active' },
  { key: 'sk_test_••••••••5678', name: 'Testing Key', created: '2024-02-15', lastUsed: '3 days ago', status: 'active' },
  { key: 'sk_live_••••••••9012', name: 'Old Key', created: '2023-12-01', lastUsed: '30 days ago', status: 'revoked' },
];

const columns: Column<ApiKey>[] = [
  { key: 'key', header: 'Key' },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'created', header: 'Created', sortable: true },
  { key: 'lastUsed', header: 'Last Used' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span
        className={cn(
          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
          val === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        )}
      >
        {String(val)}
      </span>
    ),
  },
];

export default function AdminApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition">
          <Plus className="w-4 h-4" />
          <span>Create New Key</span>
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable columns={columns} data={mockKeys} emptyMessage="No API keys found" />
      </div>
    </div>
  );
}

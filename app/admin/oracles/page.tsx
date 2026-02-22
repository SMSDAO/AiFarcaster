'use client';

import { DataTable, type Column } from '../components/data-table';
import { cn } from '@/lib/utils';

interface OracleFeed {
  feed: string;
  price: string;
  lastUpdated: string;
  status: string;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const mockFeeds: OracleFeed[] = [
  { feed: 'ETH/USD', price: '$3,412.50', lastUpdated: '30s ago', status: 'live' },
  { feed: 'USDC/USD', price: '$1.00', lastUpdated: '30s ago', status: 'live' },
  { feed: 'BTC/USD', price: '$68,200.00', lastUpdated: '1 min ago', status: 'live' },
  { feed: 'DEGEN/USD', price: '$0.021', lastUpdated: '15 min ago', status: 'stale' },
  { feed: 'ARB/USD', price: '$0.89', lastUpdated: 'N/A', status: 'error' },
];

const statusColors: Record<string, string> = {
  live: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  stale: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const columns: Column<OracleFeed>[] = [
  { key: 'feed', header: 'Feed', sortable: true },
  { key: 'price', header: 'Price' },
  { key: 'lastUpdated', header: 'Last Updated' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-medium', statusColors[String(val)] ?? '')}>
        {String(val)}
      </span>
    ),
  },
];

export default function AdminOraclesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Oracles</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable columns={columns} data={mockFeeds} emptyMessage="No oracle feeds found" />
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { DataTable, type Column } from '../components/data-table';
import { cn } from '@/lib/utils';

interface AdminUser {
  email: string;
  wallet: string;
  plan: string;
  credits: number;
  status: string;
  joined: string;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const mockUsers: AdminUser[] = [
  { email: 'alice@example.com', wallet: '0x1234…abcd', plan: 'Pro', credits: 500, status: 'active', joined: '2024-01-15' },
  { email: 'bob@example.com', wallet: '0xabcd…5678', plan: 'Free', credits: 100, status: 'active', joined: '2024-02-20' },
  { email: 'carol@example.com', wallet: '0x9999…1111', plan: 'Enterprise', credits: 2000, status: 'active', joined: '2024-03-01' },
  { email: 'dave@example.com', wallet: '0xaaaa…bbbb', plan: 'Pro', credits: 0, status: 'banned', joined: '2024-03-10' },
  { email: 'eve@example.com', wallet: '0xcccc…dddd', plan: 'Free', credits: 50, status: 'active', joined: '2024-04-05' },
];

const columns: Column<AdminUser>[] = [
  { key: 'email', header: 'Email', sortable: true },
  { key: 'wallet', header: 'Wallet Address' },
  { key: 'plan', header: 'Plan', sortable: true },
  { key: 'credits', header: 'Credits', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span
        className={cn(
          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
          val === 'active'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        )}
      >
        {String(val)}
      </span>
    ),
  },
  { key: 'joined', header: 'Joined', sortable: true },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.wallet.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
        <DataTable columns={columns} data={filtered} emptyMessage="No users found" />
      </div>
    </div>
  );
}

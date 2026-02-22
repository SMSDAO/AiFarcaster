'use client';

import { DataTable, type Column } from '../components/data-table';
import { cn } from '@/lib/utils';

interface AdminWallet {
  address: string;
  chain: string;
  balance: string;
  status: string;
  lastActive: string;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const mockWallets: AdminWallet[] = [
  { address: '0x1234…abcd', chain: 'Base', balance: '1.24 ETH', status: 'connected', lastActive: '2 min ago' },
  { address: '0xabcd…5678', chain: 'Ethereum', balance: '0.05 ETH', status: 'disconnected', lastActive: '3 days ago' },
  { address: '0x9999…1111', chain: 'Base', balance: '500 USDC', status: 'connected', lastActive: '1 hr ago' },
];

const columns: Column<AdminWallet>[] = [
  { key: 'address', header: 'Address' },
  { key: 'chain', header: 'Chain', sortable: true },
  { key: 'balance', header: 'Balance' },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span
        className={cn(
          'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
          val === 'connected'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        )}
      >
        {String(val)}
      </span>
    ),
  },
  { key: 'lastActive', header: 'Last Active' },
];

export default function AdminWalletsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallets</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable columns={columns} data={mockWallets} emptyMessage="No wallets found" />
      </div>
    </div>
  );
}

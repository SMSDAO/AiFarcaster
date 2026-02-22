'use client';

import { DollarSign, CreditCard, Gift, FileText } from 'lucide-react';
import { StatusCard } from '../components/status-card';
import { DataTable, type Column } from '../components/data-table';

interface Plan {
  name: string;
  price: string;
  subscribers: number;
  [key: string]: unknown;
}

// MOCK DATA — replace with Supabase query when table exists
const summaryCards = [
  { title: 'MRR', value: '$12,400', change: '+8% MoM', changeType: 'positive' as const, icon: <DollarSign className="w-5 h-5" /> },
  { title: 'Active Subscriptions', value: '342', change: '+15 this week', changeType: 'positive' as const, icon: <CreditCard className="w-5 h-5" /> },
  { title: 'Credits Issued', value: '84,200', change: 'this month', changeType: 'neutral' as const, icon: <Gift className="w-5 h-5" /> },
  { title: 'Outstanding Invoices', value: '7', change: '$1,240 total', changeType: 'negative' as const, icon: <FileText className="w-5 h-5" /> },
];

// MOCK DATA — replace with Supabase query when table exists
const mockPlans: Plan[] = [
  { name: 'Free', price: '$0/mo', subscribers: 890 },
  { name: 'Pro', price: '$29/mo', subscribers: 312 },
  { name: 'Enterprise', price: '$99/mo', subscribers: 30 },
];

const columns: Column<Plan>[] = [
  { key: 'name', header: 'Plan', sortable: true },
  { key: 'price', header: 'Price' },
  { key: 'subscribers', header: 'Subscribers', sortable: true },
];

export default function AdminBillingPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((c) => (
          <StatusCard key={c.title} {...c} />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plans</h2>
        </div>
        <DataTable columns={columns} data={mockPlans} />
      </div>
    </div>
  );
}

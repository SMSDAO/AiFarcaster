'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Addon {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// MOCK DATA — replace with Supabase query when table exists
const initialAddons: Addon[] = [
  { id: 'ai-agents', name: 'AI Agents', description: 'Enable autonomous AI agent creation and deployment.', enabled: true },
  { id: 'oracle-feeds', name: 'Oracle Feeds', description: 'Live price feed integration for on-chain data.', enabled: true },
  { id: 'token-launcher', name: 'Token Launcher', description: 'Allow users to deploy ERC-20 tokens from the dashboard.', enabled: false },
  { id: 'airdrop', name: 'Airdrop Tools', description: 'Bulk token distribution and airdrop management.', enabled: false },
  { id: 'analytics', name: 'Advanced Analytics', description: 'Detailed usage analytics and reporting dashboards.', enabled: true },
  { id: 'webhooks', name: 'Webhooks', description: 'Send real-time event notifications to external services.', enabled: false },
];

export default function AdminAddonsPage() {
  const [addons, setAddons] = useState<Addon[]>(initialAddons);

  function toggle(id: string) {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add-ons</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
        {addons.map((addon) => (
          <div key={addon.id} className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{addon.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{addon.description}</p>
            </div>
            <button
              role="switch"
              aria-checked={addon.enabled}
              aria-label={`Toggle ${addon.name}`}
              onClick={() => toggle(addon.id)}
              className={cn(
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2',
                addon.enabled ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700',
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition',
                  addon.enabled ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

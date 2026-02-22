import { cn } from '@/lib/utils';

interface StatusCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatusCard({ title, value, change, icon, changeType = 'neutral' }: StatusCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
        <span className="text-purple-600">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {change && (
        <div
          className={cn(
            'text-sm',
            changeType === 'positive' && 'text-green-600 dark:text-green-400',
            changeType === 'negative' && 'text-red-600 dark:text-red-400',
            changeType === 'neutral' && 'text-gray-600 dark:text-gray-400',
          )}
        >
          {change}
        </div>
      )}
    </div>
  );
}

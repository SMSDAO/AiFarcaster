import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  rows?: number;
  variant?: 'table' | 'card';
}

export function LoadingSkeleton({ rows = 5, variant = 'table' }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
            i === 0 && 'h-12',
          )}
        />
      ))}
    </div>
  );
}

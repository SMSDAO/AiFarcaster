'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from './empty-state';
import { LoadingSkeleton } from './loading-skeleton';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : data;

  if (loading) return <LoadingSkeleton rows={6} variant="table" />;

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={<Database className="w-12 h-12" />}
        title="No records found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col) => {
              const isSortedColumn = sortKey === String(col.key);
              const ariaSort =
                col.sortable && isSortedColumn
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : undefined;

              return (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400',
                  )}
                  aria-sort={ariaSort}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className={cn(
                        'flex items-center space-x-1 cursor-pointer select-none hover:text-gray-900 dark:hover:text-white'
                      )}
                      onClick={() => handleSort(String(col.key))}
                    >
                      <span>{col.header}</span>
                      {isSortedColumn &&
                        (sortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={`${i}-${Object.values(row).join('::')}`}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-900 dark:text-white">
                  {col.render
                    ? col.render(row[String(col.key)], row)
                    : String(row[String(col.key)] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

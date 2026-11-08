"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import EmptyState from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your request.',
  emptyAction,
  isLoading,
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full p-8 text-center bg-white rounded-2xl border border-slate-200">
        <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 mt-2">Loading table records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={cn('px-4 py-3.5 whitespace-nowrap', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={cn(
                  'hover:bg-slate-50/70 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3.5 whitespace-nowrap', col.className)}>
                    {col.render
                      ? col.render(item)
                      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

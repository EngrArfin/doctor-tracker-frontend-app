"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
  isLoading,
  loadingMessage,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-shadow duration-200 hover:shadow-sm flex flex-col',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className={cn('w-full flex-1 min-h-[260px]', contentClassName)}>
        {isLoading ? (
          <div className="h-full min-h-[240px] flex flex-col items-center justify-center gap-2 text-slate-400">
            <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-slate-500">
              {loadingMessage || 'Loading chart telemetry...'}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;


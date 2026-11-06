import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
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
        {children}
      </div>
    </div>
  );
};

export default ChartCard;


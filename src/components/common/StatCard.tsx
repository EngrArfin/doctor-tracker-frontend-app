import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'teal' | 'indigo' | 'slate';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs. last month',
  icon: Icon,
  variant = 'blue',
  className,
}) => {
  const isPositive = typeof change === 'number' && change >= 0;

  const variantStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 ring-1 ring-blue-100',
      badgeBg: 'bg-blue-500/10 text-blue-700',
    },
    teal: {
      iconBg: 'bg-teal-50 text-teal-600 ring-1 ring-teal-100',
      badgeBg: 'bg-teal-500/10 text-teal-700',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100',
      badgeBg: 'bg-indigo-500/10 text-indigo-700',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
      badgeBg: 'bg-slate-100 text-slate-700',
    },
  };

  const selected = variantStyles[variant] || variantStyles.blue;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300/80 flex flex-col justify-between group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-sans">
              {value}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
            selected.iconBg
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {typeof change === 'number' && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5',
              isPositive
                ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/60'
                : 'text-rose-700 bg-rose-50 ring-1 ring-rose-200/60'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
          <span className="text-slate-400 font-normal truncate">{changePeriod}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;


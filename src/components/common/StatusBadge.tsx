"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { DoctorStatus, PatientStatus } from '@/types';

interface StatusBadgeProps {
  status: DoctorStatus | PatientStatus | string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className,
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
          dot: 'bg-emerald-500 ring-emerald-100',
        };
      case 'Under Observation':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
          dot: 'bg-blue-500 ring-blue-100',
        };
      case 'Recovered':
        return {
          bg: 'bg-teal-50 text-teal-700 border-teal-200/60',
          dot: 'bg-teal-500 ring-teal-100',
        };
      case 'Critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
          dot: 'bg-rose-500 ring-rose-100 animate-pulse',
        };
      case 'On Leave':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
          dot: 'bg-amber-500 ring-amber-100',
        };
      case 'Inactive':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400 ring-slate-100',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400 ring-slate-100',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs gap-1.5' : 'px-2.5 py-1 text-xs gap-2',
        styles.bg,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full shrink-0 ring-2',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            styles.dot
          )}
        />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;


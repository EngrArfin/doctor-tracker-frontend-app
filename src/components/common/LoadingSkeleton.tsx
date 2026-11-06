"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'profile' | 'chart';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 3,
  className,
}) => {
  if (type === 'table') {
    return (
      <div className={cn('w-full space-y-3 p-4 bg-white rounded-2xl border border-slate-200/80', className)}>
        <div className="h-9 bg-slate-100 rounded-lg animate-pulse" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 last:border-0">
            <div className="h-10 w-10 rounded-full bg-slate-100 animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-1/3 bg-slate-100 rounded-sm animate-pulse" />
              <div className="h-3 w-1/4 bg-slate-100 rounded-sm animate-pulse" />
            </div>
            <div className="h-4 w-20 bg-slate-100 rounded-sm animate-pulse hidden sm:block" />
            <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn('p-5 bg-white rounded-2xl border border-slate-200/80 space-y-4', className)}>
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="h-5 w-32 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-4 w-16 bg-slate-100 rounded-md animate-pulse" />
        </div>
        <div className="h-56 bg-slate-50 rounded-xl animate-pulse flex items-end p-4 gap-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="flex-1 bg-slate-200/70 rounded-t-md animate-pulse"
              style={{ height: `${20 + (idx * 11) % 70}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3"
        >
          <div className="flex justify-between items-start">
            <div className="h-3 w-20 bg-slate-100 rounded-sm animate-pulse" />
            <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-md animate-pulse" />
          <div className="h-3 w-28 bg-slate-100 rounded-sm animate-pulse pt-2" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;


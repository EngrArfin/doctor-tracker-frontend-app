"use client";

import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon?: React.ReactNode;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  className,
}) => {
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <div className="absolute left-3 pointer-events-none text-slate-400">
        {icon || <Filter className="h-3.5 w-3.5" />}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-8 pr-8 py-2 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-slate-900 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer shadow-2xs"
        aria-label={label}
      >
        <option value="all">All {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400">
        <ChevronDown className="h-3.5 w-3.5" />
      </div>
    </div>
  );
};

export default FilterDropdown;


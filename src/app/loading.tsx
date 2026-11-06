import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm border border-blue-100">
        <HeartPulse className="h-7 w-7 text-blue-600 animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Loading Doctor Tracker...
      </p>
    </div>
  );
}

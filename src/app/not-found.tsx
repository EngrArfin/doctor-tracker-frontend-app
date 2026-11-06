import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-100">
        <HeartPulse className="h-8 w-8 text-blue-600" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl font-sans">
        404
      </h1>
      <h2 className="text-lg font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
        The clinical route or directory record you are attempting to access does not exist in the Doctor Tracker system.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Login Screen</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

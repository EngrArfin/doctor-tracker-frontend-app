"use client";

import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onOpenAddDoctor?: () => void;
  onOpenAddPatient?: () => void;
  onOpenCommandMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  onOpenAddDoctor,
  onOpenAddPatient,
  onOpenCommandMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { doctors, patients } = useDoctorTracker();

  const notifications = [
    {
      id: 1,
      title: 'High Caseload Alert',
      time: '12m ago',
      type: 'warning',
      text: `${doctors[0]?.name || 'Dr. Jenkins'} currently overseeing 42 patients.`,
    },
    {
      id: 2,
      title: 'New Patient Admission',
      time: '34m ago',
      type: 'info',
      text: `${patients[0]?.name || 'Eleanor Vance'} admitted with hypertension.`,
    },
    {
      id: 3,
      title: 'Audit Log Synchronized',
      time: '2h ago',
      type: 'success',
      text: 'HIPAA compliance audit verified all records.',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & search preview */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search shortcut preview */}
        <div
          onClick={onOpenCommandMenu}
          className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-400 hover:border-slate-300 transition-colors cursor-pointer w-64 md:w-80 group"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="flex-1 text-slate-400 truncate">Search doctors, patients, records...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick actions, notifications, status & user profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Add Buttons on Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {onOpenAddDoctor && (
            <button
              type="button"
              onClick={onOpenAddDoctor}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer shadow-2xs"
            >
              + Add Doctor
            </button>
          )}
          {onOpenAddPatient && (
            <button
              type="button"
              onClick={onOpenAddPatient}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              + Add Patient
            </button>
          )}
        </div>

        {/* System Live Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Live Sync</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 px-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Clinical Alerts</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  3 unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {n.type === 'warning' && <AlertCircle className="h-3 w-3 text-amber-500" />}
                        {n.type === 'info' && <Sparkles className="h-3 w-3 text-blue-500" />}
                        {n.type === 'success' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{n.text}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-medium text-slate-600 hover:text-slate-900"
                >
                  Close notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=96&h=96"
            alt="User profile"
            className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-600/20"
          />
          <div className="hidden sm:block text-left">
            <span className="block text-xs font-semibold text-slate-900 leading-tight">
              Dr. Alex Morgan
            </span>
            <span className="block text-[10px] font-medium text-slate-500">
              Admin Chief
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  ShieldCheck,
  HeartPulse,
  PlusCircle,
  X,
  RotateCcw,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';

interface SidebarProps {
  onCloseMobile?: () => void;
  onOpenAddDoctor?: () => void;
  onOpenAddPatient?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
  onOpenAddDoctor,
  onOpenAddPatient,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { doctors, patients, resetDemoData } = useDoctorTracker();

  const handleLogout = () => {
    router.push('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Telemetry & analytics',
    },
    {
      to: '/doctors',
      label: 'Doctors',
      icon: Stethoscope,
      badge: doctors.length,
      desc: 'Physician roster',
    },
    {
      to: '/patients',
      label: 'Patients',
      icon: Users,
      badge: patients.length,
      desc: 'Admitted registry',
    },
  ];

  return (
    <aside className="h-full w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between select-none shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
      {/* Top Header / Brand */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 bg-white">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 p-0.5 shadow-md shadow-blue-500/15 group-hover:shadow transition-all flex items-center justify-center">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <HeartPulse className="h-4 w-4 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 font-sans flex items-center gap-0.5">
                Doctor<span className="text-teal-600">Tracker</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Clinical Admin
              </span>
            </div>
          </Link>

          {/* Close mobile button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Action Shortcuts */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex gap-2">
            {onOpenAddDoctor && (
              <button
                type="button"
                onClick={() => {
                  onOpenAddDoctor();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100/90 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200/70 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                <span>+ Doctor</span>
              </button>
            )}
            {onOpenAddPatient && (
              <button
                type="button"
                onClick={() => {
                  onOpenAddPatient();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="flex-1 py-1.5 px-2 bg-teal-50 hover:bg-teal-100/90 text-teal-700 text-xs font-semibold rounded-xl border border-teal-200/70 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <PlusCircle className="h-3.5 w-3.5 shrink-0" />
                <span>+ Patient</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="px-3 py-3">
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Clinical Operations
          </p>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const isActive =
                item.to === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer relative',
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors shrink-0',
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                      )}
                    />
                    <div className="leading-tight">
                      <span>{item.label}</span>
                    </div>
                  </div>

                  {item.badge !== null && (
                    <span
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Clinical Operations Status Card */}
        <div className="px-4 py-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/80 text-xs shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>HIPAA Encrypted</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Administrative telemetry active. Hospital caseload calculations sync in real-time.
            </p>

            <button
              type="button"
              onClick={resetDemoData}
              className="mt-2.5 w-full py-1 px-2 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/70 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              <span>Reset Demo Baseline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom User Profile & Sign Out */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=96&h=96"
                alt="Dr. Alex Morgan"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">
                Dr. Alex Morgan
              </p>
              <p className="text-[10px] text-slate-500 font-medium truncate">
                Clinical Chief Admin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out to Login"
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

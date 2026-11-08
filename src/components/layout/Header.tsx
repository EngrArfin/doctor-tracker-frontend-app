"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import doctortrackerLogo from '@/assets/doctorTracker/icon/doctortrackerLogo.png';
import {
  Menu,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  LogOut,
  ShieldCheck,
  RotateCcw,
  UserCog,
} from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';
import { useAppSelector } from '@/redux/hooks/redux-hook';
import { useCurrentUser } from '@/redux/features/auth/authSlice';

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
  const router = useRouter();
  const currentUser = useAppSelector(useCurrentUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { doctors, patients, resetData } = useDoctorTracker();

  const userName = currentUser?.name || 'Dr. Alex Morgan';
  const userEmail = currentUser?.email || 'admin@doctortracker.com';
  const userRole = currentUser?.role === 'DOCTOR' ? 'Attending Physician' : 'Clinical Chief';
  const userAvatar =
    currentUser?.image ||
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=96&h=96';

  // Real-time ticking clock (hospital operations local time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'High Caseload Alert',
      time: 'Just now',
      type: 'warning',
      text: `${doctors[0]?.name || 'Dr. Jenkins'} is overseeing a high patient volume.`,
      read: false,
    },
    {
      id: 2,
      title: 'New Patient Admission',
      time: '18m ago',
      type: 'info',
      text: `${patients[0]?.name || 'Eleanor Vance'} admitted to ICU Ward B.`,
      read: false,
    },
    {
      id: 3,
      title: 'HIPAA Audit Verified',
      time: '1h ago',
      type: 'success',
      text: 'Encrypted telemetry verification passed all checks.',
      read: false,
    },
  ]);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile menu toggle & Global Command Search shortcut */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Mobile brand display */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="relative h-8 w-8 rounded-full overflow-hidden shadow-xs ring-1 ring-slate-200 shrink-0">
            <Image
              src={doctortrackerLogo}
              alt="Doctor Tracker Logo"
              fill
              sizes="32px"
              className="object-cover"
              priority
            />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Doctor<span className="text-teal-600">Tracker</span>
          </span>
        </div>

        {/* Global Search command palette trigger */}
        <div
          onClick={onOpenCommandMenu}
          className="hidden sm:flex items-center gap-2.5 pl-3.5 pr-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-xs text-slate-400 hover:border-slate-300 transition-all cursor-pointer w-64 md:w-80 group shadow-2xs"
          role="button"
          tabIndex={0}
        >
          <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          <span className="flex-1 text-slate-500 truncate text-[11px] sm:text-xs">
            Search doctors, patients, records...
          </span>

        </div>
      </div>

      {/* Right: Real-time telemetry, quick actions, notifications, user profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time Hospital Operations Clock */}
        {currentTime && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-600 text-xs font-mono font-medium shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{currentTime}</span>
            <span className="text-[10px] text-slate-400 font-sans font-semibold uppercase tracking-wider ml-1">
              Live
            </span>
          </div>
        )}

        {/* Quick Add Buttons on Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {onOpenAddDoctor && (
            <button
              type="button"
              onClick={onOpenAddDoctor}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50/90 hover:bg-blue-100/90 rounded-xl border border-blue-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
            >
              + Add Doctor
            </button>
          )}
          {onOpenAddPatient && (
            <button
              type="button"
              onClick={onOpenAddPatient}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-2xs transition-all cursor-pointer hover:shadow-xs"
            >
              + Admit Patient
            </button>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 px-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Clinical Alerts</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-1">
                {notificationsList.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl transition-colors ${n.read ? 'hover:bg-slate-50 opacity-80' : 'bg-blue-50/40 hover:bg-blue-50/70'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        {n.type === 'warning' && <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                        {n.type === 'info' && <Activity className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                        {n.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                        <Clock className="h-2.5 w-2.5" />
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug pl-5">{n.text}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 px-1 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">HIPAA Real-Time Telemetry</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="relative">
              <img
                src={userAvatar}
                alt={userName}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {userName}
              </span>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {userRole}
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 w-fit">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Hospital Admin Access</span>
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-colors"
                >
                  <UserCog className="h-3.5 w-3.5 text-blue-600" />
                  <span>Profile & Photo Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    resetData();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Reset Directory</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

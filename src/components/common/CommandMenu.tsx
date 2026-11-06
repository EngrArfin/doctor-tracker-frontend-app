"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Stethoscope,
  Users,
  LayoutDashboard,
  UserPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAddDoctor: () => void;
  onOpenAddPatient: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onOpenAddDoctor,
  onOpenAddPatient,
}) => {
  const router = useRouter();
  const { doctors, patients } = useDoctorTracker();
  const [query, setQuery] = useState('');

  // Close on Escape, open on Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // handled in parent or toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.specialization.toLowerCase().includes(query.toLowerCase()) ||
      d.hospital.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search physicians, patients, specializations or navigation..."
            className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
          {/* Quick Actions */}
          <div className="py-2">
            <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Shortcuts
            </p>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddDoctor();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Register New Doctor</span>
                </div>
                <span className="text-[10px] text-slate-400">Modal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddPatient();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold">Admit New Patient</span>
                </div>
                <span className="text-[10px] text-slate-400">Modal</span>
              </button>
            </div>
          </div>

          {/* Navigation Pages */}
          <div className="py-2">
            <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => handleSelect('/dashboard')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4 text-slate-500" />
                  <span>Clinical Dashboard</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelect('/doctors')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="h-4 w-4 text-slate-500" />
                  <span>Physicians Directory</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => handleSelect('/patients')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>Patients Management</span>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Doctors Matches */}
          {filteredDoctors.length > 0 && (
            <div className="py-2">
              <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Physicians ({filteredDoctors.length})
              </p>
              <div className="space-y-0.5">
                {filteredDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelect(`/doctors/${doc.id}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="h-6 w-6 rounded-lg object-cover"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {doc.specialization} • {doc.hospital}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                      View Profile
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Patients Matches */}
          {filteredPatients.length > 0 && (
            <div className="py-2">
              <p className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Patients ({filteredPatients.length})
              </p>
              <div className="space-y-0.5">
                {filteredPatients.map((pat) => (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() => handleSelect('/patients')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-left"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{pat.name}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Condition: {pat.condition} • Dr: {pat.doctorName}
                      </span>
                    </div>
                    <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded-full">
                      {pat.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Press ESC to dismiss</span>
          <span className="flex items-center gap-1 font-medium text-slate-500">
            <Sparkles className="h-3 w-3 text-teal-600" />
            Universal Command Palette
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;


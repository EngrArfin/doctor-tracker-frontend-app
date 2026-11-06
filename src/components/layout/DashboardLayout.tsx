"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { DoctorTrackerProvider, useDoctorTracker } from '@/context/DoctorTrackerContext';
import DoctorFormModal from '@/components/forms/DoctorFormModal';
import PatientFormModal from '@/components/forms/PatientFormModal';
import CommandMenu from '@/components/common/CommandMenu';

interface DashboardLayoutContentProps {
  children?: React.ReactNode;
}

const DashboardLayoutContent: React.FC<DashboardLayoutContentProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

  const { addDoctor, addPatient } = useDoctorTracker();

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-40 w-64">
        <Sidebar
          onOpenAddDoctor={() => setIsDoctorModalOpen(true)}
          onOpenAddPatient={() => setIsPatientModalOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl z-50">
            <Sidebar
              onCloseMobile={() => setMobileSidebarOpen(false)}
              onOpenAddDoctor={() => setIsDoctorModalOpen(true)}
              onOpenAddPatient={() => setIsPatientModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenAddDoctor={() => setIsDoctorModalOpen(true)}
          onOpenAddPatient={() => setIsPatientModalOpen(true)}
          onOpenCommandMenu={() => setIsCommandMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Add Doctor Modal */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmitDoctor={addDoctor}
      />

      {/* Global Add Patient Modal */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmitPatient={addPatient}
      />

      {/* Global Command Menu (Cmd+K) */}
      <CommandMenu
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        onOpenAddDoctor={() => setIsDoctorModalOpen(true)}
        onOpenAddPatient={() => setIsPatientModalOpen(true)}
      />
    </div>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
};

export default DashboardLayout;

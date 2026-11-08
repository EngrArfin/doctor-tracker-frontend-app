"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  UserPlus,
  Phone,
  Building2,
  Trash2,
  Eye,
  SlidersHorizontal,
  Calendar,
  Download,
  LayoutGrid,
  LayoutList,
  Mail,
} from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';
import PageHeader from '@/components/common/PageHeader';
import SearchInput from '@/components/common/SearchInput';
import FilterDropdown from '@/components/common/FilterDropdown';
import Pagination from '@/components/common/Pagination';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorFormModal from '@/components/forms/DoctorFormModal';
import PatientFormModal from '@/components/forms/PatientFormModal';
import { SPECIALIZATION_LIST } from '@/data/mockData';
import { toast } from 'sonner';

export default function Doctors() {
  const { doctors, addDoctor, deleteDoctor, addPatient } = useDoctorTracker();

  // View mode: 'table' | 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  // Search, filter, pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === 'grid' ? 6 : 8;
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Modals state
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [selectedDoctorForPatient, setSelectedDoctorForPatient] = useState<string | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<{ id: string; name: string } | null>(null);

  // Filtered doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpec =
        specializationFilter === 'all' || doc.specialization === specializationFilter;

      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        if (dateFilter === '2024') return doc.joinedDate.startsWith('2024');
        if (dateFilter === '2023') return doc.joinedDate.startsWith('2023');
        if (dateFilter === 'older') return parseInt(doc.joinedDate.slice(0, 4)) <= 2022;
        return true;
      })();

      return matchesSearch && matchesSpec && matchesStatus && matchesDate;
    });
  }, [doctors, searchTerm, specializationFilter, statusFilter, dateFilter]);

  // Paginated doctors
  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  const specializationOptions = SPECIALIZATION_LIST.map((s) => ({
    label: s,
    value: s,
  }));

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'On Leave', value: 'On Leave' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  const dateOptions = [
    { label: 'Joined 2024', value: '2024' },
    { label: 'Joined 2023', value: '2023' },
    { label: 'Joined 2022 & Older', value: 'older' },
  ];

  const handleExportDoctors = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Email,Phone,Specialization,Hospital,Status,PatientsCount,Rating\n' +
      filteredDoctors
        .map(
          (d) =>
            `"${d.id}","${d.name}","${d.email}","${d.phone}","${d.specialization}","${d.hospital}","${d.status}",${d.patientsCount},${d.rating}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `physicians_directory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Physicians Directory Exported', {
      description: `Downloaded ${filteredDoctors.length} doctor records as CSV.`,
    });
  };

  const handleConfirmDelete = () => {
    if (doctorToDelete) {
      deleteDoctor(doctorToDelete.id);
      setDoctorToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <PageHeader
          title="Physicians & Specialists"
          description="Explore attending medical staff, clinical credentials, hospital affiliations, and active patient caseloads."
          badge={
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              {doctors.length} Attending Staff
            </span>
          }
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportDoctors}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Physician</span>
              </button>
            </div>
          }
        />

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Staff</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{doctors.length}</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Duty</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
              {doctors.filter((d) => d.status === 'Active').length}
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Specialties</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
              {new Set(doctors.map((d) => d.specialization)).size}
            </p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Rating</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-500 mt-1">★ 4.9</p>
          </div>
        </div>

        {/* Search, Filter & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <SearchInput
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
            placeholder="Search by physician name, email, hospital..."
            className="max-w-md"
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <FilterDropdown
              label="Specialization"
              value={specializationFilter}
              onChange={(val) => {
                setSpecializationFilter(val);
                setCurrentPage(1);
              }}
              options={specializationOptions}
              icon={<Stethoscope className="h-3.5 w-3.5" />}
            />

            <FilterDropdown
              label="Status"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              options={statusOptions}
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
            />

            <FilterDropdown
              label="Joined Date"
              value={dateFilter}
              onChange={(val) => {
                setDateFilter(val);
                setCurrentPage(1);
              }}
              options={dateOptions}
              icon={<Calendar className="h-3.5 w-3.5" />}
            />

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 ml-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Table List View"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content View: Grid or Table */}
        {isContentLoading ? (
          <div className="w-full p-16 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Loading physician directory...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <EmptyState
            title="No physicians found"
            description="No doctor records matched your search query or active filter criteria."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSpecializationFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            }
          />
        ) : viewMode === 'grid' ? (
          /* Modern Physician Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedDoctors.map((doc) => {
              const maxCapacity = 35;
              const caseloadPercent = Math.min(
                100,
                Math.round((doc.patientsCount / maxCapacity) * 100)
              );

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Avatar, Name, Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-2xs group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <Link
                            href={`/doctors/${doc.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 text-sm block transition-colors leading-tight"
                          >
                            {doc.name}
                          </Link>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mt-1 border border-blue-100/80">
                            <Stethoscope className="h-3 w-3" />
                            {doc.specialization}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} size="sm" />
                    </div>

                    {/* Hospital & Contact */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2 truncate">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.hospital}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate text-slate-600">{doc.email}</span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    </div>

                    {/* Caseload Bar */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                        <span className="text-slate-600">Active Caseload</span>
                        <span className="text-slate-900">
                          {doc.patientsCount} / {maxCapacity} patients
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            caseloadPercent > 80
                              ? 'bg-rose-500'
                              : caseloadPercent > 50
                              ? 'bg-blue-600'
                              : 'bg-teal-500'
                          }`}
                          style={{ width: `${caseloadPercent}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>★ {doc.rating.toFixed(1)} Clinical Rating</span>
                        <span>{doc.experienceYears || 8} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="flex-1 py-1.5 px-3 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors text-center shadow-2xs"
                    >
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorForPatient(doc.id)}
                      className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer border border-teal-200/60"
                      title="Admit patient under physician"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDoctorToDelete({ id: doc.id, name: doc.name })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete physician record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 whitespace-nowrap">
                      Physician
                    </th>
                    <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      Specialization
                    </th>
                    <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      Hospital Affiliation
                    </th>
                    <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      Contact
                    </th>
                    <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      Caseload
                    </th>
                    <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {paginatedDoctors.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Doctor name & email */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={doc.avatarUrl}
                            alt={doc.name}
                            className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/doctors/${doc.id}`}
                              title={doc.name}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors block text-sm truncate max-w-[170px] sm:max-w-[210px]"
                            >
                              {doc.name}
                            </Link>
                            <span
                              title={doc.email}
                              className="text-xs text-slate-400 block truncate max-w-[170px] sm:max-w-[210px]"
                            >
                              {doc.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                          <Stethoscope className="h-3 w-3 shrink-0" />
                          <span>{doc.specialization}</span>
                        </span>
                      </td>

                      {/* Hospital */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px] sm:max-w-[200px]" title={doc.hospital}>
                            {doc.hospital}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs font-mono">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{doc.phone}</span>
                        </div>
                      </td>

                      {/* Patients Caseload */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                          {doc.patientsCount} patients
                        </span>
                        <span className="text-[11px] text-amber-600 font-medium">
                          ★ {doc.rating.toFixed(1)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>

                      {/* Actions Dropdown / buttons */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/doctors/${doc.id}`}
                            title="View Profile & Patients"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSelectedDoctorForPatient(doc.id)}
                            title="Assign Patient under this doctor"
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDoctorToDelete({ id: doc.id, name: doc.name })}
                            title="Delete Doctor Record"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-2 shadow-2xs">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredDoctors.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Add Doctor Modal */}
        <DoctorFormModal
          isOpen={isAddDoctorModalOpen}
          onClose={() => setIsAddDoctorModalOpen(false)}
          onSubmitDoctor={addDoctor}
        />

        {/* Add Patient Under Specific Doctor Modal */}
        {selectedDoctorForPatient && (
          <PatientFormModal
            isOpen={Boolean(selectedDoctorForPatient)}
            onClose={() => setSelectedDoctorForPatient(null)}
            defaultDoctorId={selectedDoctorForPatient}
            onSubmitPatient={addPatient}
            title="Admit Patient Under Physician"
          />
        )}

        {/* Confirm Delete Doctor Dialog */}
        <ConfirmDialog
          isOpen={Boolean(doctorToDelete)}
          title="Remove Physician Record"
          description={`Are you sure you want to remove ${doctorToDelete?.name} from the clinical staff directory? This action cannot be undone.`}
          confirmLabel="Confirm Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDoctorToDelete(null)}
        />
      </div>
    </DashboardLayout>
  );
}

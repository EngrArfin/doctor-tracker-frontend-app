"use client";
import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';
import PageHeader from '@/components/common/PageHeader';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SearchInput from '@/components/common/SearchInput';
import FilterDropdown from '@/components/common/FilterDropdown';
import Pagination from '@/components/common/Pagination';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import DoctorFormModal from '@/components/forms/DoctorFormModal';
import PatientFormModal from '@/components/forms/PatientFormModal';
import { SPECIALIZATION_LIST } from '@/data/mockData';
import { toast } from 'sonner';

export default function Doctors() {
  const { doctors, addDoctor, deleteDoctor, addPatient } = useDoctorTracker();

  // Search, filter, pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
        description="Explore the directory of attending doctors, clinical specializations, active hospital wards, and caseload metrics."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {doctors.length} Registered
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
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add New Doctor</span>
            </button>
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Staff</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{doctors.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Active Duty</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
            {doctors.filter((d) => d.status === 'Active').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Specialties</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
            {new Set(doctors.map((d) => d.specialization)).size}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Avg Satisfaction</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">4.8 ★</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
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
            label="Date Range"
            value={dateFilter}
            onChange={(val) => {
              setDateFilter(val);
              setCurrentPage(1);
            }}
            options={dateOptions}
            icon={<Calendar className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Doctors Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {paginatedDoctors.length === 0 ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Physician
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Specialization
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Hospital Affiliation
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Phone & Contact
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Caseload
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
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
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <Link href={`/doctors/${doc.id}`}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block text-sm"
                          >
                            {doc.name}
                          </Link>
                          <span className="text-xs text-slate-400 block truncate max-w-[180px]">
                            {doc.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-100">
                        <Stethoscope className="h-3 w-3" />
                        {doc.specialization}
                      </span>
                    </td>

                    {/* Hospital */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{doc.hospital}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    </td>

                    {/* Patients Caseload */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-900 block">
                        {doc.patientsCount} patients
                      </span>
                      <span className="text-[11px] text-amber-600 font-medium">
                        ★ {doc.rating.toFixed(1)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={doc.status} size="sm" />
                    </td>

                    {/* Actions Dropdown / buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/doctors/${doc.id}`}
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
        )}

        {/* Pagination bar */}
        <div className="px-5">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredDoctors.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
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


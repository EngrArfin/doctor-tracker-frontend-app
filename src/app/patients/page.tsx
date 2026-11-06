"use client";
import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  HeartPulse,
  Stethoscope,
  Trash2,
  Edit3,
  Phone,
  Mail,
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
import PatientFormModal from '@/components/forms/PatientFormModal';
import { Patient } from '@/types';
import { toast } from 'sonner';

export default function Patients() {
  const { patients, doctors, addPatient, updatePatient, deletePatient } = useDoctorTracker();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);

  // Unique conditions for filter
  const conditionOptions = useMemo(() => {
    const set = new Set(patients.map((p) => p.condition));
    return Array.from(set).map((c) => ({ label: c, value: c }));
  }, [patients]);

  const doctorOptions = useMemo(() => {
    return doctors.map((d) => ({
      label: d.name,
      value: d.id,
    }));
  }, [doctors]);

  const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Under Observation', value: 'Under Observation' },
    { label: 'Recovered', value: 'Recovered' },
    { label: 'Critical', value: 'Critical' },
  ];

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((pat) => {
      const matchesSearch =
        pat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pat.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pat.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pat.doctorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCondition =
        conditionFilter === 'all' || pat.condition === conditionFilter;

      const matchesDoctor = doctorFilter === 'all' || pat.doctorId === doctorFilter;

      const matchesStatus = statusFilter === 'all' || pat.status === statusFilter;

      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        if (dateFilter === '2024') return pat.registeredDate.startsWith('2024');
        if (dateFilter === '2023') return pat.registeredDate.startsWith('2023');
        return true;
      })();

      return matchesSearch && matchesCondition && matchesDoctor && matchesStatus && matchesDate;
    });
  }, [patients, searchTerm, conditionFilter, doctorFilter, statusFilter, dateFilter]);

  // Paginated patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPatients.slice(startIndex, startIndex + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  const handleExportPatients = () => {
    toast.success('Patient Records Exported', {
      description: `Downloaded ${filteredPatients.length} patient records as CSV.`,
    });
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      setPatientToDelete(null);
    }
  };

  const handleUpdatePatient = (
    data: Parameters<typeof addPatient>[0] & { doctorName: string; lastVisitDate: string }
  ) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, data);
      setEditingPatient(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Patients Management"
        description="Comprehensive clinical records of active hospital admissions, diagnostic history, and attending physician assignments."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            {patients.length} Total Patients
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPatients}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Admit / Add Patient</span>
            </button>
          </div>
        }
      />

      {/* Patient Stats Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Inpatients</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{patients.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Under Treatment</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
            {patients.filter((p) => p.status === 'Active').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Recovered</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
            {patients.filter((p) => p.status === 'Recovered').length}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Critical Watch</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-1">
            {patients.filter((p) => p.status === 'Critical').length}
          </p>
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
          placeholder="Search by patient name, condition, or doctor..."
          className="max-w-md"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <FilterDropdown
            label="Condition"
            value={conditionFilter}
            onChange={(val) => {
              setConditionFilter(val);
              setCurrentPage(1);
            }}
            options={conditionOptions}
            icon={<HeartPulse className="h-3.5 w-3.5" />}
          />

          <FilterDropdown
            label="Doctor"
            value={doctorFilter}
            onChange={(val) => {
              setDoctorFilter(val);
              setCurrentPage(1);
            }}
            options={doctorOptions}
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
            label="Registered Year"
            value={dateFilter}
            onChange={(val) => {
              setDateFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { label: 'Registered 2024', value: '2024' },
              { label: 'Registered 2023', value: '2023' },
            ]}
            icon={<Calendar className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Patients Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {paginatedPatients.length === 0 ? (
          <EmptyState
            title="No patient records found"
            description="No patients match your current search terms or filter selection."
            action={
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setConditionFilter('all');
                  setDoctorFilter('all');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Patient Name
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Contact Details
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Medical Condition
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Attending Physician
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Registered Date
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {paginatedPatients.map((pat) => (
                  <tr
                    key={pat.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Patient Name & Demographics */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 ring-1 ring-teal-100">
                          {pat.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 block text-sm">
                            {pat.name}
                          </span>
                          <span className="text-xs text-slate-400 block">
                            {pat.gender}, {pat.age} yrs • Blood {pat.bloodGroup || 'O+'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{pat.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                        <span>{pat.phone}</span>
                      </div>
                    </td>

                    {/* Condition */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-900 block">
                        {pat.condition}
                      </span>
                      {pat.notes && (
                        <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                          {pat.notes}
                        </span>
                      )}
                    </td>

                    {/* Assigned Doctor */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-900 text-xs">
                          {pat.doctorName}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <StatusBadge status={pat.status} size="sm" />
                    </td>

                    {/* Registered Date */}
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{pat.registeredDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingPatient(pat)}
                          title="Edit Patient Information"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPatientToDelete({ id: pat.id, name: pat.name })}
                          title="Delete Patient Record"
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

        {/* Pagination Bar */}
        <div className="px-5">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredPatients.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Add Patient Modal */}
      <PatientFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitPatient={addPatient}
      />

      {/* Edit Patient Modal */}
      {editingPatient && (
        <PatientFormModal
          isOpen={Boolean(editingPatient)}
          onClose={() => setEditingPatient(null)}
          initialValues={{
            name: editingPatient.name,
            email: editingPatient.email,
            phone: editingPatient.phone,
            age: editingPatient.age,
            gender: editingPatient.gender,
            condition: editingPatient.condition,
            status: editingPatient.status,
            doctorId: editingPatient.doctorId,
            bloodGroup: editingPatient.bloodGroup,
            notes: editingPatient.notes,
          }}
          onSubmitPatient={handleUpdatePatient}
          title="Edit Patient Record"
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(patientToDelete)}
        title="Delete Patient Record"
        description={`Are you sure you want to delete ${patientToDelete?.name}'s medical record? This cannot be undone.`}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPatientToDelete(null)}
      />
    </div>
  </DashboardLayout>
  );
}


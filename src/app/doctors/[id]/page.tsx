"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Award,
  Users,
  Stethoscope,
  UserPlus,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';
import { DoctorSpecialization, Patient } from '@/types';
import {
  useGetDoctorByIdQuery,
  useGetDoctorPatientsQuery,
} from '@/redux/features/doctor/doctorApi';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import PatientFormModal from '@/components/forms/PatientFormModal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';

export default function DoctorDetails() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { getDoctorById, getPatientsByDoctorId, addPatient, deletePatient, updateDoctor } =
    useDoctorTracker();

  const { data: backendDoc } = useGetDoctorByIdQuery(id, { skip: !id });
  const { data: backendDocPatients } = useGetDoctorPatientsQuery(id, { skip: !id });

  const contextDoctor = getDoctorById(id || '');
  const doctor = backendDoc?.data
    ? {
        ...backendDoc.data,
        specialization: backendDoc.data.specialization as DoctorSpecialization,
      }
    : contextDoctor;

  const contextPatients = id ? getPatientsByDoctorId(id) : [];
  const associatedPatients =
    backendDocPatients?.data && backendDocPatients.data.length > 0
      ? (backendDocPatients.data as Patient[])
      : contextPatients;

  const [activeTab, setActiveTab] = useState<'patients' | 'analytics' | 'schedule'>('patients');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patientToRemove, setPatientToRemove] = useState<{ id: string; name: string } | null>(null);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Edit doctor local form state
  const [editHospital, setEditHospital] = useState(doctor?.hospital || '');
  const [editPhone, setEditPhone] = useState(doctor?.phone || '');
  const [editEmail, setEditEmail] = useState(doctor?.email || '');
  const [editBio, setEditBio] = useState(doctor?.bio || '');

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="py-12">
          <EmptyState
            title="Physician Not Found"
            description="The requested doctor record does not exist or was removed from the active directory."
            action={
              <Link href="/doctors"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
              >
                Back to Doctors Directory
              </Link>
            }
          />
        </div>
      </DashboardLayout>
    );
  }

  const handleConfirmRemovePatient = () => {
    if (patientToRemove) {
      deletePatient(patientToRemove.id);
      setPatientToRemove(null);
    }
  };

  const handleSaveDoctorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctor(doctor.id, {
      hospital: editHospital,
      phone: editPhone,
      email: editEmail,
      bio: editBio,
    });
    setIsEditDoctorModalOpen(false);
    toast.success('Physician Profile Updated', {
      description: 'Contact and affiliation records successfully refreshed.',
    });
  };

  // 6 Months consultation trend for this doctor
  const doctorConsultationTrend = [
    { month: 'Sep', visits: Math.max(12, doctor.patientsCount - 16), followups: 8 },
    { month: 'Oct', visits: Math.max(16, doctor.patientsCount - 12), followups: 11 },
    { month: 'Nov', visits: Math.max(18, doctor.patientsCount - 8), followups: 10 },
    { month: 'Dec', visits: Math.max(22, doctor.patientsCount - 4), followups: 14 },
    { month: 'Jan', visits: Math.max(26, doctor.patientsCount - 2), followups: 16 },
    { month: 'Feb', visits: doctor.patientsCount + associatedPatients.length, followups: 18 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
      {/* Breadcrumb Back Link */}
      <div className="flex items-center justify-between">
        <Link href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Physicians Directory</span>
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={doctor.status} />
          <button
            type="button"
            onClick={() => {
              setEditHospital(doctor.hospital);
              setEditPhone(doctor.phone);
              setEditEmail(doctor.email);
              setEditBio(doctor.bio || '');
              setIsEditDoctorModalOpen(true);
            }}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title="Edit Physician Profile"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Doctor Profile Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                  {doctor.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Stethoscope className="h-3 w-3" />
                  {doctor.specialization}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{doctor.hospital}</span>
                {doctor.roomNumber && (
                  <span className="text-slate-400">• {doctor.roomNumber}</span>
                )}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {doctor.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsAddPatientModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Admit Patient under {doctor.name.split(' ')[1] || 'Doctor'}</span>
            </button>
          </div>
        </div>

        {/* Bio paragraph */}
        {doctor.bio && (
          <div className="mt-6 pt-5 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            <p className="font-semibold text-slate-800 text-xs uppercase tracking-wider mb-1">
              Physician Biography & Clinical Background
            </p>
            <p>{doctor.bio}</p>
            {doctor.education && (
              <p className="mt-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-700 font-semibold">Credentials:</span> {doctor.education}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Current Caseload</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{associatedPatients.length} Active</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Assigned patients</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Experience</span>
            <Award className="h-4 w-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{doctor.experienceYears} Years</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Clinical practice</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Physician Rating</span>
            <span className="text-amber-500">★</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{doctor.rating.toFixed(1)} / 5.0</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Patient satisfaction</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Onboarding Date</span>
            <Calendar className="h-4 w-4 text-slate-400" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-slate-900">{doctor.joinedDate}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Hospital credentialed</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200/80 gap-6 text-sm font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab('patients')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'patients'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Associated Patients ({associatedPatients.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Caseload Analytics</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Clinic Schedule & Practice</span>
        </button>
      </div>

      {/* Tab 1: Associated Patients */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Associated Patients ({associatedPatients.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Patients directly assigned under {doctor.name}&apos;s care team
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddPatientModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Add Patient</span>
            </button>
          </div>

          {isContentLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="h-7 w-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Loading assigned patient records...</p>
            </div>
          ) : associatedPatients.length === 0 ? (
            <div className="py-8">
              <EmptyState
                title="No patients currently assigned"
                description={`There are currently no active patient records under ${doctor.name}.`}
                action={
                  <button
                    type="button"
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl"
                  >
                    Admit First Patient
                  </button>
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="px-4 py-3 whitespace-nowrap">Patient Name</th>
                    <th className="px-4 py-3 whitespace-nowrap">Condition / Diagnosis</th>
                    <th className="px-4 py-3 whitespace-nowrap">Contact</th>
                    <th className="px-4 py-3 whitespace-nowrap">Blood Group</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 whitespace-nowrap">Admitted Date</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {associatedPatients.map((pat) => (
                    <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0 ring-1 ring-teal-100">
                            {pat.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-900 block truncate max-w-[150px] sm:max-w-[200px]" title={pat.name}>
                              {pat.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block">{pat.gender}, {pat.age} yrs</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        <span className="truncate max-w-[150px] sm:max-w-[200px] block" title={pat.condition}>
                          {pat.condition}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        <div className="truncate max-w-[140px] sm:max-w-[180px]" title={pat.email}>{pat.email}</div>
                        <div className="font-mono">{pat.phone}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {pat.bloodGroup || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={pat.status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap font-mono">
                        {pat.registeredDate}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setPatientToRemove({ id: pat.id, name: pat.name })}
                          title="Remove patient from list"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Caseload Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900">Monthly Patient Volume</h3>
            <p className="text-xs text-slate-500 mb-4">Patient appointments and clinical follow-ups</p>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={doctorConsultationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="docVisitsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="Appointments"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fill="url(#docVisitsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="followups"
                    name="Follow-ups"
                    stroke="#0D9488"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Treatment Performance</h3>
              <p className="text-xs text-slate-500 mb-4">Clinical outcome adherence benchmarks</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Recovery Rate</span>
                    <span className="text-emerald-600">92.4%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Patient Retention</span>
                    <span className="text-blue-600">88.1%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '88.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Charting Compliance</span>
                    <span className="text-teal-600">99.0%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '99.0%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 mt-4">
              <span className="font-semibold block">Quality Benchmark Met</span>
              <span className="text-blue-700 text-[11px]">Ranked in the top 5% of hospital specialists for patient safety and timely charting.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Clinic Schedule & Hours */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Office Consultation Hours</span>
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between font-medium">
                <span className="text-slate-600">Monday - Wednesday</span>
                <span className="text-slate-900 font-semibold">08:30 AM – 04:30 PM</span>
              </div>
              <div className="py-2.5 flex justify-between font-medium">
                <span className="text-slate-600">Thursday - Friday</span>
                <span className="text-slate-900 font-semibold">09:00 AM – 03:30 PM</span>
              </div>
              <div className="py-2.5 flex justify-between font-medium">
                <span className="text-slate-600">Saturday (Alternate)</span>
                <span className="text-amber-700 font-semibold">10:00 AM – 01:00 PM (Emergency Call)</span>
              </div>
              <div className="py-2.5 flex justify-between font-medium text-slate-400">
                <span>Sunday</span>
                <span>Off Duty</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Credentialing & Coverage</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Primary Ward: {doctor.hospital} ({doctor.roomNumber || 'Main Pavilion'})</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Standard Consultation: ${doctor.consultationFee || 220} USD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Accepted Networks: BlueCross, Medicare, UnitedHealth, Aetna</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Emergency Pager: Internal Ext. #8892</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <PatientFormModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        defaultDoctorId={doctor.id}
        onSubmitPatient={addPatient}
        title={`Admit Patient under ${doctor.name}`}
      />

      {/* Edit Doctor Modal */}
      {isEditDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Physician Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditDoctorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoctorEdit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Affiliation
                </label>
                <input
                  type="text"
                  value={editHospital}
                  onChange={(e) => setEditHospital(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Direct Contact Phone
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biography & Specialties
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditDoctorModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Remove Patient Dialog */}
      <ConfirmDialog
        isOpen={Boolean(patientToRemove)}
        title="Remove Patient Record"
        description={`Are you sure you want to remove ${patientToRemove?.name} from this doctor's care list?`}
        confirmLabel="Remove Patient"
        onConfirm={handleConfirmRemovePatient}
        onCancel={() => setPatientToRemove(null)}
      />
    </div>
  </DashboardLayout>
  );
}


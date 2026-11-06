"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Stethoscope,
  UserPlus,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useDoctorTracker } from '@/context/DoctorTrackerContext';
import StatCard from '@/components/common/StatCard';
import ChartCard from '@/components/common/ChartCard';
import StatusBadge from '@/components/common/StatusBadge';
import PageHeader from '@/components/common/PageHeader';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DoctorFormModal from '@/components/forms/DoctorFormModal';
import PatientFormModal from '@/components/forms/PatientFormModal';
import { toast } from 'sonner';

export default function Dashboard() {
  const {
    doctors,
    patients,
    stats,
    registrationTrends,
    patientsPerDoctor,
    specializations,
    addDoctor,
    addPatient,
  } = useDoctorTracker();

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [trendRange, setTrendRange] = useState<'12m' | '6m'>('12m');

  const filteredTrends =
    trendRange === '6m' ? registrationTrends.slice(-6) : registrationTrends;

  const recentPatients = patients.slice(0, 5);
  const recentDoctors = doctors.slice(0, 4);

  const handleExportSummary = () => {
    toast.success('Clinical Analytics Exported', {
      description: 'Monthly summary data downloaded as CSV format.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Page Header */}
      <PageHeader
        title="Clinical Operations Dashboard"
        description="Real-time healthcare analytics, physician directory statistics, and clinical caseload trends."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Admit Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Add Doctor</span>
            </button>
          </div>
        }
      />

      {/* HIPAA Compliance Reminder Notice (from spec) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
              HIPAA Compliance & Charting Reminder
            </h4>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              All clinical encounter notes must be electronically co-signed within 24 hours of patient discharge. System audit logs active.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-full whitespace-nowrap self-end sm:self-center">
          Audit Verified
        </span>
      </div>

      {/* 4 Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Doctors"
          value={stats.totalDoctors}
          change={stats.doctorsGrowthPct}
          changePeriod="vs. last month"
          icon={Stethoscope}
          variant="blue"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          change={stats.patientsGrowthPct}
          changePeriod="vs. last month"
          icon={Users}
          variant="teal"
        />
        <StatCard
          title="New Patients"
          value={stats.newPatientsThisMonth}
          change={stats.newPatientsGrowthPct}
          changePeriod="last 30 days"
          icon={UserPlus}
          variant="indigo"
        />
        <StatCard
          title="Avg. Patients / Doctor"
          value={stats.averagePatientsPerDoctor}
          change={stats.avgRatioGrowthPct}
          changePeriod="caseload capacity"
          icon={Activity}
          variant="slate"
        />
      </div>

      {/* Charts Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Patient Registration Trend (Area Chart) - 2 cols */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Patient Registration & Admission Trend"
            subtitle="Monthly inbound patients and hospital admissions over time"
            action={
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setTrendRange('6m')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    trendRange === '6m' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setTrendRange('12m')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    trendRange === '12m' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  12 Months
                </button>
              </div>
            }
          >
            <div className="h-[280px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="patientTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="admissionsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
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
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    name="Registered Patients"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#patientTrendGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="admissions"
                    name="Admissions"
                    stroke="#0D9488"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#admissionsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Total Patient Registrations
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                Acute Inpatient Admissions
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Specialization Donut Chart - 1 col */}
        <div>
          <ChartCard
            title="Specialization Distribution"
            subtitle="Physician breakdown by medical discipline"
          >
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={specializations}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {specializations.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}% share`, name]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend Grid */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              {specializations.slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Patients per Doctor Bar Chart */}
      <ChartCard
        title="Caseload Distribution: Patients per Doctor"
        subtitle="Active caseload monitored per attending physician"
        action={
          <Link href="/doctors"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View All Doctors</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="h-[260px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientsPerDoctor} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="doctorName" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                formatter={(value: any) => [`${value} active patients`, 'Caseload']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="patientCount" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Two-Column Section: Recent Patients & Recent Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients Table / List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Patients</h3>
                <p className="text-xs text-slate-500">Newly registered admissions and diagnoses</p>
              </div>
              <Link href="/patients"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentPatients.map((pat) => (
                <div key={pat.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-blue-100">
                      {pat.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{pat.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {pat.condition} • {pat.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={pat.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link href="/patients"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Manage All {patients.length} Patients</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Doctors List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Active Physicians</h3>
                <p className="text-xs text-slate-500">Attending hospital doctors & caseloads</p>
              </div>
              <Link href="/doctors"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentDoctors.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link href={`/doctors/${doc.id}`}
                        className="text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors truncate block"
                      >
                        {doc.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doc.specialization} • {doc.hospital}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 block">
                      {doc.patientsCount} patients
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold">
                      ★ {doc.rating.toFixed(1)} rating
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link href="/doctors"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Explore Doctors Directory ({doctors.length})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Add Modals for Local State Interactions */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmitDoctor={addDoctor}
      />

      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmitPatient={addPatient}
      />
    </div>
  </DashboardLayout>
  );
}


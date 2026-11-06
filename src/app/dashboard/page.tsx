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
  Calendar,
  Sparkles,
  HeartPulse,
  TrendingUp,
  Clock,
  CheckCircle2,
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
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value\n' +
      `Total Doctors,${stats.totalDoctors}\n` +
      `Total Patients,${stats.totalPatients}\n` +
      `New Patients This Month,${stats.newPatientsThisMonth}\n` +
      `Average Patients Per Doctor,${stats.averagePatientsPerDoctor}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `doctor_tracker_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Clinical Analytics Exported', {
      description: 'Monthly summary data downloaded as CSV.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-12">
        {/* Welcome Greeting & Quick Telemetry Header */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A2540] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-32 -mb-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-xs font-semibold text-blue-300 mb-3 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-teal-300" />
                <span>Clinical Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                Good morning, Dr. Alex Morgan 👋
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Hospital census is steady. Telemetry node verified{' '}
                <span className="font-semibold text-teal-300">
                  {stats.totalDoctors} active physicians
                </span>{' '}
                and{' '}
                <span className="font-semibold text-blue-300">
                  {stats.totalPatients} registered patients
                </span>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportSummary}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl backdrop-blur-sm transition-all cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-slate-300" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPatientModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all cursor-pointer shadow-md shadow-teal-500/20 hover:scale-[1.02]"
              >
                <UserPlus className="h-3.5 w-3.5 text-slate-900" />
                <span>Admit Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setIsDoctorModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/25 hover:scale-[1.02]"
              >
                <Stethoscope className="h-3.5 w-3.5" />
                <span>Add Doctor</span>
              </button>
            </div>
          </div>

          {/* Quick telemetry indicators */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ward Inpatient Load: <strong>86% Optimal</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span>On-Call Physicians: <strong>6 Available</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-400" />
              <span>Audit Logging: <strong>HIPAA Certified</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Key Statistics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="Total Physicians"
            value={stats.totalDoctors}
            change={stats.doctorsGrowthPct}
            changePeriod="vs. last month"
            icon={Stethoscope}
            variant="blue"
          />
          <StatCard
            title="Active Patients"
            value={stats.totalPatients}
            change={stats.patientsGrowthPct}
            changePeriod="vs. last month"
            icon={Users}
            variant="teal"
          />
          <StatCard
            title="New Admissions"
            value={stats.newPatientsThisMonth}
            change={stats.newPatientsGrowthPct}
            changePeriod="last 30 days"
            icon={UserPlus}
            variant="indigo"
          />
          <StatCard
            title="Avg Caseload / Doctor"
            value={stats.averagePatientsPerDoctor}
            change={stats.avgRatioGrowthPct}
            changePeriod="capacity index"
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
              subtitle="Monthly inbound admissions and surgical registrations"
              action={
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setTrendRange('6m')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      trendRange === '6m'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendRange('12m')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      trendRange === '12m'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    12 Months
                  </button>
                </div>
              }
            >
              <div className="h-[290px] w-full pt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={filteredTrends}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
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
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#64748B' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        padding: '10px 14px',
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
                      name="Inpatient Admissions"
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
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specializations}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {specializations.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => [`${value} physicians`, name]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Custom Legend Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
                {specializations.slice(0, 6).map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-auto">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Caseload Distribution: Patients per Doctor */}
        <ChartCard
          title="Caseload Distribution: Patients per Attending Physician"
          subtitle="Real-time patient count monitored against recommended clinical ratios"
          action={
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Manage Physicians</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="h-[270px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={patientsPerDoctor}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="doctorName"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} active patients`, 'Assigned Caseload']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="patientCount"
                  fill="#2563EB"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Two-Column Section: Recent Patients & Recent Doctors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients Table / List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Recent Inpatient Admissions</h3>
                  <p className="text-xs text-slate-500">Newly assigned patient charts and condition triage</p>
                </div>
                <Link
                  href="/patients"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
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
                        <p className="text-xs font-bold text-slate-900 truncate">{pat.name}</p>
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

            <div className="pt-3.5 border-t border-slate-100 mt-2">
              <Link
                href="/patients"
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Manage All {patients.length} Registered Patients</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Physicians List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Attending Physicians</h3>
                  <p className="text-xs text-slate-500">Hospital department staff & clinical performance</p>
                </div>
                <Link
                  href="/doctors"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
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
                        <Link
                          href={`/doctors/${doc.id}`}
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors truncate block"
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
                      <span className="text-[10px] text-amber-600 font-bold flex items-center justify-end gap-1">
                        ★ {doc.rating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 mt-2">
              <Link
                href="/doctors"
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs"
              >
                <span>Explore Doctors Directory ({doctors.length})</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Global Modals for Rapid Actions */}
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

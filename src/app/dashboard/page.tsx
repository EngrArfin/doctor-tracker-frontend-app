"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Stethoscope,
  UserPlus,
  Activity,
  ArrowUpRight,
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
  const [isContentLoading, setIsContentLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

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
        {/* Welcome Greeting Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 p-6 sm:p-7 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Good morning, Dr. Alex Morgan
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportSummary}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl backdrop-blur-xs transition-all cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-white" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-teal-950 bg-teal-300 hover:bg-teal-200 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <UserPlus className="h-3.5 w-3.5 text-teal-950" />
              <span>Admit Patient</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Stethoscope className="h-3.5 w-3.5 text-blue-700" />
              <span>Add Doctor</span>
            </button>
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
            isLoading={isContentLoading}
          />
          <StatCard
            title="Active Patients"
            value={stats.totalPatients}
            change={stats.patientsGrowthPct}
            changePeriod="vs. last month"
            icon={Users}
            variant="teal"
            isLoading={isContentLoading}
          />
          <StatCard
            title="New Admissions"
            value={stats.newPatientsThisMonth}
            change={stats.newPatientsGrowthPct}
            changePeriod="last 30 days"
            icon={UserPlus}
            variant="indigo"
            isLoading={isContentLoading}
          />
          <StatCard
            title="Avg Caseload / Doctor"
            value={stats.averagePatientsPerDoctor}
            change={stats.avgRatioGrowthPct}
            changePeriod="capacity index"
            icon={Activity}
            variant="slate"
            isLoading={isContentLoading}
          />
        </div>

        {/* Charts Grid: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Patient Registration Trend (Area Chart) - 2 cols */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Patient Registration & Admission Trend"
              subtitle="Monthly inbound admissions and surgical registrations"
              isLoading={isContentLoading}
              loadingMessage="Loading admission trends..."
              action={
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setTrendRange('6m')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${trendRange === '6m'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'hover:text-slate-900'
                      }`}
                  >
                    6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrendRange('12m')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${trendRange === '12m'
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
              isLoading={isContentLoading}
              loadingMessage="Loading discipline metrics..."
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
                      formatter={(value, name) => [`${value} physicians`, String(name)]}
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
          isLoading={isContentLoading}
          loadingMessage="Loading caseload telemetry..."
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
                  formatter={(value) => [`${value} active patients`, 'Assigned Caseload']}
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

              {isContentLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">Loading admission records...</span>
                </div>
              ) : (
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
              )}
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

              {isContentLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-400 font-medium">Loading active physician roster...</span>
                </div>
              ) : (
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
              )}
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

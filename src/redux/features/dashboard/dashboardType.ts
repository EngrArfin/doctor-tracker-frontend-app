import { ApiResponse } from '@/redux/types/api.type';

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  activeDoctors: number;
  criticalPatients: number;
  averagePatientsPerDoctor: number;
  newPatientsThisMonth: number;
  doctorsGrowthPct: number;
  patientsGrowthPct: number;
  newPatientsGrowthPct: number;
  avgRatioGrowthPct: number;
}

export interface RegistrationTrend {
  month: string;
  patients: number;
  admissions: number;
}

export interface PatientsPerDoctorMetric {
  doctorName: string;
  patientCount: number;
  specialization: string;
}

export interface SpecializationDistribution {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export type DashboardStatsResponse = ApiResponse<DashboardStats>;
export type DashboardTrendsResponse = ApiResponse<RegistrationTrend[]>;
export type PatientsPerDoctorResponse = ApiResponse<PatientsPerDoctorMetric[]>;
export type SpecializationsResponse = ApiResponse<SpecializationDistribution[]>;
export type ResetDataResponse = ApiResponse<null>;


// Core Domain Types for Doctor Tracker System

export type DoctorSpecialization =
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Dermatology'
  | 'Oncology'
  | 'Psychiatry'
  | 'General Medicine';

export type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

export type PatientStatus =
  | 'Active'
  | 'Recovered'
  | 'Under Observation'
  | 'Critical';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: DoctorSpecialization;
  hospital: string;
  avatarUrl?: string;
  patientsCount: number;
  joinedDate: string;
  status: DoctorStatus;
  experienceYears: number;
  rating: number;
  roomNumber?: string;
  bio?: string;
  education?: string;
  consultationFee?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  condition: string;
  status: PatientStatus;
  doctorId: string;
  doctorName: string;
  registeredDate: string;
  lastVisitDate: string;
  avatarUrl?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  averagePatientsPerDoctor: number;
  doctorsGrowthPct: number;
  patientsGrowthPct: number;
  newPatientsGrowthPct: number;
  avgRatioGrowthPct: number;
}

export interface PatientRegistrationTrend {
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
  name: DoctorSpecialization | string;
  value: number;
  percentage?: number;
  color: string;
}

export interface DoctorFilterState {
  search: string;
  specialization: string;
  dateRange: 'all' | 'last-30' | 'last-90' | 'this-year';
}

export interface PatientFilterState {
  search: string;
  condition: string;
  doctorId: string;
  dateRange: 'all' | 'last-30' | 'last-90' | 'this-year';
  status: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

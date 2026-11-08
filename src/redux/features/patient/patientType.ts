import { ApiResponse } from '@/redux/types/api.type';

export type PatientStatus = 'Active' | 'Recovered' | 'Under Observation' | 'Critical';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientDto {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  condition: string;
  status: PatientStatus;
  doctorId: string;
  doctorName: string;
  registeredDate?: string;
  lastVisitDate?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  notes?: string;
}

export type UpdatePatientDto = Partial<CreatePatientDto>;

export interface PatientQueryParams {
  search?: string;
  condition?: string;
  doctorId?: string;
  status?: string;
}

export type PatientResponse = ApiResponse<Patient>;
export type PatientsListResponse = ApiResponse<Patient[]>;
export type DeletePatientResponse = ApiResponse<null>;


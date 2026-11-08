import { ApiResponse } from '@/redux/types/api.type';

export type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospital: string;
  avatarUrl: string;
  patientsCount: number;
  joinedDate: string;
  status: DoctorStatus;
  experienceYears: number;
  rating: number;
  roomNumber?: string;
  bio?: string;
  education?: string;
  consultationFee?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorDto {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospital: string;
  avatarUrl?: string;
  patientsCount?: number;
  status?: DoctorStatus;
  experienceYears?: number;
  rating?: number;
  roomNumber?: string;
  bio?: string;
  education?: string;
  consultationFee?: number;
}

export type UpdateDoctorDto = Partial<CreateDoctorDto>;

export interface DoctorQueryParams {
  search?: string;
  specialization?: string;
  status?: string;
}

export type DoctorResponse = ApiResponse<Doctor>;
export type DoctorsListResponse = ApiResponse<Doctor[]>;
export type DeleteDoctorResponse = ApiResponse<null>;


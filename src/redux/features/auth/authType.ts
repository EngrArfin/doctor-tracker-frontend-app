import { ApiResponse } from '@/redux/types/api.type';
import { User, UserRole } from '../user/userType';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  specialization?: string;
  hospital?: string;
}

export interface AuthData {
  accessToken: string;
  user: User;
}

export type AuthResponse = ApiResponse<AuthData>;
export type ProfileResponse = ApiResponse<User>;
export type LogoutResponse = ApiResponse<null>;

export interface TAuth {
  user: User | null;
  token: string | null;
}


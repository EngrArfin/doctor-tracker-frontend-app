import { ApiResponse } from '@/redux/types/api.type';

export type UserRole = 'ADMIN' | 'DOCTOR' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
  phone?: string | null;
  specialization?: string | null;
  hospital?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  specialization?: string;
  hospital?: string;
  image?: string;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export interface UpdateUserRoleDto {
  role: UserRole;
}

export type UserResponse = ApiResponse<User>;
export type UsersListResponse = ApiResponse<User[]>;
export type DeleteUserResponse = ApiResponse<null>;


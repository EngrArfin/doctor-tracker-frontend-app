import { baseApi } from '@/redux/hooks/baseApi';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  ProfileResponse,
  LogoutResponse,
} from './authType';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),

    getMe: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;

import { baseApi } from '@/redux/hooks/baseApi';
import {
  DashboardStatsResponse,
  DashboardTrendsResponse,
  PatientsPerDoctorResponse,
  SpecializationsResponse,
  ResetDataResponse,
} from './dashboardType';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: '/dashboard/stats',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getDashboardTrends: builder.query<DashboardTrendsResponse, void>({
      query: () => ({
        url: '/dashboard/trends',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getPatientsPerDoctor: builder.query<PatientsPerDoctorResponse, void>({
      query: () => ({
        url: '/dashboard/patients-per-doctor',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    getSpecializations: builder.query<SpecializationsResponse, void>({
      query: () => ({
        url: '/dashboard/specializations',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    resetDashboardData: builder.mutation<ResetDataResponse, void>({
      query: () => ({
        url: '/dashboard/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Dashboard', 'Doctor', 'Patient'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardTrendsQuery,
  useGetPatientsPerDoctorQuery,
  useGetSpecializationsQuery,
  useResetDashboardDataMutation,
} = dashboardApi;


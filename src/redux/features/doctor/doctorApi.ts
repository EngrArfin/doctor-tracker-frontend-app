import { baseApi } from '@/redux/hooks/baseApi';
import {
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorQueryParams,
  DoctorResponse,
  DoctorsListResponse,
  DeleteDoctorResponse,
} from './doctorType';
import { ApiResponse } from '@/redux/types/api.type';
import { Patient } from '../patient/patientType';

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<DoctorsListResponse, DoctorQueryParams | void>({
      query: (params) => ({
        url: '/doctors',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Doctor' as const, id })),
              { type: 'Doctor', id: 'LIST' },
            ]
          : [{ type: 'Doctor', id: 'LIST' }],
    }),

    getDoctorById: builder.query<DoctorResponse, string>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Doctor', id }],
    }),

    getDoctorPatients: builder.query<ApiResponse<Patient[]>, string>({
      query: (id) => ({
        url: `/doctors/${id}/patients`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [
        { type: 'Doctor', id: `PATIENTS_${id}` },
        { type: 'Patient', id: 'LIST' },
      ],
    }),

    createDoctor: builder.mutation<DoctorResponse, CreateDoctorDto>({
      query: (body) => ({
        url: '/doctors',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Doctor', id: 'LIST' }, 'Dashboard'],
    }),

    updateDoctor: builder.mutation<DoctorResponse, { id: string; data: UpdateDoctorDto }>({
      query: ({ id, data }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteDoctor: builder.mutation<DeleteDoctorResponse, string>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Doctor', id },
        { type: 'Doctor', id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorPatientsQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;

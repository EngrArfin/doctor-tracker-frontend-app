import { baseApi } from '@/redux/hooks/baseApi';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryParams,
  PatientResponse,
  PatientsListResponse,
  DeletePatientResponse,
} from './patientType';

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<PatientsListResponse, PatientQueryParams | void>({
      query: (params) => ({
        url: '/patients',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Patient' as const, id })),
              { type: 'Patient', id: 'LIST' },
            ]
          : [{ type: 'Patient', id: 'LIST' }],
    }),

    getPatientById: builder.query<PatientResponse, string>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Patient', id }],
    }),

    createPatient: builder.mutation<PatientResponse, CreatePatientDto>({
      query: (body) => ({
        url: '/patients',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Patient', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
        'Dashboard',
      ],
    }),

    updatePatient: builder.mutation<PatientResponse, { id: string; data: UpdatePatientDto }>({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deletePatient: builder.mutation<DeletePatientResponse, string>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Patient', id },
        { type: 'Patient', id: 'LIST' },
        { type: 'Doctor', id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;

import { baseApi } from '@/redux/hooks/baseApi';
import {
  UserResponse,
  UsersListResponse,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  DeleteUserResponse,
} from './userType';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersListResponse, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation<UserResponse, CreateUserDto>({
      query: (body) => ({
        url: '/user',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation<UserResponse, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    updateUserRole: builder.mutation<UserResponse, { id: string } & UpdateUserRoleDto>({
      query: ({ id, role }) => ({
        url: `/user/update/${id}`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;


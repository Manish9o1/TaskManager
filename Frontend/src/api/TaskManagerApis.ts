import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Task,
  UserData,
} from "../shared/model";
import type { RootState } from "../store/TaskAppStore";
type ApiResponse<T> = {
  isSuccess: boolean;
  result: T;
  message: string;
  errors: string[];
};
export const TaskManagerApis = createApi({
  reducerPath: "TaskManagerApis",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:44375/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).AppAuth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (user) => ({
        url: "Auth/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "Auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getTasks: builder.query<Task[], void>({
      query: () => ({
        url: "Task",
        method: "GET",
      }),
      providesTags: ["Task"],
      transformResponse: (response: ApiResponse<Task[]>) => response.result,
    }),

    getUser: builder.query<UserData[], void>({
      query: () => ({
        url: "Task/GetUser",
        method: "GET",
      }),
      providesTags: ["Task"],
      transformResponse: (response: ApiResponse<UserData[]>) => response.result,
    }),

    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "Task",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, "id">>({
      query: ({ id, ...patch }) => ({
        url: `Task/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `Task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = TaskManagerApis;

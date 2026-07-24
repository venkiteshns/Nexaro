import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/admin/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    adminGetPendingVerificationUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/admin/users/pending-verification?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      extraOptions: { isAdmin: true },
      providesTags: ["Users"],
    }),

    adminSuspendUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/suspend`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminUnsuspendUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/unsuspend`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminApproveUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminRejectUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminGetAllTasks: builder.query({
      query: ({
        page = 1,
        limit = 4,
        search = "",
        status = "all",
        category = "all",
      } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (search) params.append("search", search);
        if (status !== "all") params.append("status", status);
        if (category !== "all") params.append("category", category);
        return {
          url: `/admin/tasks?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Tasks"],
    }),

    adminTaskDelete: builder.mutation({
      query: (taskId) => ({
        url: `/admin/task/cancel/${taskId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Tasks"],
    }),

    adminGetTaskDetails: builder.query({
      query: (taskId) => ({
        url: `/admin/task/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Admin_Task_Details"],
    }),
  }),
});

export const {
  useAdminGetUsersQuery,
  useAdminGetPendingVerificationUsersQuery,
  useAdminSuspendUserMutation,
  useAdminUnsuspendUserMutation,
  useAdminApproveUserMutation,
  useAdminRejectUserMutation,
  useAdminGetAllTasksQuery,
  useAdminTaskDeleteMutation,
  useAdminGetTaskDetailsQuery,
} = adminApi;

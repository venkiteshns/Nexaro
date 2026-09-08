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

    adminGetFinanceStats: builder.query({
      query: (range = "Last 30 Days") => ({
        url: `/admin/finance/stats?range=${encodeURIComponent(range)}`,
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Stats"],
    }),

    adminGetFinanceChart: builder.query({
      query: ({ timeframe = "7D", metric = "revenue" } = {}) => ({
        url: `/admin/finance/chart?timeframe=${timeframe}&metric=${metric}`,
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Chart"],
    }),

    adminGetFinanceTransactions: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "ALL",
        range = "All Time",
      } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (search) params.append("search", search);
        if (status && status !== "ALL") params.append("status", status);
        if (range && range !== "All Time") params.append("range", range);
        return {
          url: `/admin/finance/transactions?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Finance_Transactions"],
    }),

    adminGetDailyReport: builder.query({
      query: () => ({
        url: "/admin/finance/reports/daily",
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetMonthlyPlReport: builder.query({
      query: ({ year, month } = {}) => {
        const params = new URLSearchParams();
        if (year !== undefined && year !== null) params.append("year", year);
        if (month !== undefined && month !== null) params.append("month", month);
        return {
          url: `/admin/finance/reports/monthly?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetPlatformFeeSummary: builder.query({
      query: () => ({
        url: "/admin/finance/reports/platform-fee",
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetNotifications: builder.query({
      query: ({ page = 1, limit = 6, filter = "all" } = {}) => ({
        url: `/admin/notifications?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
      providesTags: ["Admin_Notifications"],
    }),

    adminMarkAllNotificationsRead: builder.mutation({
      query: () => ({
        url: "/admin/notifications/mark-all-read",
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Notifications"],
    }),

    adminMarkNotificationRead: builder.mutation({
      query: (id) => ({
        url: `/admin/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Notifications"],
    }),

    adminSendAnnouncement: builder.mutation({
      query: (body) => ({
        url: "/admin/announcements",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin_Announcements", "Admin_Notifications"],
    }),

    adminGetRecentAnnouncements: builder.query({
      query: (limit = 5) => ({
        url: `/admin/announcements/recent?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Admin_Announcements"],
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
  useAdminGetFinanceStatsQuery,
  useAdminGetFinanceChartQuery,
  useAdminGetFinanceTransactionsQuery,
  useAdminGetDailyReportQuery,
  useAdminGetMonthlyPlReportQuery,
  useAdminGetPlatformFeeSummaryQuery,
  useAdminGetNotificationsQuery,
  useAdminMarkAllNotificationsReadMutation,
  useAdminMarkNotificationReadMutation,
  useAdminSendAnnouncementMutation,
  useAdminGetRecentAnnouncementsQuery,
} = adminApi;

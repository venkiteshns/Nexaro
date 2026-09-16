import { ADMIN } from "../../constants/urls";
import { api } from "./api";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    adminGetUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `${ADMIN.GET_USERS}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    adminGetPendingVerificationUsers: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `${ADMIN.GET_PENDING_VERIFICATION_USERS}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      extraOptions: { isAdmin: true },
      providesTags: ["Users"],
    }),

    adminSuspendUser: builder.mutation({
      query: (userId) => ({
        url: ADMIN.SUSPEND_USER.replace(":userId", userId),
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminUnsuspendUser: builder.mutation({
      query: (userId) => ({
        url: ADMIN.UNSUSPEND_USER.replace(":userId", userId),
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminApproveUser: builder.mutation({
      query: (userId) => ({
        url: ADMIN.APPROVE_USER.replace(":userId", userId),
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    adminRejectUser: builder.mutation({
      query: (userId) => ({
        url: ADMIN.REJECT_USER.replace(":userId", userId),
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
          url: `${ADMIN.GET_TASKS}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Tasks"],
    }),

    adminTaskDelete: builder.mutation({
      query: (taskId) => ({
        url: ADMIN.DELETE_TASK.replace(":taskId", taskId),
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Tasks"],
    }),

    adminGetTaskDetails: builder.query({
      query: (taskId) => ({
        url: ADMIN.GET_TASK_DETAILS.replace(":taskId", taskId),
        method: "GET",
      }),
      providesTags: ["Admin_Task_Details"],
    }),

    adminGetFinanceStats: builder.query({
      query: (range = "Last 30 Days") => ({
        url: `${ADMIN.GET_FINANCE_STATS}?range=${encodeURIComponent(range)}`,
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Stats"],
    }),

    adminGetFinanceChart: builder.query({
      query: ({ timeframe = "7D", metric = "revenue" } = {}) => ({
        url: `${ADMIN.GET_FINANCE_CHART}?timeframe=${timeframe}&metric=${metric}`,
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
          url: `${ADMIN.GET_FINANCE_TRANSACTIONS}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Finance_Transactions"],
    }),

    adminGetDailyReport: builder.query({
      query: () => ({
        url: ADMIN.GET_DAILY_REPORT,
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetMonthlyPlReport: builder.query({
      query: ({ year, month, fromDate, toDate } = {}) => {
        const params = new URLSearchParams();
        if (fromDate && toDate) {
          params.append("fromDate", fromDate);
          params.append("toDate", toDate);
        } else {
          if (year !== undefined && year !== null) params.append("year", year);
          if (month !== undefined && month !== null) params.append("month", month);
        }
        return {
          url: `${ADMIN.GET_MONTHLY_PL_REPORT}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetPlatformFeeSummary: builder.query({
      query: () => ({
        url: ADMIN.GET_PLATFORM_FEE_SUMMARY,
        method: "GET",
      }),
      providesTags: ["Admin_Finance_Reports"],
    }),

    adminGetNotifications: builder.query({
      query: ({ page = 1, limit = 6, filter = "all" } = {}) => ({
        url: `${ADMIN.GET_NOTIFICATIONS}?page=${page}&limit=${limit}&filter=${filter}`,
        method: "GET",
      }),
      providesTags: ["Admin_Notifications"],
    }),

    adminMarkAllNotificationsRead: builder.mutation({
      query: () => ({
        url: ADMIN.MARK_ALL_NOTIFICATIONS_READ,
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Notifications"],
    }),

    adminMarkNotificationRead: builder.mutation({
      query: (id) => ({
        url: ADMIN.MARK_NOTIFICATION_READ.replace(":id", id),
        method: "PATCH",
      }),
      invalidatesTags: ["Admin_Notifications"],
    }),

    adminSendAnnouncement: builder.mutation({
      query: (body) => ({
        url: ADMIN.SEND_ANNOUNCEMENT,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin_Announcements", "Admin_Notifications"],
    }),

    adminGetRecentAnnouncements: builder.query({
      query: (limit = 5) => ({
        url: `${ADMIN.GET_RECENT_ANNOUNCEMENTS}?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Admin_Announcements"],
    }),

    adminGetDashboard: builder.query({
      query: () => ({
        url: ADMIN.GET_DASHBOARD,
        method: "GET",
      }),
      providesTags: ["Admin_Dashboard"],
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
  useAdminGetDashboardQuery,
} = adminApi;

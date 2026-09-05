import { WORKER } from "../../constants/urls";
import { api } from "./api";

export const workerApi = api.injectEndpoints({
  endpoints: (builder) => ({

    getWorkerNearbyTasks: builder.query({
      query: ({ search = "", category = "", page = 1, limit = 9 } = {}) => {
        let params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        params.append("page", page);
        params.append("limit", limit);
        return {
          url: `${WORKER.GET_TASKS}?${params}`,
          method: "GET",
        };
      },
      providesTags: ["Worker_Tasks"],
    }),

    getTaskForBid: builder.query({
      query: (taskId) => ({
        url: WORKER.GET_TASK_FOR_BID.replace(":taskId", taskId),
        method: "GET",
      }),
      providesTags: ["Task_for_bid"]
    }),

    addNewBid: builder.mutation({
      query: (payload) => ({
        url: WORKER.ADD_BID,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Worker_Bids", "Worker_Tasks"],
    }),

    getWorkerBids: builder.query({
      query: ({ status = "all", page = 1, limit = 5 } = {}) => {
        const params = new URLSearchParams({ status, page, limit });
        return {
          url: `${WORKER.GET_WORKER_BIDS}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Worker_Bids"],
    }),

    getWorkerBidDetails: builder.query({
      query: (bidId) => ({
        url: WORKER.GET_BID_DETAILS.replace(":bidId", bidId),
        method: "GET",
      }),
      providesTags: ["Worker_Bid_Details"],
    }),

    withdrawBid: builder.mutation({
      query: (bidId) => ({
        url: WORKER.WITHDRAW_BID.replace(':bidId', bidId),
        method: "DELETE",
      }),
      invalidatesTags: ["Worker_Bids", "Worker_Bid_Details"],
    }),

    getWorkerActiveJob: builder.query({
      query: (taskId) => ({
        url: WORKER.GET_ACTIVE_JOB.replace(":taskId", taskId),
        method: "GET",
      }),
      providesTags: ["Active_Job"],
    }),

    getWorkerCurrentActiveJob: builder.query({
      query: () => ({
        url: WORKER.GET_CURRENT_ACTIVE_JOB,
        method: "GET",
      }),
      providesTags: ["Active_Job"],
    }),

    updateJobProgress: builder.mutation({
      query: ({ taskId, update }) => ({
        url: WORKER.UPDATE_JOB_PROGRESS.replace(":taskId", taskId),
        method: "PATCH",
        body: { update },
      }),
      invalidatesTags: ["Active_Job"],
    }),

    getWorkerProfile: builder.query({
      query: () => ({
        url: WORKER.GET_WORKER_PROFILE,
        method: "GET"
      }),
      providesTags: ['Worker_Profile']
    }),

    updateWorkerProfile: builder.mutation({
      query: (data) => {
        const profileData = new FormData();
        profileData.append('email', data.email)
        profileData.append('bio', data.bio)
        profileData.append('phone', data.phone)
        profileData.append('skills', JSON.stringify(data.skills))
        profileData.append('languages', JSON.stringify(data.languages))
        if (data.avatar) {
          console.log(data.avatar);
          profileData.append('avatar', data?.avatar)
        }
        return {
          url: WORKER.UPDATE_PROFILE,
          method: "PATCH",
          body: profileData,
        }
      },
      invalidatesTags: ["Worker_Profile"]
    }),

    switchRoleToPoster: builder.mutation({
      query: () => ({
        url: WORKER.SWITCH_ROLE,
        method: "PATCH",
      })
    }),

    getReviewsWorker: builder.query({
      query: ({ page = 1, limit = 5 } = {}) => {
        let queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        return {
          url: `${WORKER.GET_REVIEWS}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Worker_Reviews"],
    }),

    getCompletedTaskWorkerSide: builder.query({
      query: (taskId) => ({
        url: WORKER.COMPLETED_TASK.replace(':taskId', taskId),
        method: "GET",
      }),
      providesTags: ["Worker_Completed_Task"],
    }),

    getEarningHeroData: builder.query({
      query: () => ({
        url: WORKER.GET_EARNING_HERO_DATA,
        method: "GET",
      }),
      providesTags: ["Earning_Hero_Data"],
    }),

    getTransactionHistory: builder.query({
      query: ({ page, limit }) => {
        let queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        return {
          url: `${WORKER.GET_TRANSACTION_HISTORY}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Transaction_History"],
    }),

    getWorkerEarningsChart: builder.query({
      query: (timeframe = "7D") => ({
        url: `${WORKER.GET_EARNING_CHART}?timeframe=${timeframe}`,
        method: "GET",
      }),
      providesTags: ["Worker_Earnings_Chart"],
    }),

    withdrawEarnings: builder.mutation({
      query: (payload) => ({
        url: WORKER.WITHDRAW_EARNINGS,
        method: "POST",
        body: payload || {},
      }),
      invalidatesTags: [
        "Earning_Hero_Data",
        "Transaction_History",
        "Worker_Earnings_Chart",
      ],
    }),

  }),
});

export const {
  useGetWorkerNearbyTasksQuery,
  useGetTaskForBidQuery,
  useAddNewBidMutation,
  useGetWorkerBidsQuery,
  useGetWorkerBidDetailsQuery,
  useWithdrawBidMutation,
  useGetWorkerActiveJobQuery,
  useGetWorkerCurrentActiveJobQuery,
  useUpdateJobProgressMutation,
  useGetWorkerProfileQuery,
  useUpdateWorkerProfileMutation,
  useSwitchRoleToPosterMutation,
  useGetReviewsWorkerQuery,
  useGetCompletedTaskWorkerSideQuery,
  useGetEarningHeroDataQuery,
  useGetTransactionHistoryQuery,
  useGetWorkerEarningsChartQuery,
  useWithdrawEarningsMutation,
} = workerApi;


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
          url: `/worker/tasks/nearby?${params}`,
          method: "GET",
        };
      },
      providesTags: ["Worker_Tasks"],
    }),

    getTaskForBid: builder.query({
      query: (taskId) => ({
        url: `/worker/task/${taskId}`,
        method: "GET",
      }),
    }),

    addNewBid: builder.mutation({
      query: (payload) => ({
        url: "/worker/tasks/add_bid",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Worker_Bids", "Worker_Tasks"],
    }),

    getWorkerBids: builder.query({
      query: ({ status = "all", page = 1, limit = 5 } = {}) => {
        const params = new URLSearchParams({ status, page, limit });
        return {
          url: `/worker/my-bids?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Worker_Bids"],
    }),

    getWorkerBidDetails: builder.query({
      query: (bidId) => ({
        url: `/worker/bid-details/${bidId}`,
        method: "GET",
      }),
      providesTags: ["Worker_Bid_Details"],
    }),

    withdrawBid: builder.mutation({
      query: (bidId) => ({
        url: `/worker/bid/withdraw/${bidId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Worker_Bids", "Worker_Bid_Details"],
    }),

    getWorkerActiveJob: builder.query({
      query: (taskId) => ({
        url: `/worker/task/${taskId}/active-job`,
        method: "GET",
      }),
      providesTags: ["Active_Job"],
    }),

    updateJobProgress: builder.mutation({
      query: ({ taskId, update }) => ({
        url: `/worker/task/${taskId}/progress`,
        method: "PATCH",
        body: { update },
      }),
      invalidatesTags: ["Active_Job"],
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
  useUpdateJobProgressMutation,
} = workerApi;

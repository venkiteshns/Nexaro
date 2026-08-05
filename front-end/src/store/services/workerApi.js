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
        url:WORKER.GET_TASK_FOR_BID.REAPLCE(":taskId",taskId),
        method: "GET",
      }),
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
        url: WORKER.GET_BID_DETAILS.replace(":bidId",bidId),
        method: "GET",
      }),
      providesTags: ["Worker_Bid_Details"],
    }),

    withdrawBid: builder.mutation({
      query: (bidId) => ({
        url: WORKER.WITHDRAW_BID.replace(':bidId',bidId),
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

    updateJobProgress: builder.mutation({
      query: ({ taskId, update }) => ({
        url: WORKER.UPDATE_JOB_PROGRESS.replace(":taskId", taskId),
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

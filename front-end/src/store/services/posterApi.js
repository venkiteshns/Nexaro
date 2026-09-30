import { POSTER, REVIEWS } from "../../constants/urls";
import { api } from "./api";


export const posterApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    createTask: builder.mutation({
      query: (formValues) => {
        const formData = new FormData();

        formData.append("title", formValues.taskTitle);
        formData.append("description", formValues.description);
        formData.append("deadline", formValues.deadline);
        formData.append("urgencyLevel", formValues.urgency);
        formData.append("amount", formValues.budget);
        formData.append("category", formValues.category);

        if (formValues.uploadedImages && formValues.uploadedImages.length > 0) {
          formData.append("images", JSON.stringify(formValues.uploadedImages));
        } else if (formValues.photos && formValues.photos.length > 0) {
          Array.from(formValues.photos).forEach((file) => {
            formData.append("photos", file);
          });
        }
        const address = {
          state: formValues.state,
          district: formValues.district,
          city: formValues.city,
          area: formValues.area,
          houseNumber: formValues.houseNumber,
          landmark: formValues.fullAddress,
        };
        formData.append("address", JSON.stringify(address));

        const location = {
          type: "Point",
          coordinates: [
            Number(formValues.locationlng),
            Number(formValues.locationLat),
          ],
        };
        formData.append("location", JSON.stringify(location));

        return {
          url: POSTER.CREATE_TASK,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Poster_Tasks"],
    }),

    getPosterTasks: builder.query({
      query: ({status, page, limit = 5, search}) => ({
        url: `${POSTER.GET_TASKS}?page=${page}&limit=${limit}&status=${status}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Poster_Tasks"],
    }),

    cancelTaskByPoster: builder.mutation({
      query: (taskId) => ({
        url: POSTER.CANCEL_TASK.replace(":taskId", taskId),
        method: "PATCH",
      }),
      invalidatesTags: ["Poster_Tasks", "Worker_Tasks"],
    }),

    updateTask: builder.mutation({
      query: ({ taskId, formValues, retainedImages }) => {
        const formData = new FormData();
        formData.append("title", formValues.title);
        formData.append("description", formValues.description);
        formData.append("category", formValues.category);
        formData.append("deadline", formValues.deadline);
        formData.append("urgencyLevel", formValues.urgencyLevel);
        formData.append("amount", formValues.amount);
        formData.append("retainedImages", JSON.stringify(retainedImages || []));

        if (formValues.newPhotos && formValues.newPhotos.length > 0) {
          Array.from(formValues.newPhotos).forEach((file) => {
            formData.append("photos", file);
          });
        }

        return {
          url: POSTER.UPDATE_TASK.replace(":taskId", taskId),
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Poster_Tasks"],
    }),

    getPosterBids: builder.query({
      query: ({ taskId, sort }) => ({
        url:`${POSTER.GET_BIDS.replace(":taskId",taskId)}?sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["Poster_Bids"],
    }),

    acceptBid: builder.mutation({
      query: (bidId) => ({
        url:POSTER.ACCEPT_BID.replace(":bidId", bidId),
        method: "PATCH",
      }),
      invalidatesTags: [
        "Poster_Bids",
        "Worker_Bids",
        "Worker_Bid_Details",
        "Poster_Tasks",
      ],
    }),

    getPosterTaskProgress: builder.query({
      query: (taskId) => ({
        url: POSTER.TASK_PROGRESS.replace(':taskId', taskId),
        method: "GET",
      }),
      providesTags: ["Poster_Task_Progress"],
    }),

    getCompletedTaskPosterSide: builder.query({
      query: (taskId) => ({
        url: POSTER.COMPLETED_TASK.replace(":taskId", taskId),
        method: "GET",
      }),
      providesTags: ["Poster_Completed_Task"],
    }),

    getPosterProfile: builder.query({
      query: () => ({
        url: POSTER.PROFILE,
        method: "GET",
      }),
      providesTags: ["Poster_Profile"],
    }),

    updatePosterProfile: builder.mutation({
      query: (formValues) => {
        return {
          url: POSTER.UPDATE_PROFILE,
          method: "PATCH",
          body: formValues,
          formData: true,
        };
      },
      invalidatesTags: ["Poster_Profile"],
    }),

    submitReview: builder.mutation({
      query: (body) => ({
        url: REVIEWS.CREATE_REVIEW,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Poster_Completed_Task", "Poster_Profile"],
    }),

    switchtoworker: builder.mutation({
      query: (data) => {
        const roleData = new FormData();
        roleData.append('city', data.city || data.workPlace || '');
        roleData.append('country', data.country || 'India');
        roleData.append('district', data.district || '');
        if (data.uploadedDocuments) {
          roleData.append('uploadedDocuments', JSON.stringify(data.uploadedDocuments));
        }
        if (data.id_back && data.id_back.length > 0) roleData.append('id_back', data.id_back[0]);
        if (data.id_front && data.id_front.length > 0) roleData.append('id_front', data.id_front[0]);
        roleData.append('languages', JSON.stringify(data.languages));
        const lat = data.workPlacelat || data.locationLat || "";
        const lng = data.workPlacelng || data.locationlng || "";
        roleData.append('lat', lat);
        roleData.append('lng', lng);
        if (data.workPlace) {
          roleData.append('workPlace', data.workPlace);
        }
        roleData.append('password', data.password);
        if (data.selfie && data.selfie.length > 0) roleData.append('selfie', data.selfie[0]);
        roleData.append('skills', JSON.stringify(data.skills));
        roleData.append('state', data.state || 'Kerala');
        return {
          url: POSTER.ROLE_SWITCH,
          method: "PATCH",
          body: roleData,
          formData: true
        }
      },
      invalidatesTags: ["Poster_Profile", "Worker_Profile"],
    }),
    
    switchRoleActiveWorker: builder.mutation ({
      query:() => ({
        url: POSTER.ROLE_SWITCH_ACTIVE_WORKER,
        method: "PATCH",
      }),
      invalidatesTags: ["Poster_Profile", "Worker_Profile"],
    }),

    getPosterNotifications: builder.query({
      query: ({ page = 1, limit = 6, filter = "all" } = {}) => {
        const params = new URLSearchParams({ page, limit, filter });
        return {
          url: `${POSTER.GET_NOTIFICATIONS}?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Poster_Notifications"],
    }),

    getPosterUnreadCount: builder.query({
      query: () => ({
        url: POSTER.GET_UNREAD_COUNT,
        method: "GET",
      }),
      providesTags: ["Poster_Unread_Count"],
    }),

    markAllPosterNotificationsRead: builder.mutation({
      query: () => ({
        url: POSTER.MARK_ALL_NOTIFICATIONS_READ,
        method: "PATCH",
      }),
      invalidatesTags: ["Poster_Notifications", "Poster_Unread_Count"],
    }),

    markPosterNotificationRead: builder.mutation({
      query: (id) => ({
        url: POSTER.MARK_NOTIFICATION_READ.replace(":id", id),
        method: "PATCH",
      }),
      invalidatesTags: ["Poster_Notifications", "Poster_Unread_Count"],
    }),

    getPosterPaymentOverview: builder.query({
      query: () => ({
        url: POSTER.GET_PAYMENT_OVERVIEW,
        method: "GET",
      }),
      providesTags: ["Poster_Payments_Overview"],
    }),

    getPosterPaymentHistory: builder.query({
      query: ({ page = 1, limit = 5, search = "", status = "all" } = {}) => ({
        url: `${POSTER.GET_PAYMENT_HISTORY}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Poster_Payments_History"],
    }),

    getPosterSpendingChart: builder.query({
      query: (timeframe = "30D") => ({
        url: `${POSTER.GET_PAYMENT_CHART}?timeframe=${timeframe}`,
        method: "GET",
      }),
      providesTags: ["Poster_Payments_Chart"],
    }),

  }),

});


export const {
  useCreateTaskMutation,
  useGetPosterTasksQuery,
  useGetPosterBidsQuery,
  useAcceptBidMutation,
  useCancelTaskByPosterMutation,
  useGetPosterTaskProgressQuery,
  useLazyGetPosterTaskProgressQuery,
  useGetCompletedTaskPosterSideQuery,
  useUpdateTaskMutation,
  useGetPosterProfileQuery,
  useUpdatePosterProfileMutation,
  useSubmitReviewMutation,
  useSwitchtoworkerMutation,
  useSwitchRoleActiveWorkerMutation,
  useGetPosterNotificationsQuery,
  useGetPosterUnreadCountQuery,
  useMarkAllPosterNotificationsReadMutation,
  useMarkPosterNotificationReadMutation,
  useGetPosterPaymentOverviewQuery,
  useGetPosterPaymentHistoryQuery,
  useGetPosterSpendingChartQuery,
} = posterApi;


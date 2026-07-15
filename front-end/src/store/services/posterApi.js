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

        if (formValues.photos && formValues.photos.length > 0) {
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
          url: "/poster/tasks/create",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Poster_Tasks"],
    }),

    getPosterTasks: builder.query({
      query: () => ({
        url: "/poster/tasks",
        method: "GET",
      }),
      providesTags: ["Poster_Tasks"],
    }),

    cancelTaskByPoster: builder.mutation({
      query: (taskId) => ({
        url: `/poster/task/cancel/${taskId}`,
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
          url: `/poster/task/update/${taskId}`,
          method: "PATCH",
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: ["Poster_Tasks"],
    }),

    getPosterBids: builder.query({
      query: ({ taskId, sort }) => ({
        url: `/poster/task/bids/${taskId}?sort=${sort}`,
        method: "GET",
      }),
      providesTags: ["Poster_Bids"],
    }),

    acceptBid: builder.mutation({
      query: (bidId) => ({
        url: `/poster/bid/accept/${bidId}`,
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
        url: `/poster/task/${taskId}/progress`,
        method: "GET",
      }),
      providesTags: ["Poster_Task_Progress"],
    }),

    getCompletedTaskPosterSide: builder.query({
      query: (taskId) => ({
        url: `/poster/task/completed/${taskId}`,
        method: "GET",
      }),
      providesTags: ["Poster_Completed_Task"],
    }),

    getPosterProfile: builder.query({
      query: () => ({
        url: "/poster/profile",
        method: "GET",
      }),
      providesTags: ["Poster_Profile"],
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
  useGetCompletedTaskPosterSideQuery,
  useUpdateTaskMutation,
  useGetPosterProfileQuery,
} = posterApi;

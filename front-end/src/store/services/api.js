import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../Slices/UserSlice";
import { setAdminCredentials, adminLogOut } from "../Slices/AdminSlice";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState();

        const adminToken =
            state.adminAuth?.accessToken || localStorage.getItem("adminToken");
        const userToken =
            state.auth?.accessToken || localStorage.getItem("token");

        const isAdminRequest = endpoint?.startsWith("admin");

        const token = isAdminRequest ? adminToken : userToken;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const isAdminRequest = extraOptions?.isAdmin === true ||
            (typeof args === "object" && args.url?.startsWith("/admin"));

        if (isAdminRequest) {
            const adminRefreshToken = localStorage.getItem("adminRefreshToken");

            if (adminRefreshToken) {
                const refreshResult = await baseQuery(
                    {
                        url: "/auth/refresh-token",
                        method: "POST",
                        body: { refreshToken: adminRefreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data?.accessToken) {
                    const newToken = refreshResult.data.accessToken;
                    api.dispatch(
                        setAdminCredentials({
                            admin: api.getState().adminAuth.admin,
                            accessToken: newToken,
                        })
                    );
                    localStorage.setItem("adminToken", newToken);
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(adminLogOut());
                }
            } else {
                api.dispatch(adminLogOut());
            }
        } else {
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const refreshResult = await baseQuery(
                    {
                        url: "/auth/refresh-token",
                        method: "POST",
                        body: { refreshToken },
                    },
                    api,
                    extraOptions
                );

                if (refreshResult.data?.accessToken) {
                    const newToken = refreshResult.data.accessToken;
                    api.dispatch(
                        setCredentials({
                            user: api.getState().auth.user,
                            accessToken: newToken,
                        })
                    );
                    localStorage.setItem("token", newToken);
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logOut());
                }
            } else {
                api.dispatch(logOut());
            }
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Users", "Tasks", "Worker_Tasks", "Worker_Bids", "Active_Job"],

    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: ({ email, phone }) => ({
                url: "/auth/get-otp",
                method: "POST",
                body: { email, phone },
            }),
        }),

        verifyOtp: builder.mutation({
            query: ({ email, otp }) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body: { email, otp },
            }),
        }),

        posterSignUp: builder.mutation({
            query: (payload) => ({
                url: "/auth/signup/poster",
                method: "POST",
                body: payload,
                formData: true,
            }),
        }),

        workerSignUp: builder.mutation({
            query: (formData) => ({
                url: "/auth/signup/worker",
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),

        userLogin: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
        }),

        googleLogin: builder.mutation({
            query: (idToken) => ({
                url: "/auth/google-login",
                method: "POST",
                body: { idToken },
            }),
        }),

        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: "/auth/login/admin",
                method: "POST",
                body: credentials,
            }),
        }),

        userLogout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        adminLogout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        forgotPassword: builder.mutation({
            query: ({ email, role }) => ({
                url: `/auth/forgot-password/${role}`,
                method: "POST",
                body: { email },
            }),
        }),

        updatePassword: builder.mutation({
            query: ({ email, password }) => ({
                url: "/auth/update-password",
                method: "POST",
                body: { email, password },
            }),
        }),

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
                console.log("check : ", formValues)
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

        adminGetAllTasks: builder.query({
            query: ({ page = 1, limit = 4 } = {}) => ({
                url: `/admin/tasks?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Admin_Tasks"],
        }),

        getWorkerNearbyTasks: builder.query({
            query: ({ search = "", category = "", page = 1, limit = 9 } = {}) => {
                let params = new URLSearchParams();
                if (search) params.append('search', search);
                if (category) params.append('category', category);
                params.append('page', page);
                params.append('limit', limit);
                return {
                    url: `/worker/tasks/nearby?${params}`,
                    method: "GET",
                }
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
                url: '/worker/tasks/add_bid',
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["Worker_Bids", "Worker_Tasks"],
        }),

        cancelTaskByPoster: builder.mutation({
            query: (taskId) => ({
                url: `/poster/task/cancel/${taskId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Poster_Tasks", "Worker_Tasks"]
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
                method: "GET"
            }),
            providesTags: ["Worker_Bid_Details"],
        }),

        withdrawBid: builder.mutation({
            query: (bidId) => ({
                url: `/worker/bid/withdraw/${bidId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Worker_Bids", "Worker_Bid_Details"],
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
                method: "PATCH"
            }),
            invalidatesTags: ["Poster_Bids", "Worker_Bids", "Worker_Bid_Details", "Poster_Tasks"]
        }),

        getPosterTaskProgress: builder.query({
            query: (taskId) => ({
                url: `/poster/task/${taskId}/progress`,
                method: "GET",
            }),
            providesTags: ["Poster_Task_Progress"]
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

        adminTaskDelete: builder.mutation({
            query: (taskId) => ({
                url: `/admin/task/cancel/${taskId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Admin_Tasks"]
        })
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    usePosterSignUpMutation,
    useWorkerSignUpMutation,
    useUserLoginMutation,
    useGoogleLoginMutation,
    useAdminLoginMutation,
    useUserLogoutMutation,
    useAdminLogoutMutation,
    useForgotPasswordMutation,
    useUpdatePasswordMutation,
    useAdminGetUsersQuery,
    useAdminGetPendingVerificationUsersQuery,
    useAdminSuspendUserMutation,
    useAdminUnsuspendUserMutation,
    useAdminApproveUserMutation,
    useAdminRejectUserMutation,
    useCreateTaskMutation,
    useGetPosterTasksQuery,
    useAdminGetAllTasksQuery,
    useGetWorkerNearbyTasksQuery,
    useGetTaskForBidQuery,
    useAddNewBidMutation,
    useGetWorkerBidsQuery,
    useGetWorkerBidDetailsQuery,
    useWithdrawBidMutation,
    useGetPosterBidsQuery,
    useAcceptBidMutation,
    useCancelTaskByPosterMutation,
    useGetPosterTaskProgressQuery,
    useGetWorkerActiveJobQuery,
    useUpdateJobProgressMutation,
    useAdminTaskDeleteMutation
} = api;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../Slices/UserSlice";
import { setAdminCredentials, adminLogOut } from "../Slices/AdminSlice";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState();

        // Check both Redux state and localStorage for each role
        const adminToken =
            state.adminAuth?.accessToken || localStorage.getItem("adminToken");
        const userToken =
            state.auth?.accessToken || localStorage.getItem("token");

        // Admin endpoints are grouped under the "adminLogin" endpoint name,
        // or you can check the URL prefix via the args — we use endpoint name here.
        // For admin requests: endpoint name starts with "admin"
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
                        url: "/admin/refresh-token",
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
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    usePosterSignUpMutation,
    useWorkerSignUpMutation,
    useUserLoginMutation,
    useAdminLoginMutation,
    useUserLogoutMutation,
    useAdminLogoutMutation,
    useForgotPasswordMutation,
    useUpdatePasswordMutation,
} = api;
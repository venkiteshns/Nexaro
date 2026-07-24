import { api } from "./api";

export const authApi = api.injectEndpoints({
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

    })
})

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
} = authApi;
import { AUTH } from "../../constants/urls";
import { api } from "./api";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation({
            query: (params) => {
                let {email, phone} = params;
                let resendFlag = params.resendFlag || false;
                return {
                    url: AUTH.SEND_OTP,
                    method: "POST",
                    body: { email, phone, resendFlag },
                };
            },
        }),

        verifyOtp: builder.mutation({
            query: ({ email, otp }) => ({
                url: AUTH.VERIFY_OTP,
                method: "POST",
                body: { email, otp },
            }),
        }),

        posterSignUp: builder.mutation({
            query: (payload) => ({
                url: AUTH.POSTER_SIGNUP,
                method: "POST",
                body: payload,
                formData: true,
            }),
        }),

        workerSignUp: builder.mutation({
            query: (formData) => ({
                url: AUTH.WORKER_SIGNUP,
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),

        userLogin: builder.mutation({
            query: (credentials) => ({
                url: AUTH.USER_LOGIN,
                method: "POST",
                body: credentials,
            }),
        }),

        googleLogin: builder.mutation({
            query: (idToken) => ({
                url: AUTH.GOOGLE_LOGIN,
                method: "POST",
                body: { idToken },
            }),
        }),

        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: AUTH.ADMIN_LOGIN,
                method: "POST",
                body: credentials,
            }),
        }),

        userLogout: builder.mutation({
            query: () => ({
                url: AUTH.USER_LOGOUT,
                method: "POST",
            }),
        }),

        adminLogout: builder.mutation({
            query: () => ({
                url: AUTH.ADMIN_LOGOUT,
                method: "POST",
            }),
        }),

        forgotPassword: builder.mutation({
            query: ({ email, role }) => ({
                url: `${AUTH.FORGOT_PASSWORD}/${role}`,
                method: "POST",
                body: { email },
            }),
        }),

        updatePassword: builder.mutation({
            query: ({ email, password }) => ({
                url: AUTH.UPDATE_PASSWORD,
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
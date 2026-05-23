import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../Slices/UserSlice";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers, { getState }) => {
        const tokenFromRedux = getState().auth.accessToken;
        const token = tokenFromRedux || localStorage.getItem("token");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});


const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {

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
                const newAccessToken = refreshResult.data.accessToken;
                api.dispatch(
                    setCredentials({
                        user: api.getState().auth.user,
                        accessToken: newAccessToken,
                    })
                );

                localStorage.setItem("token", newAccessToken);
                result = await baseQuery(args, api, extraOptions);

            } else {
                api.dispatch(logOut());
            }
        } else {
            api.dispatch(logOut());
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
                url: "/auth/login/user",
                method: "POST",
                body: credentials,
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
} = api;
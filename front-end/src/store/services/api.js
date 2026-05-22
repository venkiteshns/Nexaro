import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const api = createApi({
    reducerPath:'api',

    baseQuery: fetchBaseQuery({
        baseUrl: API_URL
    }),

    endpoints: (builder) => ({
        
        // POST Send OTP
        sendOtp: builder.mutation({
            query: ({ email, phone }) => ({
                url: '/auth/get-otp',
                method: 'POST',
                body: {email,phone},
            })
        }),

        // POST Verify OTP
        verifyOtp: builder.mutation({
            query:({email,otp}) => ({
                url: '/auth/verify-otp',
                method: "POST",
                body: {email, otp}
            })
        }),

        // POST SignUp Poster
        posterSignUp: builder.mutation({
            query: (payload) => ({
                url: '/auth/signup/poster',
                method: 'POST',
                body: payload
            })
        })
    })
})

export const {useSendOtpMutation, useVerifyOtpMutation, usePosterSignUpMutation} = api;
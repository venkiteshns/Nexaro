import { PAYMENT } from "../../constants/urls";
import { api } from "./api";

export const paymentApi = api.injectEndpoints({

    endpoints : (builder) => ({

        createOrder : builder.mutation({
            query: (body) => ({
                url: PAYMENT.CREATE_ORDER,
                method: "POST",
                body,
            })

        }),

        capturePayment: builder.mutation({
            query:(orderId) => ({
                url: PAYMENT.CAPTURE_PAYMENT.replace(':orderId', orderId),
                method:"POST",
            })
        }),

        initiatePayment: builder.mutation({
            query: (bidId) => ({
                url: PAYMENT.PAYOUT.replace(':bidId', bidId),
                method: "POST"
            }),
            invalidatesTags: ['Poster_Tasks'],
        })

    })

})

export const {
    useCreateOrderMutation,
    useCapturePaymentMutation,
    useInitiatePaymentMutation
} = paymentApi;
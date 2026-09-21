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
            invalidatesTags: [
                'Poster_Tasks',
                'Poster_Payments_Overview',
                'Poster_Payments_History',
                'Poster_Payments_Chart'
            ],
        })

    })

})

export const {
    useCreateOrderMutation,
    useCapturePaymentMutation,
    useInitiatePaymentMutation
} = paymentApi;
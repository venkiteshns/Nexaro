import { PAYMENT } from "../../constants/urls";
import { api } from "./api";

export const paymentApi = api.injectEndpoints({

    endpoints : (builder) => ({

        createOrder : builder.mutation({
            query: ({totalAmount, items}) => ({
                url: PAYMENT.CREATE_ORDER,
                method: "POST",
                body: {totalAmount, items},
            })

        }),

        capturePayment: builder.mutation({
            query:(orderId) => ({
                url: PAYMENT.CAPTURE_PAYMENT.replace(':orderId', orderId),
                method:"POST",
            })
        })

    })

})

export const {
    useCreateOrderMutation,
    useCapturePaymentMutation
} = paymentApi;
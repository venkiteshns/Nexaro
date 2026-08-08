import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCapturePaymentMutation, useCreateOrderMutation } from "../../store/services/paymentApi";
import { showError, showSuccess, showWarning } from "../../utils/toast";

export default function PaymentButton({ amount, onSuccess }) {
    const [{ isPending }] = usePayPalScriptReducer();
    const [capturePayment] = useCapturePaymentMutation();
    const [createOrder] = useCreateOrderMutation();

    const decAmount = Number(`${amount}.00`);

    return (
        <>
            {isPending ? (
                <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 border-2 border-[#0A6E5C] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <PayPalButtons
                    style={{ layout: "vertical", shape: "pill", height: 55 }}
                    createOrder={async () => {
                        try {
                            const order = await createOrder({
                                totalAmount: decAmount,
                                items: [{ name: "Test Product", price: decAmount, quantity: 1 }],
                            }).unwrap();
                            return order.id;
                        } catch (error) {
                            console.error("Failed to initiate PayPal order:", error);
                            showError("Unexpected error occurred! Could not start checkout. Please try again later.");
                        }
                    }}
                    onApprove={async (data) => {
                        const captureResult = await capturePayment(data.orderID);
                        if (captureResult.data?.status === "Success") {
                            showSuccess("Payment successful!");
                            onSuccess?.();
                        } else {
                            showWarning("Payment not completed !!");
                        }
                    }}
                    onCancel={() => {
                        showWarning("Payment has been cancelled, Complete to accept this bid", { autoClose: 4000 });
                    }}
                />
            )}
        </>
    );
}
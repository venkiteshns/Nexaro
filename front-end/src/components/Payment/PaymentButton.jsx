import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCapturePaymentMutation, useCreateOrderMutation } from "../../store/services/paymentApi";
import { showError, showSuccess, showWarning } from "../../utils/toast";

export default function PaymentButton({ amount, bidId, onSuccess }) {
    const [{ isPending }] = usePayPalScriptReducer();
    const [capturePayment] = useCapturePaymentMutation();
    const [createOrder] = useCreateOrderMutation();

    const decAmount = amount.toFixed(2);
    // console.log(bidId);

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
                                bidId: bidId
                            }).unwrap();
                            return order.id;
                        } catch (error) {
                            console.error("Failed to initiate PayPal order:", error);
                            showError("Unexpected error occurred! Could not start checkout. Please try again later.");
                            throw error;
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const captureResult = await capturePayment(data.orderID).unwrap();
                            // const result = captureResult.data;

                            console.log(captureResult);
                            
    
                            switch (captureResult?.status) {
                                case "Success":
                                case "AlreadyCaptured":
                                    showSuccess("Payment successful!",{autoClose:4000});
                                    onSuccess?.();
                                    break;
    
                                case "Pending":
                                    showWarning("Payment is under review. We'll confirm once it clears.");
                                    onSuccess?.(); // or a distinct "pending" handler if your flow treats this differently
                                    break;
    
                                case "InstrumentDeclined":
                                    showWarning("That payment method was declined. Please try another.");
                                    return actions.restart();
                                    
                                default:
                                    showWarning("Payment could not be completed. Please try again.");
                            }
                        } catch (error) {
                            console.error("Capture request failed:", error);
                            showError("Could not confirm your payment. If money was deducted, contact support.");
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
import { X } from "lucide-react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentButton from "../../components/Payment/PaymentButton";
import { formatInrToUsd, convertInrToUsd } from "../../utils/currency";

export default function PaymentModal({ amount, bidId, onClose, onSuccess }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                onClick={onClose}
            />

            <div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto overscroll-contain"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-1 w-full bg-linear-to-r from-[#0A6E5C] to-emerald-400 sticky top-0" />

                <div className="flex items-center justify-between px-6 pt-5">
                    <h3 className="text-base font-bold text-gray-900">Complete Payment</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 pt-2 pb-6">
                    <p className="text-sm text-gray-500 mb-5">
                        Amount to be held:{' '}
                        <span className="font-semibold text-[#0A6E5C]">₹{amount} ({formatInrToUsd(amount)})</span>
                    </p>

                    <PayPalScriptProvider
                        options={{
                            "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                            currency: "USD",
                        }}
                    >
                        <PaymentButton bidId={bidId} amount={convertInrToUsd(amount)} onSuccess={onSuccess} />
                    </PayPalScriptProvider>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 py-1 transition-colors"
                    >
                        Cancel Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
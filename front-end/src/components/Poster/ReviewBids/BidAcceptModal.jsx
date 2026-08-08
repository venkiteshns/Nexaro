import { CheckCircle } from "lucide-react";
import { useState } from "react";
import PaymentModal from "../../../pages/payments/PaymentModal";

export default function AcceptModal({ bid, onConfirm, onCancel }) {
    const [showPayment, setShowPayment] = useState(false);

    if (!bid) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                onClick={onCancel}
            >
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="h-1 w-full bg-linear-to-r from-[#0A6E5C] to-emerald-400" />

                    <div className="p-7 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                            <CheckCircle size={30} className="text-[#0A6E5C]" />
                        </div>

                        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
                            Accept {bid.worker.name.split(' ')[0]}'s Bid?
                        </h2>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                            Accepting this bid will notify{' '}
                            <span className="font-semibold text-gray-700">{bid.name}</span> to proceed.
                            Secure payment of{' '}
                            <span className="font-semibold text-[#0A6E5C]">₹{bid.amount}</span> will be
                            held.
                        </p>

                        <button
                            onClick={() => setShowPayment(true)}
                            className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                       hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-sm mb-3"
                        >
                            Confirm Acceptance
                        </button>
                        <button
                            onClick={onCancel}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    amount={bid.amount}
                    onClose={() => setShowPayment(false)}
                    onSuccess={() => {
                        onConfirm?.();
                        setShowPayment(false);
                    }}
                />
            )}
        </>
    );
}
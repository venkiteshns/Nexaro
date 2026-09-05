import { createPortal } from "react-dom";
import { CheckCircle2, Wallet, X, ArrowRight } from "lucide-react";
import { formatInrToUsd } from "../../utils/currency";

export default function PaymentReceivedModal({ data, onClose, onViewTask }) {
    if (!data) return null;

    const totalAmount = Number(data.amount) || 0;
    const platformFee = data.platformFee != null ? Number(data.platformFee) : Number((totalAmount * 0.05).toFixed(2));
    const creditedAmount = data.creditedAmount != null ? Number(data.creditedAmount) : Number((totalAmount - platformFee).toFixed(2));
    const taskTitle = data.taskTitle || "Task";

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top gradient accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0A6E5C] via-emerald-400 to-teal-500" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <div className="p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-5">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center text-[#0A6E5C] mb-4 shadow-inner">
                            <Wallet size={32} />
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-emerald-100 text-[#0A6E5C] mb-2">
                            <CheckCircle2 size={13} /> Payment Received
                        </span>
                        <h2 className="text-xl font-extrabold text-gray-900">
                            Payment Credited!
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                            Payment for <span className="font-semibold text-gray-800">"{taskTitle}"</span> has been released.
                        </p>
                    </div>

                    {/* Breakdown Card */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 mb-5">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>Task Bid Amount</span>
                            <span className="font-semibold text-gray-800">
                                ₹{totalAmount.toLocaleString("en-IN")} ({formatInrToUsd(totalAmount)})
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-amber-700 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-100">
                            <span>Platform Fee (5%)</span>
                            <span className="font-bold">
                                - ₹{platformFee.toLocaleString("en-IN")}
                            </span>
                        </div>

                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">Credited to Wallet</span>
                            <span className="text-lg font-extrabold text-[#0A6E5C]">
                                ₹{creditedAmount.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-xs text-gray-500 text-center leading-relaxed mb-6">
                        5% platform fee has been deducted and the balance of{" "}
                        <strong className="text-gray-800 font-bold">₹{creditedAmount.toLocaleString("en-IN")}</strong> has been credited to your wallet.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2.5">
                        {onViewTask && (
                            <button
                                onClick={onViewTask}
                                className="w-full py-3 rounded-xl bg-[#0A6E5C] text-white text-sm font-bold hover:bg-[#085e4e] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                View Task Details
                                <ArrowRight size={15} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Got It
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

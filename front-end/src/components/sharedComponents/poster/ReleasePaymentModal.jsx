import { useState } from 'react';
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import { useInitiatePaymentMutation } from '../../../store/services/paymentApi';

/**
 * ReleaseModal — confirms and initiates payment payout.
 *
 * Props:
 *   bidId      {string}
 *   taskId     {string}  passed so onSuccess can navigate to review page
 *   amount     {number}
 *   workerName {string}
 *   onCancel   {function}
 *   onSuccess  {function(taskId)} called only when payout API succeeds
 */
export default function ReleaseModal({ amount, workerName, onCancel, bidId, taskId, onSuccess }) {
    const [initiatePayout, { isLoading }] = useInitiatePaymentMutation();
    const [apiError, setApiError] = useState(null);

    const onConfirm = async () => {
        setApiError(null);
        try {
            const res = await initiatePayout(bidId).unwrap();
            if (res?.success) {
                // Payment confirmed — let parent redirect to review page
                if (onSuccess) onSuccess(taskId);
            } else {
                setApiError(res?.message || 'Payment release failed. Please try again.');
            }
        } catch (err) {
            const message =
                err?.data?.message ||
                'Payment release failed. Please check your connection and try again.';
            setApiError(message);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={!isLoading ? onCancel : undefined}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-1 w-full bg-gradient-to-r from-[#0A6E5C] to-emerald-400" />

                <div className="p-7 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mb-5">
                        <ShieldCheck size={30} className="text-[#0A6E5C]" />
                    </div>

                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">Release Payment?</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        By confirming,{' '}
                        <span className="font-semibold text-gray-700">₹{amount}.00</span> will be
                        released immediately to{' '}
                        <span className="font-semibold text-gray-700">{workerName}</span>. This
                        action cannot be undone.
                    </p>

                    {/* API error */}
                    {apiError && (
                        <div className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-2 text-left">
                            <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600 font-medium">{apiError}</p>
                        </div>
                    )}

                    <button
                        id="confirm-release-btn"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150
                                   shadow-sm mb-3 disabled:opacity-60 disabled:cursor-not-allowed
                                   flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Releasing…
                            </>
                        ) : (
                            `Confirm & Release ₹${amount}.00`
                        )}
                    </button>

                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors py-1 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
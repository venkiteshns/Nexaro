import { ShieldCheck } from "lucide-react";
import { useInitiatePaymentMutation } from "../../../store/services/paymentApi";

export default function ReleaseModal({ amount, workerName, onCancel, bidId }) {

    const [initiatePayout] = useInitiatePaymentMutation();

    const onConfirm = async () => {
        try {
            let res = await initiatePayout(bidId).unwrap();
        } catch (error) {

        }
        console.log("Payment Transferring...", bidId);
    }

    console.log(bidId);
    

    return (
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
                        <ShieldCheck size={30} className="text-[#0A6E5C]" />
                    </div>

                    <h2 className="text-xl font-extrabold text-gray-900 mb-2">Release Payment?</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                        By confirming, <span className="font-semibold text-gray-700">₹{amount}.00</span> will be
                        released immediately to{' '}
                        <span className="font-semibold text-gray-700">{workerName}</span>. This action cannot be
                        undone.
                    </p>

                    <button
                        onClick={onConfirm}
                        className="w-full py-3 rounded-2xl bg-[#0A6E5C] text-white text-sm font-bold
                                   hover:bg-[#085e4e] active:scale-[0.98] transition-all duration-150 shadow-sm mb-3"
                    >
                        Confirm & Release ₹{amount}.00
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
    );
}
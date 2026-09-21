import { CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { showSuccess, showError } from "../../../utils/toast";
import { useInitiatePaymentMutation } from "../../../store/services/paymentApi";

export default function ReleasePaymentConfirmModal({
  isOpen,
  onClose,
  transaction,
  onReleaseSuccess,
}) {
  const [initiatePayout, { isLoading }] = useInitiatePaymentMutation();

  if (!isOpen || !transaction) return null;

  const handleConfirmRelease = async () => {
    try {
      const res = await initiatePayout(transaction.bidId).unwrap();

      if (res?.success) {
        showSuccess(`Payment of ₹${transaction.amount} successfully released to ${transaction.workerName}!`);
        if (onReleaseSuccess) onReleaseSuccess();
        onClose();
      } else {
        showError(res?.message || "Failed to release payment");
      }
    } catch (err) {
      showError(err?.data?.message || err?.message || "Error releasing payment");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-[#0A6E5C] shrink-0 shadow-xs">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Release Escrow Payment
            </h3>
            <p className="text-xs text-gray-400">Transfer funds to assigned worker</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F6FAF8] border border-emerald-100/80 space-y-2 mb-4 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Task Title:</span>
            <span className="font-bold text-gray-900 truncate max-w-[200px]">
              {transaction.taskTitle}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Professional:</span>
            <span className="font-semibold text-gray-800">{transaction.workerName}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-emerald-100/60 text-sm">
            <span className="font-bold text-gray-900">Total to Release:</span>
            <span className="font-extrabold text-[#0A6E5C]">
              ₹{Number(transaction.amount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-800 text-[11px] mb-5">
          <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
          <p>
            Please confirm that the worker has completed the task according to your requirements. Once released, this action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmRelease}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A6E5C] text-white font-bold text-xs hover:bg-[#085a4b] active:scale-[0.98] transition cursor-pointer shadow-sm shadow-[#0A6E5C]/20"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Releasing...</span>
              </>
            ) : (
              <span>Confirm & Release</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

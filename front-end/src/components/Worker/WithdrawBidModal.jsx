import { AlertTriangle, Wrench } from "lucide-react";
import { useWithdrawBidMutation } from "../../store/services/workerApi";
import { showError, showSuccess } from "../../utils/toast";

const WithdrawBidModal = ({
  isOpen,
  onClose,
  taskTitle = "Fetching failed",
  bidAmount = 0,
  bidId,
  isWithdrawSuccess,
}) => {
  const [withdrawBid, { isLoading, isSuccess }] = useWithdrawBidMutation();

  if (!isOpen) return null;

  const onConfirm = async () => {
    try {
      const response = await withdrawBid(bidId).unwrap();
      console.log("response", response);
      if (response.success) {
        showSuccess(response.message);
        if (isWithdrawSuccess) {
          isWithdrawSuccess(true);
        }
        onClose();
      }
    } catch (error) {
      console.log(error);
      showError(error.data.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
    console.log(bidId);
    console.log("Confirming bid withdrawal");
  };

  const formattedAmount = Number(bidAmount).toLocaleString("en-IN");

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="withdraw-title"
    >
      {/* ── Card ────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden
                   animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full bg-linear-to-r from-red-500 to-red-400"
        />

        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle size={26} className="text-red-500" />
            </div>
          </div>

          {/* ── Heading ──────────────────────────────────────────────────────── */}
          <h2
            id="withdraw-title"
            className="text-center text-xl sm:text-2xl font-extrabold text-gray-900 mb-2"
          >
            Withdraw Your Bid?
          </h2>

          {/* ── Sub-copy ─────────────────────────────────────────────────────── */}
          <p className="text-center text-sm text-gray-500 leading-relaxed mb-6 px-2">
            Are you sure you want to withdraw your bid of{" "}
            <span className="font-semibold text-gray-700">
              ₹{formattedAmount}
            </span>{" "}
            for&nbsp;"
            <span className="font-semibold text-gray-700">{taskTitle}</span>"?
            This action cannot be undone.
          </p>

          {/* ── Task Summary Card ─────────────────────────────────────────────── */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 mb-6">
            {/* Task title row */}
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={15} className="text-[#0A6E5C] shrink-0" />
              <span className="text-sm font-semibold text-gray-800 truncate">
                {taskTitle}
              </span>
            </div>

            {/* Bid amount row */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Your Bid
              </span>
              <span className="text-lg font-extrabold text-[#0A6E5C]">
                ₹{formattedAmount}
              </span>
            </div>
          </div>

          {/* ── Actions ──────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {/* Confirm – destructive */}
            <button
              id="confirm-withdraw-btn"
              onClick={onConfirm}
              disabled={isLoading || isSuccess}
              className={`w-full py-3 rounded-2xl text-white text-sm font-bold tracking-wide
                         active:scale-[0.98] transition-all duration-300
                         disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2 shadow-sm
                         bg-linear-to-r
                         ${
                           isSuccess
                             ? "from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500"
                             : "from-red-500 to-red-400 hover:from-red-600 hover:to-red-500"
                         }`}
            >
              {isLoading ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Withdrawing…
                </>
              ) : isSuccess ? (
                <>
                  <span className="text-base">✓</span>
                  Bid Withdrawn Successfully
                </>
              ) : (
                "Yes, Withdraw Bid"
              )}
            </button>

            {/* Cancel */}
            <button
              id="cancel-withdraw-btn"
              onClick={onClose}
              disabled={isLoading || isSuccess}
              className="w-full py-3 rounded-2xl border border-gray-200 bg-white
                         text-sm font-semibold text-[#0A6E5C]
                         hover:bg-emerald-50 hover:border-[#0A6E5C]/30 active:scale-[0.98]
                         transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              No, Keep Bid
            </button>
          </div>
        </div>
      </div>

      {/* Keyframe for scale-in entrance */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default WithdrawBidModal;

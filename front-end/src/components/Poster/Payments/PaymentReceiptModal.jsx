import { X, CheckCircle2, ShieldAlert, RotateCcw } from "lucide-react";
import Logo from "../../Logo/Logo";

export default function PaymentReceiptModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "released":
        return {
          icon: <CheckCircle2 size={14} className="text-emerald-600" />,
          label: "SUCCESSFULLY RELEASED",
          bg: "bg-emerald-50 text-[#0A6E5C] border-emerald-200/70",
        };
      case "in_escrow":
        return {
          icon: <ShieldAlert size={14} className="text-amber-600" />,
          label: "HELD IN ESCROW",
          bg: "bg-amber-50 text-amber-700 border-amber-200/70",
        };
      case "refunded":
        return {
          icon: <RotateCcw size={14} className="text-sky-600" />,
          label: "REFUNDED",
          bg: "bg-sky-50 text-sky-700 border-sky-200/70",
        };
      default:
        return {
          icon: <CheckCircle2 size={14} className="text-gray-600" />,
          label: "COMPLETED",
          bg: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  const statusInfo = getStatusBadge(transaction.status);
  const rawDate = transaction.date || transaction.processedAt || transaction.createdAt;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Invoice Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <Logo />
            <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase mt-1">
              Official Payment Receipt
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.bg}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>
        </div>

        {/* Transaction Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-b border-gray-100 text-xs">
          <div>
            <p className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Date & Time</p>
            <p className="font-semibold text-gray-800 mt-0.5">{formattedDate}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Payment Method</p>
            <p className="font-semibold text-gray-800 mt-0.5">{transaction.paymentMethod || "Nexaro Escrow"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Service Category</p>
            <span className="inline-block px-2 py-0.5 mt-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[10px] uppercase">
              {transaction.category}
            </span>
          </div>
        </div>

        {/* Task and Worker details */}
        <div className="py-3 border-b border-gray-100 space-y-2 text-xs">
          <div>
            <p className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Task Title</p>
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{transaction.taskTitle}</p>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-xs">
                {transaction.workerName ? transaction.workerName.charAt(0).toUpperCase() : "W"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-xs">{transaction.workerName}</p>
                <p className="text-[10px] text-gray-400">Assigned Professional</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="py-3 border-b border-gray-100 text-xs">
          <div className="flex justify-between items-baseline text-xs sm:text-sm font-extrabold text-gray-900">
            <span>Paid Amount</span>
            <span className="text-base sm:text-lg text-[#0A6E5C]">
              ₹{Number(transaction.amount).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#0A6E5C] text-white font-bold text-xs hover:bg-[#085a4b] active:scale-[0.98] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

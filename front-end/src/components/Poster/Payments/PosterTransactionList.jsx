import {
  Search,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ReceiptText,
  User,
  Inbox,
  ChevronDown,
} from "lucide-react";
import PaginationSections from "../../sharedComponents/PaginationSections";

export default function PosterTransactionList({
  transactions = [],
  pagination = {},
  currentPage = 1,
  onPageChange,
  searchQuery = "",
  onSearchChange,
  statusFilter = "all",
  onStatusFilterChange,
  onViewReceipt,
  onReleasePayment,
  isLoading = false,
}) {
  const totalPages = pagination?.totalPages || 1;

  const getStatusDisplay = (status) => {
    switch (status) {
      case "released":
        return {
          icon: <CheckCircle2 size={16} className="text-emerald-600" />,
          iconBg: "bg-emerald-50 border-emerald-200/60",
          badgeBg: "bg-emerald-50 text-[#0A6E5C] border-emerald-200/50",
          label: "RELEASED",
          amountColor: "text-[#0A6E5C]",
          borderColor: "border-l-emerald-500",
        };
      case "in_escrow":
        return {
          icon: <ShieldCheck size={16} className="text-amber-600" />,
          iconBg: "bg-amber-50 border-amber-200/60",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200/50",
          label: "IN ESCROW",
          amountColor: "text-amber-600",
          borderColor: "border-l-amber-500",
        };
      case "refunded":
        return {
          icon: <RotateCcw size={16} className="text-sky-600" />,
          iconBg: "bg-sky-50 border-sky-200/60",
          badgeBg: "bg-sky-50 text-sky-700 border-sky-200/50",
          label: "REFUNDED",
          amountColor: "text-sky-600",
          borderColor: "border-l-sky-500",
        };
      default:
        return {
          icon: <Clock size={16} className="text-gray-600" />,
          iconBg: "bg-gray-50 border-gray-200/60",
          badgeBg: "bg-gray-100 text-gray-700 border-gray-200",
          label: "PENDING",
          amountColor: "text-gray-900",
          borderColor: "border-l-gray-400",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-gray-200/80 rounded-2xl p-2.5 sm:p-3 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks or workers..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50/70 border border-gray-200/80 rounded-xl placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6E5C]/20 focus:border-[#0A6E5C] transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-gray-50/70 border border-gray-200/80 rounded-xl font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0A6E5C]/20 focus:border-[#0A6E5C] transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="in_escrow">In Escrow</option>
              <option value="released">Released</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs animate-pulse space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-32 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-10 text-center shadow-xs flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F6FAF8] border border-emerald-100 flex items-center justify-center text-gray-400">
            <Inbox size={24} />
          </div>
          <h4 className="text-sm font-bold text-gray-800 mt-1">No Transactions Found</h4>
          <p className="text-xs text-gray-400 max-w-sm">
            {searchQuery || statusFilter !== "all"
              ? "No transactions match your current search and filter criteria."
              : "When you accept worker bids and release payments, complete transaction records will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const statusConfig = getStatusDisplay(tx.status);
            const formattedDate = new Date(tx.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const formattedTime = new Date(tx.date).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={tx.id}
                className={`bg-white border border-gray-200/80 hover:border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all border-l-4 ${statusConfig.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                {/* Left info */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${statusConfig.iconBg}`}
                  >
                    {statusConfig.icon}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {tx.taskTitle}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-wider">
                        {tx.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <User size={12} className="text-gray-400" />
                        <span className="font-semibold text-gray-800">{tx.workerName}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right info & actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                  {/* Amount and status */}
                  <div className="text-left md:text-right">
                    <div className="flex items-baseline md:justify-end gap-1.5">
                      <span className={`text-base sm:text-lg font-black tracking-tight ${statusConfig.amountColor}`}>
                        ₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center md:justify-end gap-1.5 mt-0.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border tracking-wider ${statusConfig.badgeBg}`}
                      >
                        {statusConfig.label}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {formattedDate} • {formattedTime}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {tx.status === "in_escrow" ? (
                      <button
                        type="button"
                        onClick={() => onReleasePayment(tx)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A6E5C] hover:bg-[#085a4b] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                      >
                        <ArrowUpRight size={14} />
                        <span>Release Payment</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onViewReceipt(tx)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/90 hover:border-emerald-200 hover:bg-emerald-50/40 text-gray-700 hover:text-[#0A6E5C] text-xs font-semibold transition cursor-pointer"
                      >
                        <ReceiptText size={14} />
                        <span>View Receipt</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-2">
          <PaginationSections
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  ArrowDownLeft,
  Clock,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PaginationSections from "../../sharedComponents/PaginationSections";
import { useGetTransactionHistoryQuery } from "../../../store/services/workerApi";

const ITEMS_PER_PAGE = 5;

export default function TransactionHistoryCard() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useGetTransactionHistoryQuery({
    limit: ITEMS_PER_PAGE,
    page: page,
  });

  const transactionsData = data?.transactionsData || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalTransactions = pagination?.totalTransactions || 0;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const getTransactionTitle = (tx) => {
    if (tx.title) return tx.title;
    switch (tx.transactionType) {
      case "to_worker_wallet":
        return "Transferred to Wallet";
      case "to_worker":
        return "Task Earnings Credited";
      case "withdrawal":
      case "withdrawn":
        return "Bank Payout Withdrawal";
      case "to_escrow":
        return "Escrow Payment";
      default:
        return "Wallet Transaction";
    }
  };

  const getTransactionCategory = (tx) => {
    if (tx.category) return tx.category;
    switch (tx.transactionType) {
      case "to_worker_wallet":
        return "Wallet Credit";
      case "to_worker":
        return "Task Payment";
      case "withdrawal":
      case "withdrawn":
        return "Withdrawal";
      case "to_escrow":
        return "Escrow Deposit";
      default:
        return "Earnings";
    }
  };

  const formatTransactionDate = (tx) => {
    const rawDate = tx.createdAt || tx.processedAt || tx.date;
    if (!rawDate) return "Recent";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate;
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return rawDate;
    }
  };

  const getStatusBadge = (tx) => {
    const status = (tx.status || "").toLowerCase();
    const type = (tx.transactionType || tx.type || "").toLowerCase();

    if (status === "failed") {
      return {
        icon: <AlertCircle size={16} className="text-red-600" />,
        iconBg: "bg-red-50 text-red-600",
        amountColor: "text-red-600",
        prefix: "",
        badge: "bg-red-50 text-red-700 border-red-200",
        statusText: "FAILED",
      };
    }

    if (status === "pending" || type === "pending") {
      return {
        icon: <Clock size={16} className="text-amber-600" />,
        iconBg: "bg-amber-50 text-amber-600",
        amountColor: "text-amber-600",
        prefix: "",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        statusText: "PENDING",
      };
    }

    if (type === "withdrawn" || type === "withdrawal") {
      return {
        icon: <Building2 size={16} className="text-gray-600" />,
        iconBg: "bg-gray-100 text-gray-600",
        amountColor: "text-[#111827]",
        prefix: "-",
        badge: "bg-gray-100 text-gray-600 border-gray-200",
        statusText: tx.status ? tx.status.toUpperCase() : "WITHDRAWN",
      };
    }

    // Default: received / credited
    return {
      icon: <ArrowDownLeft size={16} className="text-[#0A6E5C]" />,
      iconBg: "bg-emerald-50 text-[#0A6E5C]",
      amountColor: "text-[#0A6E5C]",
      prefix: "+",
      badge: "bg-emerald-50 text-[#0A6E5C] border-emerald-200/60",
      statusText: tx.status ? tx.status.toUpperCase() : "RECEIVED",
    };
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full min-h-[360px]">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">Transaction History</h3>
            <p className="text-xs text-gray-500 mt-0.5">Recent credits, payouts and pending invoices</p>
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-50 mt-1">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 size={26} className="animate-spin text-[#0A6E5C]" />
              <p className="text-xs text-gray-400 font-medium">Loading transactions...</p>
            </div>
          ) : isError ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center px-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Failed to load transactions</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {error?.data?.message || "An unexpected error occurred while fetching records."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A6E5C] hover:bg-[#085a4b] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                Try Again
              </button>
            </div>
          ) : transactionsData.length === 0 ? (
            <div className="py-14 text-center text-gray-400 text-xs">
              No transactions found.
            </div>
          ) : (
            transactionsData.map((tx) => {
              const config = getStatusBadge(tx);
              const title = getTransactionTitle(tx);
              const category = getTransactionCategory(tx);
              const formattedDate = formatTransactionDate(tx);

              return (
                <div
                  key={tx._id || tx.id}
                  className="py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-[#F6FAF8] -mx-2 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${config.iconBg}`}
                    >
                      {config.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#111827] truncate leading-tight">
                        {title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formattedDate} • {category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${config.amountColor}`}>
                      {config.prefix}₹{Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.badge}`}
                    >
                      {config.statusText}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {!isLoading && !isError && totalTransactions > 0 && (
        <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span>–
            <span className="font-semibold text-gray-700">
              {Math.min(startIndex + ITEMS_PER_PAGE, totalTransactions)}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{totalTransactions}</span> transactions
          </p>

          <PaginationSections
            page={Number(page)}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-0 pb-0"
          />
        </div>
      )}
    </div>
  );
}

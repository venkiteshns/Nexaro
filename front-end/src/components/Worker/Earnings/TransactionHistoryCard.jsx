import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Clock, Building2, ChevronRight, CheckCircle2 } from "lucide-react";
import PaginationSections from "../../sharedComponents/PaginationSections";

const INITIAL_TRANSACTIONS = [
  {
    id: "tx-1",
    title: "Kitchen Tap Repair",
    date: "Dec 12, 2024",
    category: "Plumbing",
    amount: 650.0,
    type: "received", // "received" | "withdrawn" | "pending"
    status: "RECEIVED",
  },
  {
    id: "tx-2",
    title: "Bank Payout",
    date: "Dec 10, 2024",
    category: "Withdrawal",
    amount: 2500.0,
    type: "withdrawn",
    status: "WITHDRAWN",
  },
  {
    id: "tx-3",
    title: "Full Home Wiring",
    date: "Dec 11, 2024",
    category: "Electrical",
    amount: 4200.0,
    type: "pending",
    status: "PENDING",
  },
  {
    id: "tx-4",
    title: "Bedroom Painting",
    date: "Dec 08, 2024",
    category: "Painting",
    amount: 1800.0,
    type: "received",
    status: "RECEIVED",
  },
  {
    id: "tx-5",
    title: "UPI Payout",
    date: "Dec 05, 2024",
    category: "Withdrawal",
    amount: 1000.0,
    type: "withdrawn",
    status: "WITHDRAWN",
  },
  {
    id: "tx-6",
    title: "AC Filter Cleaning & Gas Refill",
    date: "Dec 01, 2024",
    category: "Appliances",
    amount: 1200.0,
    type: "received",
    status: "RECEIVED",
  },
];

const ITEMS_PER_PAGE = 5;

export default function TransactionHistoryCard({ transactions = INITIAL_TRANSACTIONS }) {
  const [filter, setFilter] = useState("all"); // "all" | "received" | "withdrawn" | "pending"
  const [page, setPage] = useState(1);

  const handleFilterChange = (tabKey) => {
    setFilter(tabKey);
    setPage(1);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const displayedList = filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadge = (tx) => {
    switch (tx.type) {
      case "received":
        return {
          icon: <ArrowDownLeft size={16} className="text-[#0A6E5C]" />,
          iconBg: "bg-emerald-50 text-[#0A6E5C]",
          amountColor: "text-[#0A6E5C]",
          prefix: "+",
          badge: "bg-emerald-50 text-[#0A6E5C] border-emerald-200/60",
        };
      case "withdrawn":
        return {
          icon: <Building2 size={16} className="text-gray-600" />,
          iconBg: "bg-gray-100 text-gray-600",
          amountColor: "text-[#111827]",
          prefix: "-",
          badge: "bg-gray-100 text-gray-600 border-gray-200",
        };
      case "pending":
        return {
          icon: <Clock size={16} className="text-amber-600" />,
          iconBg: "bg-amber-50 text-amber-600",
          amountColor: "text-amber-600",
          prefix: "",
          badge: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          icon: <CheckCircle2 size={16} className="text-gray-500" />,
          iconBg: "bg-gray-100 text-gray-500",
          amountColor: "text-gray-800",
          prefix: "",
          badge: "bg-gray-100 text-gray-600 border-gray-200",
        };
    }
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">Transaction History</h3>
            <p className="text-xs text-gray-500 mt-0.5">Recent credits, payouts and pending invoices</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F6FAF8] border border-emerald-100 rounded-2xl self-start sm:self-auto">
            {[
              { key: "all", label: "All" },
              { key: "received", label: "Received" },
              { key: "withdrawn", label: "Withdrawn" },
              { key: "pending", label: "Pending" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleFilterChange(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filter === tab.key
                    ? "bg-[#0A6E5C] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-gray-50 mt-1">
          {displayedList.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              No {filter !== "all" ? filter : ""} transactions found.
            </div>
          ) : (
            displayedList.map((tx) => {
              const config = getStatusBadge(tx);
              return (
                <div
                  key={tx.id}
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
                        {tx.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {tx.date} • {tx.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-sm font-extrabold ${config.amountColor}`}>
                      {config.prefix}₹{Number(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.badge}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span>–
            <span className="font-semibold text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, totalItems)}</span> of{" "}
            <span className="font-semibold text-gray-700">{totalItems}</span> transactions
          </p>

          <PaginationSections
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-0 pb-0"
          />
        </div>
      )}
    </div>
  );
}

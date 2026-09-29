import { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Inbox,
} from "lucide-react";
import { useAdminGetFinanceTransactionsQuery } from "../../../store/services/adminApi";

function PaymentStatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "COMPLETED":
    case "SUCCESS":
      return (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/70 whitespace-nowrap shrink-0">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          COMPLETED
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/70 whitespace-nowrap shrink-0">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-500" />
          PENDING
        </span>
      );
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70 whitespace-nowrap shrink-0">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-rose-500" />
          REFUNDED
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-50 text-red-700 border border-red-200/70 whitespace-nowrap shrink-0">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500" />
          FAILED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200 whitespace-nowrap shrink-0">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-400" />
          {normalized || "UNKNOWN"}
        </span>
      );
  }
}

function UserAvatar({ initials, name, colorIndex = 0 }) {
  const avatarColors = [
    "bg-emerald-100 text-[#0A6E5C]",
    "bg-teal-100 text-teal-800",
    "bg-cyan-100 text-cyan-800",
    "bg-emerald-50 text-emerald-900 border border-emerald-200",
  ];
  const colorClass = avatarColors[colorIndex % avatarColors.length];

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${colorClass}`}
      title={name}
    >
      {initials}
    </div>
  );
}

export default function PaymentsTable({ dateRange = "All Time" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [prevFilterKey, setPrevFilterKey] = useState(`${dateRange}|${selectedStatus}|${debouncedSearch}`);
  const currentFilterKey = `${dateRange}|${selectedStatus}|${debouncedSearch}`;
  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
  }

  const { data, isLoading, isFetching } = useAdminGetFinanceTransactionsQuery({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearch,
    status: selectedStatus,
    range: dateRange,
  });

  const transactions = data?.transactions || [];
  const totalTransactionsCount = data?.totalTransactions || 0;
  const totalPages = data?.totalPages || 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by Txn ID, customer, email, or task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A6E5C]/20 focus:border-[#0A6E5C] transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-xs text-xs font-semibold">
            {["ALL", "COMPLETED", "PENDING"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${selectedStatus === status
                  ? "bg-[#0A6E5C] text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {status.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute top-2 right-4 z-10 flex items-center gap-1 text-[11px] text-[#0A6E5C] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Updating...</span>
          </div>
        )}

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FBFA] border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">USER</th>
                <th className="py-4 px-6">TASK / PURPOSE</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6">COMMISSION</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-7 h-7 animate-spin text-[#0A6E5C]" />
                      <span className="text-xs">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((item, idx) => (
                  <tr
                    key={item.rawId || item.id}
                    className="hover:bg-[#F6FAF8] transition-colors group"
                  >

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          initials={item.user.initials}
                          name={item.user.name}
                          colorIndex={idx}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {item.user.name}
                          </p>
                          {item.user.email && (
                            <p className="text-xs text-gray-400 truncate">
                              {item.user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className="text-gray-800 font-medium truncate">
                          {item.task}
                        </p>
                        {item.category && item.category !== "General" && (
                          <span className="inline-block mt-0.5 text-[10px] text-gray-400 uppercase font-semibold">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {item.hasCommission ? (
                        <span className="text-gray-300 font-medium">—</span>
                      ) : (
                        <span className="font-bold text-gray-900">
                          {item.amount}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {item.hasCommission ? (
                        <span className="font-semibold text-[#0A6E5C]">
                          {item.commission}
                        </span>
                      ) : (
                        <span className="text-gray-300 font-medium">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <PaymentStatusBadge status={item.status} />
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-gray-500 text-xs font-medium">
                        {item.date}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-600">
                        No transactions found
                      </p>
                      <p className="text-xs text-gray-400 max-w-xs">
                        {searchQuery
                          ? `No transactions match "${searchQuery}". Try a different keyword.`
                          : "No transactions recorded for this period."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#0A6E5C]" />
              <span className="text-xs">Loading transactions...</span>
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((item, idx) => (
              <div
                key={item.rawId || item.id}
                className="p-4 space-y-3 hover:bg-[#F6FAF8] transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <UserAvatar
                      initials={item.user.initials}
                      name={item.user.name}
                      colorIndex={idx}
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.user.name}
                      </p>
                      {item.user.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {item.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <PaymentStatusBadge status={item.status} />
                </div>

                <div className="bg-[#F8FBFA] px-3 py-2 rounded-xl text-xs text-gray-700 font-medium leading-relaxed">
                  <span className="text-gray-400 mr-1.5 font-normal">
                    {item.hasCommission ? "Purpose:" : "Type:"}
                  </span>
                  {item.task}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-gray-400 block text-[11px]">
                      {item.hasCommission ? "Commission" : "Amount"}
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        item.hasCommission ? "text-[#0A6E5C]" : "text-gray-900"
                      }`}
                    >
                      {item.hasCommission ? item.commission : item.amount}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[11px]">Date</span>
                    <span className="text-gray-600 font-medium">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              No transactions matching your criteria
            </div>
          )}
        </div>

        <div className="p-4 sm:px-6 bg-[#FBFDFB] border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {transactions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {totalTransactionsCount.toLocaleString()}
            </span>{" "}
            transactions
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentPage === 1 || isLoading
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50"
                }`}
            >
              PREVIOUS
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum
                      ? "bg-[#0A6E5C] text-white shadow-xs"
                      : "text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer ${currentPage === totalPages || isLoading
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#0A6E5C] hover:text-emerald-700 hover:bg-emerald-50"
                }`}
            >
              NEXT PAGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

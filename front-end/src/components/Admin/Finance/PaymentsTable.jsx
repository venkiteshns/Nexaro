import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Loader2,
  Inbox,
} from "lucide-react";
import { useAdminGetFinanceTransactionsQuery } from "../../../store/services/adminApi";

/**
 * Status Badge Component with themed colors
 */
function PaymentStatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "COMPLETED":
    case "SUCCESS":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          COMPLETED
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          PENDING
        </span>
      );
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          REFUNDED
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          FAILED
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          {normalized || "UNKNOWN"}
        </span>
      );
  }
}

/**
 * Avatar with Initials
 */
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

/**
 * PaymentsTable Component
 * Live transaction table with debounced search, status filter, and pagination
 */
export default function PaymentsTable({ dateRange = "All Time" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Debounce search input
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

  // Query live backend
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

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
  };

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

  // CSV Export
  const handleExport = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = [
      "Transaction ID",
      "User Name",
      "Email",
      "Task / Purpose",
      "Amount",
      "Commission",
      "Status",
      "Date",
    ];
    const rows = transactions.map((t) => [
      t.id,
      `"${t.user?.name || ""}"`,
      `"${t.user?.email || ""}"`,
      `"${t.task || ""}"`,
      `"${t.amount || ""}"`,
      `"${t.commission || ""}"`,
      t.status,
      `"${t.date || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `nexaro_transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar: Search, Status Filter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Bar */}
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

        {/* Filter Pills and Export Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
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

          {/* Export Action Button */}
          <button
            type="button"
            onClick={handleExport}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0A6E5C] transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Desktop Table + Mobile Cards) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute top-2 right-4 z-10 flex items-center gap-1 text-[11px] text-[#0A6E5C] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Updating...</span>
          </div>
        )}

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FBFA] border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {/* <th className="py-4 px-6">TRANS ID</th> */}
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
                    {/* Transaction ID with Copy Button */}
                    {/* <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleCopyId(item.rawId || item.id)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0A6E5C] hover:underline cursor-pointer group-hover:text-emerald-700"
                        title="Click to copy ID"
                      >
                        <span>{item.id}</span>
                        {copiedTxnId === (item.rawId || item.id) ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy
                            size={12}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                      </button>
                    </td> */}

                    {/* User Info with Avatar */}
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

                    {/* Task Title */}
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

                    {/* Amount */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">
                        {item.amount}
                      </span>
                    </td>

                    {/* Commission */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#0A6E5C]">
                        {item.commission}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <PaymentStatusBadge status={item.status} />
                    </td>

                    {/* Date */}
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

        {/* MOBILE / TABLET CARD VIEW */}
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
                {/* Card Header: User & Status */}
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
                      <button
                        type="button"
                        onClick={() => handleCopyId(item.rawId || item.id)}
                        className="text-xs font-mono text-[#0A6E5C] hover:underline cursor-pointer"
                      >
                        {item.id}
                      </button>
                    </div>
                  </div>
                  <PaymentStatusBadge status={item.status} />
                </div>

                {/* Task Name */}
                <div className="bg-[#F8FBFA] px-3 py-2 rounded-xl text-xs text-gray-700 font-medium">
                  <span className="text-gray-400 mr-1.5 font-normal">Task:</span>
                  {item.task}
                </div>

                {/* Amounts & Date Row */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Amount</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {item.amount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Commission</span>
                    <span className="font-bold text-[#0A6E5C] text-sm">
                      {item.commission}
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

        {/* Table Footer with Pagination matching reference image */}
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

          {/* Previous / Next Controls */}
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

            {/* Page pill indicators */}
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

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  Filter,
  CheckCircle2,
  Clock3,
  RotateCcw,
  XCircle,
  Copy,
  Check,
} from "lucide-react";

/**
 * Status Badge Component with themed colors
 */
function PaymentStatusBadge({ status }) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "COMPLETED":
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

// Initial mock dataset matching reference image
const DEFAULT_TRANSACTIONS = [
  {
    id: "#TXN-9402",
    user: {
      name: "Rahul A.",
      initials: "RA",
      email: "rahul.a@example.com",
    },
    task: "Deep Home Cleaning",
    amount: "₹3,450",
    rawAmount: 3450,
    commission: "₹517.50",
    rawCommission: 517.5,
    status: "COMPLETED",
    date: "24 Oct, 2023",
  },
  {
    id: "#TXN-8821",
    user: {
      name: "Sneha P.",
      initials: "SP",
      email: "sneha.p@example.com",
    },
    task: "On-call Plumbing",
    amount: "₹850",
    rawAmount: 850,
    commission: "₹127.50",
    rawCommission: 127.5,
    status: "PENDING",
    date: "23 Oct, 2023",
  },
  {
    id: "#TXN-7418",
    user: {
      name: "Manoj K.",
      initials: "MK",
      email: "manoj.k@example.com",
    },
    task: "Garden Maintenance",
    amount: "₹1,200",
    rawAmount: 1200,
    commission: "₹0.00",
    rawCommission: 0.0,
    status: "REFUNDED",
    date: "22 Oct, 2023",
  },
  {
    id: "#TXN-5522",
    user: {
      name: "Deepa V.",
      initials: "DV",
      email: "deepa.v@example.com",
    },
    task: "Sofa Sanitization",
    amount: "₹2,100",
    rawAmount: 2100,
    commission: "₹315.00",
    rawCommission: 315.0,
    status: "COMPLETED",
    date: "21 Oct, 2023",
  },
  {
    id: "#TXN-4190",
    user: {
      name: "Arjun N.",
      initials: "AN",
      email: "arjun.n@example.com",
    },
    task: "Electrical Wiring Fix",
    amount: "₹1,750",
    rawAmount: 1750,
    commission: "₹262.50",
    rawCommission: 262.5,
    status: "COMPLETED",
    date: "20 Oct, 2023",
  },
  {
    id: "#TXN-3920",
    user: {
      name: "Pooja R.",
      initials: "PR",
      email: "pooja.r@example.com",
    },
    task: "Kitchen Deep Cleaning",
    amount: "₹2,800",
    rawAmount: 2800,
    commission: "₹420.00",
    rawCommission: 420.0,
    status: "PENDING",
    date: "19 Oct, 2023",
  },
  {
    id: "#TXN-2811",
    user: {
      name: "Vipin S.",
      initials: "VS",
      email: "vipin.s@example.com",
    },
    task: "Appliance Repair",
    amount: "₹950",
    rawAmount: 950,
    commission: "₹142.50",
    rawCommission: 142.5,
    status: "COMPLETED",
    date: "18 Oct, 2023",
  },
  {
    id: "#TXN-1544",
    user: {
      name: "Kavya M.",
      initials: "KM",
      email: "kavya.m@example.com",
    },
    task: "Wall Painting & Patch",
    amount: "₹4,500",
    rawAmount: 4500,
    commission: "₹0.00",
    rawCommission: 0.0,
    status: "REFUNDED",
    date: "17 Oct, 2023",
  },
];

/**
 * PaymentsTable Component
 * Fully functional, responsive transaction table with search, filter, and pagination
 */
export default function PaymentsTable({
  transactions = DEFAULT_TRANSACTIONS,
  totalTransactionsCount = 2341,
  pageSize = 4,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedTxnId, setCopiedTxnId] = useState(null);

  // Filter transactions based on search and status
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.task.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || txn.status.toUpperCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchQuery, selectedStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedTxnId(id);
    setTimeout(() => setCopiedTxnId(null), 1500);
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
            placeholder="Search by Txn ID, customer, or service task..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A6E5C]/20 focus:border-[#0A6E5C] transition-all shadow-xs"
          />
        </div>

        {/* Filter Pills and Export Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl shadow-xs text-xs font-semibold">
            {["ALL", "COMPLETED", "PENDING", "REFUNDED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  selectedStatus === status
                    ? "bg-[#0A6E5C] text-white shadow-xs"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0A6E5C] transition-all shadow-xs"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Desktop Table + Mobile Cards) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FBFA] border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">TRANS ID</th>
                <th className="py-4 px-6">USER</th>
                <th className="py-4 px-6">TASK</th>
                <th className="py-4 px-6">AMOUNT</th>
                <th className="py-4 px-6">COMMISSION</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F6FAF8] transition-colors group"
                  >
                    {/* Transaction ID with Copy Button */}
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleCopyId(item.id)}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0A6E5C] hover:underline cursor-pointer group-hover:text-emerald-700"
                        title="Click to copy ID"
                      >
                        <span>{item.id}</span>
                        {copiedTxnId === item.id ? (
                          <Check size={12} className="text-emerald-600" />
                        ) : (
                          <Copy
                            size={12}
                            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                      </button>
                    </td>

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
                      <span className="text-gray-800 font-medium">
                        {item.task}
                      </span>
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
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search query or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE / TABLET CARD VIEW */}
        <div className="md:hidden divide-y divide-gray-100">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((item, idx) => (
              <div
                key={item.id}
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
                        onClick={() => handleCopyId(item.id)}
                        className="text-xs font-mono text-[#0A6E5C] hover:underline"
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
            <div className="py-10 text-center text-gray-400 text-sm">
              No transactions matching your criteria
            </div>
          )}
        </div>

        {/* Table Footer with Pagination matching reference image */}
        <div className="p-4 sm:px-6 bg-[#FBFDFB] border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 font-medium">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {paginatedTransactions.length}
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
              disabled={currentPage === 1}
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-[#0A6E5C] hover:bg-emerald-50"
              }`}
            >
              PREVIOUS
            </button>

            {/* Page pill indicators */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-[#0A6E5C] text-white shadow-xs"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all ${
                currentPage === totalPages
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

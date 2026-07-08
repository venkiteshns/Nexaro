import { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  CheckCircle,
  Wrench,
  Zap,
  Brush,
  Truck,
  BookOpen,
  Hammer,
  AlertTriangle,
  X,
  ArrowRight,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useGetWorkerNearbyTasksQuery } from "../../store/services/api";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../customHooks/useDebounce";

const LIMIT = 6;

function getCategoryIcon(category) {
  const iconMap = {
    Plumbing: <Wrench size={20} className="text-[#0A6E5C]" />,
    Electrical: <Zap size={20} className="text-[#0A6E5C]" />,
    Cleaning: <Brush size={20} className="text-[#0A6E5C]" />,
    Moving: <Truck size={20} className="text-[#0A6E5C]" />,
    Tutoring: <BookOpen size={20} className="text-[#0A6E5C]" />,
  };
  return iconMap[category] || <Hammer size={20} className="text-[#0A6E5C]" />;
}

function formatDistance(metres) {
  if (!metres && metres !== 0) return null;
  if (metres < 1000) return `${Math.round(metres)} m away`;
  return `${(metres / 1000).toFixed(1)} km away`;
}

// ─── Task Card ─────────────────────────────────────────────────────────────────

function TaskCard({ task, handleNavigate, handleActiveJob }) {
  const isUrgent = task.urgencyLevel === "urgent";
  const hasBid = task?.myBid;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden">

      {isUrgent && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Urgent
        </span>
      )}

      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ${isUrgent ? "mt-6" : ""}`}>
          {getCategoryIcon(task.category)}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium">Budget</p>
          <p className="text-xl font-extrabold text-gray-900">
            ₹{Number(task.amount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-900 text-[15px] leading-snug">
          {task.title}
        </p>
        <p className={`mt-1 text-xs font-medium flex items-center gap-1 ${task.bidCount > 0 ? "text-[#0A6E5C]" : "text-gray-400"}`}>
          <Users size={12} />
          {task.bidCount > 0 ? `${task.bidCount} bids` : "0 bids"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {task.address?.city && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin size={12} />
            {task.address.city}
          </p>
        )}
        {task.distance != null && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            {formatDistance(task.distance)}
          </span>
        )}
      </div>

      {hasBid ? (
        hasBid.status === "pending" ? (
          <div className="flex items-center gap-2 mt-auto bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <Clock size={15} className="text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">Bid Placed</span>
            <span className="text-xs text-gray-500 ml-auto">
              ₹{Number(task.myBid.amount).toLocaleString("en-IN")} · {task.myBid.status}
            </span>
          </div>
        ) : hasBid.status === "accepted" ? (
          <div className="flex flex-col items-center gap-2 mt-auto bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-[#0A6E5C]" />
              <span className="text-xs font-semibold text-[#0A6E5C]">Bid Accepted</span>
            </div>
            <button
              onClick={() => handleActiveJob(task._id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
            >
              Go to Active Job <ArrowRight size={13} />
            </button>
          </div>
        ) : hasBid.status === "rejected" ? (
          <div className="flex items-center gap-2 mt-auto bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            <X size={15} className="text-red-600" />
            <span className="text-xs font-semibold text-red-600">Bid Rejected</span>
            <span className="text-xs text-gray-500 ml-auto">
              Bid: ₹{Number(task.myBid.amount).toLocaleString("en-IN")}
            </span>
          </div>
        ) : ""
      ) : (
        <button
          onClick={() => handleNavigate(task._id)}
          className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors"
        >
          Place Bid →
        </button>
      )}
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  console.log(page, totalPages);

  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    console.log("initial pages", pages);

    if (page > 3) pages.push("...");
    console.log("after ellipsis pages", pages);

    for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
      pages.push(p);
    }
    console.log("after for loop pages", pages);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pb-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 text-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${p === page
              ? "bg-[#0A6E5C] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const NearbyTasks = () => {
  const navigate = useNavigate();

  const handleNavigate = (taskId) => navigate(`/worker/place-bid/${taskId}`);
  const handleActiveJob = (taskId) => navigate(`/worker/active-job/${taskId}`);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const debouncedText = useDebounce({ searchText, delay: 500 });

  const { data, isLoading, isFetching, isError, error } = useGetWorkerNearbyTasksQuery({
    category: selectedCategory,
    search: debouncedText,
    page,
    limit: LIMIT,
  });

  const allTasks = data?.tasks || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.totalPages ?? 1;
  const total = pagination.total ?? 0;
  const noServiceArea = isError && error?.data?.message?.includes("service area");

  // Reset to page 1 whenever search or category changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Heading ── */}
          <div className="mb-5">
            <h1 className="text-[22px] font-extrabold text-gray-900">Nearby Tasks</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin size={13} />
              Showing open tasks within 10 km of your service area
            </p>
          </div>

          {/* ── Search ── */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for tasks (e.g. Plumbing, Electrical...)"
              value={searchText}
              onChange={handleSearchChange}
              className="border-none outline-none bg-transparent text-sm text-gray-900 w-full placeholder-gray-400"
            />
            {searchText && (
              <button onClick={() => { setSearchText(""); setPage(1); }}>
                <X size={15} className="text-gray-400 hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>

          {/* ── Category pills ── */}
          <div className="flex flex-wrap gap-2 items-center mb-5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">
              Category
            </span>

            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${!selectedCategory
                ? "bg-[#0A6E5C] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                }`}
            >
              All
            </button>

            {data?.categoryList?.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(selectedCategory === cat ? null : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${selectedCategory === cat
                  ? "bg-[#0A6E5C] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Loading ── */}
          {(isLoading || isFetching) && (
            <div className="text-center py-16 text-gray-400 text-sm">
              Loading nearby tasks...
            </div>
          )}

          {/* ── Service area error ── */}
          {noServiceArea && (
            <div className="flex flex-col items-center gap-3 py-16 bg-white rounded-2xl border border-orange-200">
              <AlertTriangle size={36} className="text-orange-400" />
              <p className="text-sm font-semibold text-gray-700">
                Your service area is not set
              </p>
              <p className="text-xs text-gray-400 text-center max-w-xs">
                We need your location to show you tasks nearby.
                Please update your profile to set your service area.
              </p>
              <button className="mt-2 px-5 py-2 bg-[#0A6E5C] text-white rounded-xl text-sm font-semibold hover:bg-[#085e4e] transition-colors">
                Update Profile
              </button>
            </div>
          )}

          {/* ── Generic error ── */}
          {isError && !noServiceArea && (
            <div className="text-center py-16 text-red-500 text-sm">
              Could not load tasks. Please try again later.
            </div>
          )}

          {/* ── Empty ── */}
          {!isLoading && !isFetching && !isError && allTasks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No tasks found nearby
              </p>
              <p className="text-xs text-gray-400">
                {searchText || selectedCategory
                  ? "Try clearing the category or search filters."
                  : "There are no open tasks within 10 km of your service area right now."}
              </p>
            </div>
          )}

          {/* ── Task List ── */}
          {!isLoading && !isFetching && !isError && allTasks.length > 0 && (
            <>
              {/* Content Number Feedback */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 font-medium">
                  Showing{" "}
                  <span className="font-bold text-gray-700">
                    {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, total)}
                  </span>{" "}
                  of <span className="font-bold text-gray-700">{total}</span> task{total !== 1 ? "s" : ""} within 50 km
                </p>
                {totalPages > 1 && (
                  <p className="text-xs text-gray-400">
                    Page {page} of {totalPages}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTasks.map((task) => (
                  <TaskCard
                    handleNavigate={handleNavigate}
                    handleActiveJob={handleActiveJob}
                    key={task._id}
                    task={task}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default NearbyTasks;

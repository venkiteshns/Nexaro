import { useState } from "react";
import {
  Search,
  MapPin,
  AlertTriangle,
  X,
} from "lucide-react";

import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useGetWorkerNearbyTasksQuery } from "../../store/services/workerApi";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../customHooks/useDebounce";
import PaginationSections from "../../components/sharedComponents/PaginationSections";
import { TaskCard } from "../../components/Poster/TaskCard";

const LIMIT = 6;

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
              <PaginationSections
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

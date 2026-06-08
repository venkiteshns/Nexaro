import React, { useState } from "react";
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
} from "lucide-react";

import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import { useGetWorkerNearbyTasksQuery } from "../../store/services/api";

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

const CATEGORIES = ["Plumbing", "Electrical", "Cleaning", "Moving", "Tutoring"];

function TaskCard({ task }) {
  console.log("task ", task);

  const isUrgent = task.urgencyLevel === "urgent";
  const isNew = task.urgencyLevel === "new";
  const hasBid = !!task.myBid;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden">

      {isUrgent && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Urgent
        </span>
      )}
      {isNew && (
        <span className="absolute top-4 left-4 bg-[#0A6E5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          New
        </span>
      )}

      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center ${isUrgent || isNew ? "mt-6" : ""}`}>
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
        <div className="flex items-center gap-2 mt-auto bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
          <CheckCircle size={15} className="text-[#0A6E5C]" />
          <span className="text-sm font-semibold text-[#0A6E5C]">Bid Placed</span>
          <span className="text-xs text-gray-500 ml-auto">
            ₹{Number(task.myBid.amount).toLocaleString("en-IN")} · Pending
          </span>
        </div>
      ) : (
        <button className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold bg-[#0A6E5C] text-white hover:bg-[#085e4e] transition-colors">
          Place Bid →
        </button>
      )}
    </div>
  );
}

const NearbyTasks = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, isError, error } = useGetWorkerNearbyTasksQuery();

  const allTasks = data?.tasks || [];
  const noServiceArea = isError && error?.data?.message?.includes("service area");
  const filteredTasks = allTasks.filter((task) => {
    const categoryMatch = !selectedCategory || task.category === selectedCategory;

    const searchMatch =
      searchText === "" ||
      task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      task.address?.city?.toLowerCase().includes(searchText.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        <div className="flex-1 overflow-y-auto p-6">

          <div className="mb-5">
            <h1 className="text-[22px] font-extrabold text-gray-900">Nearby Tasks</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin size={13} />
              Showing open tasks within 10 km of your service area
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 shadow-sm">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for tasks (e.g. Plumbing, Electrical...)"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-none outline-none bg-transparent text-sm text-gray-900 w-full placeholder-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center mb-5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-1">
              Category
            </span>

            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${!selectedCategory
                ? "bg-[#0A6E5C] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                }`}
            >
              All
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${selectedCategory === cat
                  ? "bg-[#0A6E5C] text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-[#0A6E5C]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-16 text-gray-400 text-sm">
              Loading nearby tasks...
            </div>
          )}

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

          {isError && !noServiceArea && (
            <div className="text-center py-16 text-red-500 text-sm">
              Could not load tasks. Please try again later.
            </div>
          )}

          {!isLoading && !isError && filteredTasks.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No tasks found nearby
              </p>
              <p className="text-xs text-gray-400">
                {allTasks.length === 0
                  ? "There are no open tasks within 10 km of your service area right now."
                  : "Try clearing the category or search filters."}
              </p>
            </div>
          )}

          {!isLoading && !isError && filteredTasks.length > 0 && (
            <>
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {filteredTasks.length} task{filteredTasks.length > 1 ? "s" : ""} found within 10 km
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default NearbyTasks;

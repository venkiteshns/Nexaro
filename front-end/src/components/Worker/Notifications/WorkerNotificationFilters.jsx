import { CheckCheck, Flame, Circle } from "lucide-react";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread", hasDot: true },
  { id: "nearby_tasks", label: "Nearby Tasks" },
  { id: "bid_results", label: "Bid Results" },
  { id: "payments", label: "Payments" },
  { id: "urgent", label: "Urgent", hasFlame: true },
  { id: "system", label: "System" },
];

const WorkerNotificationFilters = ({
  activeFilter,
  onFilterChange,
  counts = {},
  onMarkAllRead,
  isMarkingAllRead = false,
}) => {
  const {
    all = 0,
    unread = 0,
    nearby = 0,
    bids = 0,
    payments = 0,
    urgent = 0,
    system = 0,
  } = counts;

  const getTabCount = (id) => {
    switch (id) {
      case "all":
        return all;
      case "unread":
        return unread;
      case "nearby_tasks":
        return nearby;
      case "bid_results":
        return bids;
      case "payments":
        return payments;
      case "urgent":
        return urgent;
      case "system":
        return system;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 md:p-2.5 rounded-2xl border border-gray-200 shadow-xs mb-6">
      {/* Unified Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {FILTER_TABS.map((tab) => {
          // Hide "Urgent" tab if there are no urgent tasks
          if (tab.id === "urgent" && urgent === 0) return null;

          const isActive = activeFilter === tab.id;
          const count = getTabCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[#0A6E5C] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.hasDot && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    unread > 0 ? "bg-emerald-400 animate-pulse" : "bg-gray-300"
                  }`}
                />
              )}
              {tab.hasFlame && (
                <Flame size={13} className={isActive ? "text-white fill-white" : "text-rose-500 fill-rose-500"} />
              )}
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mark All as Read Action */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={onMarkAllRead}
          disabled={unread === 0 || isMarkingAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-emerald-50 hover:text-[#0A6E5C] hover:border-emerald-200 disabled:opacity-40 disabled:pointer-events-none transition-all"
        >
          <CheckCheck size={14} className={unread > 0 ? "text-[#0A6E5C]" : ""} />
          <span>{isMarkingAllRead ? "Marking..." : "Mark all as read"}</span>
        </button>
      </div>
    </div>
  );
};

export default WorkerNotificationFilters;

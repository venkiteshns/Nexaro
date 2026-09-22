import { CheckCheck } from "lucide-react";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread", hasDot: true },
  { id: "payments", label: "Payments" },
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
    payments = 0,
    system = 0,
  } = counts;

  const getTabCount = (id) => {
    switch (id) {
      case "all":
        return all;
      case "unread":
        return unread;
      case "payments":
        return payments;
      case "system":
        return system;
      default:
        return 0;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-1.5 sm:p-2 rounded-xl border border-gray-200/80 shadow-xs">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;
          const count = getTabCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#0A6E5C] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.hasDot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    unread > 0 ? "bg-emerald-400 animate-pulse" : "bg-gray-300"
                  }`}
                />
              )}
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
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

      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
        <button
          onClick={onMarkAllRead}
          disabled={unread === 0 || isMarkingAllRead}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-emerald-50 hover:text-[#0A6E5C] hover:border-emerald-200 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          <CheckCheck size={13} className={unread > 0 ? "text-[#0A6E5C]" : ""} />
          <span>{isMarkingAllRead ? "Marking..." : "Mark all as read"}</span>
        </button>
      </div>
    </div>
  );
};

export default WorkerNotificationFilters;

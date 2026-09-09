const TABS = [
  { id: "all", label: "All" },
  { id: "bids", label: "Bids" },
  { id: "payments", label: "Payments" },
  { id: "tasks", label: "Tasks" },
  { id: "unread", label: "Unread" },
  { id: "system", label: "System" },
];

const PosterNotificationFilters = ({
  activeFilter = "all",
  onFilterChange,
  counts = {},
}) => {
  const {
    all = 0,
    bids = 0,
    payments = 0,
    tasks = 0,
    unread = 0,
    system = 0,
  } = counts;

  const getCount = (id) => {
    switch (id) {
      case "all":
        return all;
      case "bids":
        return bids;
      case "payments":
        return payments;
      case "tasks":
        return tasks;
      case "unread":
        return unread;
      case "system":
        return system;
      default:
        return 0;
    }
  };

  return (
    <div className="border-b border-gray-200/80">
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          // Hide system tab if 0
          if (tab.id === "system" && system === 0) return null;
          // Hide payments tab if 0
          if (tab.id === "payments" && payments === 0) return null;

          const isActive = activeFilter === tab.id;
          const count = getCount(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`group inline-flex items-center gap-1.5 pb-2 pt-0.5 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-[#0A6E5C] text-[#0A6E5C]"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.id === "unread" && unread > 0 && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-[#0A6E5C]" : "bg-emerald-500"
                  } animate-pulse`}
                />
              )}
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-emerald-100 text-[#0A6E5C]"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PosterNotificationFilters;

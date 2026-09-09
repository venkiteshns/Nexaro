const PosterNotificationPills = ({
  counts = {},
  activeFilter = "all",
  onSelectFilter,
}) => {
  const {
    unread = 0,
    bids = 0,
    payments = 0,
    tasks = 0,
  } = counts;

  const pills = [
    {
      id: "unread",
      label: `${unread} Unread`,
      count: unread,
      hasDot: true,
      colorClasses: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
      activeClasses: "bg-sky-600 text-white border-sky-600 shadow-xs",
      dotClass: "bg-sky-500",
    },
    {
      id: "bids",
      label: `${bids} New Bid${bids === 1 ? "" : "s"}`,
      count: bids,
      colorClasses: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      activeClasses: "bg-blue-600 text-white border-blue-600 shadow-xs",
    },
    {
      id: "payments",
      label: `${payments} Payment${payments === 1 ? "" : "s"}`,
      count: payments,
      colorClasses: "bg-emerald-50 text-[#0A6E5C] border-emerald-200 hover:bg-emerald-100",
      activeClasses: "bg-[#0A6E5C] text-white border-[#0A6E5C] shadow-xs",
    },
    {
      id: "tasks",
      label: `${tasks} Task Update${tasks === 1 ? "" : "s"}`,
      count: tasks,
      colorClasses: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
      activeClasses: "bg-amber-600 text-white border-amber-600 shadow-xs",
    },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
      {pills.map((pill) => {
        const isActive = activeFilter === pill.id;

        return (
          <button
            key={pill.id}
            type="button"
            onClick={() => onSelectFilter(isActive ? "all" : pill.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
              isActive ? pill.activeClasses : pill.colorClasses
            }`}
            title={`Filter by ${pill.id}`}
          >
            {pill.hasDot && (
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? "bg-white" : pill.dotClass || "bg-sky-500"
                } ${unread > 0 ? "animate-pulse" : ""}`}
              />
            )}
            <span>{pill.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PosterNotificationPills;

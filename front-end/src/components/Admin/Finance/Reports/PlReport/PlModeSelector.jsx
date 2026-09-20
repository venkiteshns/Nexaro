export default function PlModeSelector({ filterMode, onSelectMode }) {
  return (
    <div className="flex items-center justify-between gap-2 pb-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {filterMode === "month" ? "SELECT MONTH" : "CUSTOM DATE RANGE"}
      </span>
      <div className="inline-flex p-0.5 bg-gray-100 rounded-lg border border-gray-200/70 text-[11px] font-semibold">
        <button
          type="button"
          onClick={() => onSelectMode("month")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filterMode === "month"
              ? "bg-white text-[#0A6E5C] shadow-xs font-bold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => onSelectMode("range")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filterMode === "range"
              ? "bg-white text-[#0A6E5C] shadow-xs font-bold"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Date Range
        </button>
      </div>
    </div>
  );
}

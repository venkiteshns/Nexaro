export default function PlDateRangeFilter({
  fromDate,
  toDate,
  todayStr,
  onFromDateChange,
  onToDateChange,
  onApplyPreset,
  dateError,
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            FROM DATE
          </label>
          <input
            type="date"
            value={fromDate}
            max={toDate || todayStr}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs sm:text-sm font-semibold bg-[#F8FBFA] border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none text-gray-700 cursor-pointer shadow-xs"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            TO DATE
          </label>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            max={todayStr}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full px-2.5 py-2 text-xs sm:text-sm font-semibold bg-[#F8FBFA] border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 outline-none text-gray-700 cursor-pointer shadow-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-0.5">
        <span className="text-[10px] text-gray-400 font-bold shrink-0">Quick:</span>
        <button
          type="button"
          onClick={() => onApplyPreset("thisMonth")}
          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-[#0A6E5C] text-gray-600 transition-colors cursor-pointer shrink-0"
        >
          This Month
        </button>
        <button
          type="button"
          onClick={() => onApplyPreset("30days")}
          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-[#0A6E5C] text-gray-600 transition-colors cursor-pointer shrink-0"
        >
          Last 30 Days
        </button>
        <button
          type="button"
          onClick={() => onApplyPreset("7days")}
          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-[#0A6E5C] text-gray-600 transition-colors cursor-pointer shrink-0"
        >
          Last 7 Days
        </button>
        <button
          type="button"
          onClick={() => onApplyPreset("today")}
          className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-gray-100 hover:bg-emerald-50 hover:text-[#0A6E5C] text-gray-600 transition-colors cursor-pointer shrink-0"
        >
          Today
        </button>
      </div>

      {dateError && (
        <p className="text-[11px] text-rose-500 font-semibold pt-0.5">
          {dateError}
        </p>
      )}
    </div>
  );
}

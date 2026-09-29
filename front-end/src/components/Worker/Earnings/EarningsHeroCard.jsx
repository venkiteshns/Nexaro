import { ArrowUpRight, Clock } from "lucide-react";

export default function EarningsHeroCard({
  availableBalance = 0,
  onWithdrawClick,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xs relative overflow-hidden hover:border-emerald-200 transition-all flex flex-row items-center justify-between gap-3">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      <div className="relative z-10 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-pulse" />
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
            Available Balance
          </p>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
            ₹{Number(availableBalance).toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-gray-400">INR</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-end gap-1 shrink-0">
        <button
          onClick={onWithdrawClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#0A6E5C] text-white font-bold text-xs sm:text-sm hover:bg-[#085a4b] active:scale-[0.98] transition-all shadow-2xs cursor-pointer whitespace-nowrap"
        >
          <ArrowUpRight size={14} className="stroke-[2.5] sm:w-4 sm:h-4" />
          <span>Withdraw</span>
        </button>

        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400 font-medium">
          <Clock size={10} className="text-gray-400 shrink-0" />
          <span>Processes in 24-48h</span>
        </div>
      </div>
    </div>
  );
}

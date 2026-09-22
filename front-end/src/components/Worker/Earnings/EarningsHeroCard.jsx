import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function EarningsHeroCard({
  availableBalance = 0,
  totalEarned = 0,
  totalJobs = 0,
  sinceDate = "",
  onWithdrawClick,
}) {




  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
      {/* Card 1: Available Balance */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden hover:border-emerald-200 transition-all flex flex-row items-center justify-between gap-3">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A6E5C] animate-pulse" />
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Available Balance
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              ₹{Number(availableBalance).toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-bold text-gray-400">INR</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={onWithdrawClick}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0A6E5C] text-white font-bold text-xs hover:bg-[#085a4b] active:scale-[0.98] transition-all shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <ArrowUpRight size={14} className="stroke-[2.5]" />
            <span>Withdraw</span>
          </button>

          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Clock size={10} className="text-gray-400 shrink-0" />
            <span>Processes in 24-48h</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Earned */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3.5 sm:p-4 shadow-xs relative overflow-hidden hover:border-emerald-200 transition-all flex flex-row items-center justify-between gap-3">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/40 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Earned
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              ₹{Number(totalEarned).toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] font-bold text-gray-400">INR</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-end gap-1 shrink-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/60">
            <CheckCircle2 size={12} />
            {totalJobs} jobs completed
          </span>
          <span className="text-[10px] text-gray-400">
            Since {sinceDate}
          </span>
        </div>
      </div>
    </div>
  );
}

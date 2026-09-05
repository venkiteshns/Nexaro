import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function EarningsHeroCard({
  availableBalance = 0,
  totalEarned = 0,
  totalJobs = 0,
  sinceDate = "",
  onWithdrawClick,
}) {




  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xs relative overflow-hidden">
      {/* Decorative subtle background gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* 1. AVAILABLE BALANCE & WITHDRAW ACTION */}
        <div className="pr-0 md:pr-6 flex flex-row items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-pulse" />
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Available Balance
              </p>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                ₹{Number(availableBalance).toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-bold text-gray-400">INR</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={onWithdrawClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#0A6E5C] text-white font-bold text-xs sm:text-sm hover:bg-[#085a4b] active:scale-[0.98] transition-all shadow-sm shadow-[#0A6E5C]/20 cursor-pointer whitespace-nowrap"
            >
              <ArrowUpRight size={15} className="stroke-[2.5]" />
              <span>Withdraw</span>
            </button>

            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
              <Clock size={11} className="text-gray-400 shrink-0" />
              <span>Processes in 24-48h</span>
            </div>
          </div>
        </div>

        {/* 2. TOTAL EARNED */}
        <div className="pt-4 md:pt-0 md:pl-6 flex flex-row items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Earned
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                ₹{Number(totalEarned).toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] font-bold text-gray-400">INR</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/60">
              <CheckCircle2 size={13} />
              {totalJobs} jobs completed
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">
              Since {sinceDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

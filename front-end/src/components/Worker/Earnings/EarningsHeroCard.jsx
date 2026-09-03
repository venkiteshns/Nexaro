import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function EarningsHeroCard({
  availableBalance = 1200,
  thisMonthEarnings = 8400,
  completedJobsMonth = 6,
  totalEarned = 28000,
  totalJobs = 34,
  sinceDate = "Nov 2024",
  onWithdrawClick,
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xs relative overflow-hidden">
      {/* Decorative subtle background gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 md:gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* 1. AVAILABLE BALANCE & WITHDRAW ACTION */}
        <div className="md:col-span-5 pr-0 md:pr-4 flex flex-row md:flex-col items-center md:items-start justify-between gap-3 sm:gap-4">
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

          <div className="flex flex-col items-end md:items-start gap-1 shrink-0">
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

        {/* 2 & 3. STATS IN A RESPONSIVE 2-COL GRID */}
        <div className="md:col-span-7 pt-4 md:pt-0 md:pl-5 grid grid-cols-2 gap-3 sm:gap-6 divide-x divide-gray-100">
          {/* This Month */}
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              This Month
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              ₹{Number(thisMonthEarnings).toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              From {completedJobsMonth} completed jobs
            </p>
          </div>

          {/* Total Earned */}
          <div className="pl-3 sm:pl-6 flex flex-col justify-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Earned
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
              ₹{Number(totalEarned).toLocaleString("en-IN")}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/60">
                <CheckCircle2 size={11} />
                {totalJobs} jobs
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:inline">
                Since {sinceDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

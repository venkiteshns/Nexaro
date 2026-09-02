import { ArrowUpRight, Clock, CheckCircle2, TrendingUp, Wallet } from "lucide-react";

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
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      {/* Decorative subtle background gradient blob */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* 1. AVAILABLE BALANCE & WITHDRAW ACTION (5 cols) */}
        <div className="md:col-span-5 pr-0 md:pr-4 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0A6E5C] animate-pulse" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Available Balance
              </p>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                ₹{Number(availableBalance).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-gray-400">INR</span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <button
              onClick={onWithdrawClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0A6E5C] text-white font-bold text-sm hover:bg-[#085a4b] active:scale-[0.98] transition-all shadow-md shadow-[#0A6E5C]/20 cursor-pointer"
            >
              <ArrowUpRight size={17} className="stroke-[2.5]" />
              <span>Withdraw</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
              <Clock size={13} className="text-gray-400" />
              <span>Withdrawals process within 24-48 hours</span>
            </div>
          </div>
        </div>

        {/* 2. THIS MONTH EARNINGS (3.5 cols) */}
        <div className="md:col-span-3 pt-6 md:pt-0 md:px-6 flex flex-col justify-center h-full">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            This Month
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            ₹{Number(thisMonthEarnings).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-500 font-medium mt-1.5">
            From {completedJobsMonth} completed jobs
          </p>
        </div>

        {/* 3. TOTAL EARNED STATS (3.5 cols) */}
        <div className="md:col-span-4 pt-6 md:pt-0 md:pl-6 flex flex-col justify-center h-full">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Total Earned
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            ₹{Number(totalEarned).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Since {sinceDate}
          </p>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/60">
              <CheckCircle2 size={13} />
              {totalJobs} jobs completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

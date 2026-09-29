import { TrendingUp, Award, Calendar, CheckCircle2 } from "lucide-react";

export default function EarningsStatCards({
  totalEarned = 0,
  totalJobs = 0,
  sinceDate = "",
  avgPerJob = 0,
  highestPaidJob = 0,
  earnedThisWeek = 0,
}) {
  const stats = [
    {
      label: "TOTAL EARNED",
      value: `₹${Number(totalEarned).toLocaleString("en-IN")}`,
      subtext: totalJobs ? `${totalJobs} jobs completed` : `Since ${sinceDate || "joining"}`,
      icon: <CheckCircle2 size={13} className="text-emerald-600 sm:w-3.5 sm:h-3.5" />,
      iconBg: "bg-emerald-50",
      highlight: false,
    },
    {
      label: "THIS WEEK",
      value: `₹${Number(earnedThisWeek).toLocaleString("en-IN")}`,
      subtext: "Last 7 days active",
      icon: <Calendar size={13} className="text-[#0A6E5C] sm:w-3.5 sm:h-3.5" />,
      iconBg: "bg-emerald-50",
      highlight: true,
    },
    {
      label: "AVG PER JOB",
      value: `₹${Number(avgPerJob).toLocaleString("en-IN")}`,
      subtext: "All completed tasks",
      icon: <TrendingUp size={13} className="text-gray-500 sm:w-3.5 sm:h-3.5" />,
      iconBg: "bg-gray-100",
      highlight: false,
    },
    {
      label: "HIGHEST PAID",
      value: `₹${Number(highestPaidJob).toLocaleString("en-IN")}`,
      subtext: "Peak task earnings",
      icon: <Award size={13} className="text-amber-500 sm:w-3.5 sm:h-3.5" />,
      iconBg: "bg-amber-50",
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-xl p-2.5 sm:p-3.5 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate">
              {stat.label}
            </span>
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md ${stat.iconBg} flex items-center justify-center shrink-0`}
            >
              {stat.icon}
            </div>
          </div>

          <div className="mt-0.5">
            <h3
              className={`text-base sm:text-xl font-extrabold tracking-tight truncate ${
                stat.highlight ? "text-[#0A6E5C]" : "text-[#111827]"
              }`}
            >
              {stat.value}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 truncate">
              {stat.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

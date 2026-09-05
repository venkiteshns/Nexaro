import { TrendingUp, Award, Calendar } from "lucide-react";

export default function EarningsStatCards({
  avgPerJob = 824,
  highestPaidJob = 3500,
  earnedThisWeek = 2100,
}) {
  const stats = [
    {
      label: "AVG PER JOB",
      value: `₹${Number(avgPerJob).toLocaleString("en-IN")}`,
      subtext: "Based on all completed tasks",
      icon: <TrendingUp size={16} className="text-gray-500" />,
      highlight: false,
    },
    {
      label: "HIGHEST PAID JOB",
      value: `₹${Number(highestPaidJob).toLocaleString("en-IN")}`,
      subtext: "Peak single task earnings",
      icon: <Award size={16} className="text-amber-500" />,
      highlight: false,
    },
    {
      label: "EARNED THIS WEEK",
      value: `₹${Number(earnedThisWeek).toLocaleString("en-IN")}`,
      subtext: "Last 7 days active earnings",
      icon: <Calendar size={16} className="text-[#0A6E5C]" />,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>

          <div className="mt-0.5">
            <h3
              className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                stat.highlight ? "text-[#0A6E5C]" : "text-[#111827]"
              }`}
            >
              {stat.value}
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-0.5">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

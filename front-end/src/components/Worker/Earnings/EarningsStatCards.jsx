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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>

          <div className="mt-1">
            <h3
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                stat.highlight ? "text-[#0A6E5C]" : "text-[#111827]"
              }`}
            >
              {stat.value}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { Star, TrendingUp, CheckCircle2, Award, Clock } from "lucide-react";

const WorkerStatCards = ({ stats = {} }) => {
  const activeBids = stats.activeBids ?? 0;
  const jobsCompleted = stats.jobsCompleted ?? 0;
  const totalEarned = stats.totalEarned ?? 0;
  const rating = Number(stats.rating || 4.8).toFixed(1);

  const cards = [
    {
      id: "active-bids",
      label: "ACTIVE BIDS",
      value: activeBids,
      topBorder: "from-teal-500 to-emerald-600",
      textColor: "text-gray-900",
      accentBg: "bg-teal-50 text-teal-700",
      icon: <Clock size={16} />,
      hint: "Currently under review",
    },
    {
      id: "jobs-completed",
      label: "JOBS COMPLETED",
      value: jobsCompleted,
      topBorder: "from-sky-500 to-cyan-500",
      textColor: "text-gray-900",
      accentBg: "bg-sky-50 text-sky-700",
      icon: <CheckCircle2 size={16} />,
      hint: "Tasks successfully finished",
    },
    {
      id: "total-earned",
      label: "TOTAL EARNED",
      value: `₹${Number(totalEarned).toLocaleString("en-IN")}`,
      topBorder: "from-[#0A6E5C] to-emerald-400",
      textColor: "text-[#0A6E5C]",
      accentBg: "bg-emerald-50 text-[#0A6E5C]",
      icon: <TrendingUp size={16} />,
      hint: "Lifetime completed payouts",
    },
    {
      id: "your-rating",
      label: "YOUR RATING",
      value: (
        <span className="flex items-center gap-1">
          {rating}
          <Star size={17} className="text-amber-400 fill-amber-400 drop-shadow-2xs" />
        </span>
      ),
      topBorder: "from-amber-400 to-yellow-500",
      textColor: "text-gray-900",
      accentBg: "bg-amber-50 text-amber-700",
      icon: <Award size={14} />,
      hint: "Based on poster ratings",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="relative bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-4 shadow-2xs overflow-hidden flex flex-col justify-between select-none"
        >
          {/* Top colored accent stripe matching mockup indicator */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.topBorder}`} />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              {card.label}
            </span>
            <div className={`p-1 rounded-md ${card.accentBg} opacity-80`}>
              {card.icon}
            </div>
          </div>

          <div>
            <div className={`text-xl sm:text-2xl font-black ${card.textColor} tracking-tight leading-none`}>
              {card.value}
            </div>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">
              {card.hint}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkerStatCards;

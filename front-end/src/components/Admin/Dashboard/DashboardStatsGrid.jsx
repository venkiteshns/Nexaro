import { Users, CheckSquare, Wallet, ShieldCheck } from "lucide-react";

/**
 * DashboardStatsGrid Component
 * 4 KPI stat cards displayed strictly in one row
 * White and Green Nexaro theme
 */
const DashboardStatsGrid = ({ stats = {}, isLoading = false }) => {
  const {
    totalUsers = 0,
    activeTasks = 0,
    revenueToday = 0,
    verifications = 0,
  } = stats;

  const cards = [
    {
      id: "total_users",
      label: "Total Users",
      value: totalUsers.toLocaleString("en-IN"),
      icon: <Users size={18} />,
      iconBg: "bg-emerald-50 text-[#0A6E5C] border-emerald-100",
      valueColor: "text-gray-900",
    },
    {
      id: "active_tasks",
      label: "Active Tasks",
      value: activeTasks.toLocaleString("en-IN"),
      icon: <CheckSquare size={18} />,
      iconBg: "bg-teal-50 text-teal-700 border-teal-100",
      valueColor: "text-gray-900",
    },
    {
      id: "revenue_today",
      label: "Revenue Today",
      value: `₹${revenueToday.toLocaleString("en-IN")}`,
      icon: <Wallet size={18} />,
      iconBg: "bg-emerald-50 text-[#0A6E5C] border-emerald-100",
      valueColor: "text-gray-900",
    },
    {
      id: "verifications",
      label: "Verifications",
      value: verifications.toLocaleString("en-IN"),
      icon: <ShieldCheck size={18} />,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      valueColor: "text-amber-600 font-bold",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-4 shadow-2xs animate-pulse space-y-2.5 min-w-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100" />
            <div className="space-y-1.5">
              <div className="h-3 w-16 bg-gray-100 rounded" />
              <div className="h-6 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group relative bg-white rounded-2xl border border-gray-200/90 p-3.5 sm:p-4 lg:p-4.5 shadow-2xs hover:shadow-xs hover:border-gray-300 transition-all duration-200 flex flex-col gap-2 sm:gap-2.5 min-w-0"
        >
          {/* Top Row: Icon */}
          <div className="flex items-center">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105 ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          {/* Bottom Content: Label + Value */}
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-semibold text-gray-500 truncate mb-0.5">
              {card.label}
            </p>
            <h3
              className={`text-base sm:text-xl lg:text-2xl font-bold tracking-tight truncate ${card.valueColor}`}
            >
              {card.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsGrid;

import { ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp, Receipt, Activity, CreditCard } from "lucide-react";

/**
 * PaymentStatsCards Component
 * Displays key financial metrics in a clean white and green theme
 */
export default function PaymentStatsCards({ stats }) {
  const defaultStats = [
    {
      id: "gmv",
      label: "Total GMV",
      value: "₹28.4L",
      rawAmount: 2840000,
      change: "+14.2%",
      isPositive: true,
      subtext: "vs last month",
      icon: TrendingUp,
      accentColor: "from-emerald-500 to-teal-600",
      indicatorColor: "bg-emerald-500",
    },
    {
      id: "net_revenue",
      label: "Net Revenue",
      value: "₹1.42L",
      rawAmount: 142000,
      change: "+8.6%",
      isPositive: true,
      subtext: "Platform commission",
      icon: IndianRupee,
      accentColor: "from-[#0A6E5C] to-emerald-600",
      indicatorColor: "bg-[#0A6E5C]",
    },
    {
      id: "avg_transaction",
      label: "Avg. Transaction",
      value: "₹1,420",
      rawAmount: 1420,
      change: "+3.1%",
      isPositive: true,
      subtext: "Per booking average",
      icon: Receipt,
      accentColor: "from-teal-500 to-emerald-400",
      indicatorColor: "bg-teal-500",
    },
    {
      id: "total_transactions",
      label: "Total Transactions",
      value: "2,341",
      rawAmount: 2341,
      change: "+18.4%",
      isPositive: true,
      subtext: "Total processed orders",
      icon: CreditCard,
      accentColor: "from-emerald-600 to-[#0A6E5C]",
      indicatorColor: "bg-emerald-600",
    },
  ];

  const cards = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon || Activity;
        return (
          <div
            key={card.id || card.label}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Subtle top indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor} opacity-80 group-hover:opacity-100 transition-opacity`} />

            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <IconComponent size={18} />
              </div>
            </div>

            {/* Middle row: Big Metric Value */}
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {card.value}
              </h3>
            </div>

            {/* Bottom row: Trend & subtext */}
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                {card.change && (
                  <span
                    className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md text-[11px] ${
                      card.isPositive !== false
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {card.isPositive !== false ? (
                      <ArrowUpRight size={13} className="mr-0.5" />
                    ) : (
                      <ArrowDownRight size={13} className="mr-0.5" />
                    )}
                    {card.change}
                  </span>
                )}
              </div>
              <span className="text-gray-400 font-medium text-[11px] truncate">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

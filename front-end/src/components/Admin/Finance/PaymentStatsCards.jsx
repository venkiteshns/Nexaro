import { IndianRupee, TrendingUp, Receipt, Activity, CreditCard } from "lucide-react";

/**
 * PaymentStatsCards Component
 * Displays key financial metrics in a clean white and green theme
 */
const ICONS_BY_ID = {
  gmv: TrendingUp,
  net_revenue: IndianRupee,
  avg_transaction: Receipt,
  total_transactions: CreditCard,
};

export default function PaymentStatsCards({ stats = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="w-9 h-9 rounded-xl bg-gray-100" />
            </div>
            <div className="h-7 w-28 bg-gray-200 rounded" />
            <div className="pt-3 border-t border-gray-50 flex justify-between">
              <div className="h-3 w-12 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = stats || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const IconComponent = card.icon || ICONS_BY_ID[card.id] || Activity;
        return (
          <div
            key={card.id || card.label}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Subtle top indicator bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor || "from-[#0A6E5C] to-emerald-600"} opacity-80 group-hover:opacity-100 transition-opacity`}
            />

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

            {/* Bottom row: Subtext description */}
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center text-xs">
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

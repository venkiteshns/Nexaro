import { IndianRupee, TrendingUp, Receipt, Activity, CreditCard } from "lucide-react";

const ICONS_BY_ID = {
  gmv: TrendingUp,
  net_revenue: IndianRupee,
  avg_transaction: Receipt,
  total_transactions: CreditCard,
};

export default function PaymentStatsCards({ stats = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-xs animate-pulse space-y-2.5 sm:space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-gray-200 rounded" />
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gray-100" />
            </div>
            <div className="h-5 sm:h-7 w-20 sm:w-28 bg-gray-200 rounded" />
            <div className="pt-2 sm:pt-2.5 border-t border-gray-50 flex justify-between">
              <div className="h-2.5 w-16 sm:w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = stats || [];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon || ICONS_BY_ID[card.id] || Activity;
        return (
          <div
            key={card.id || card.label}
            className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor || "from-[#0A6E5C] to-emerald-600"} opacity-80 group-hover:opacity-100 transition-opacity`}
            />

            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 truncate">
                {card.label}
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <IconComponent size={13} className="sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="mt-2 sm:mt-2.5">
              <h3 className="text-base sm:text-2xl font-black text-[#111827] tracking-tight truncate">
                {card.value}
              </h3>
            </div>

            <div className="mt-1.5 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-gray-50 flex items-center">
              <span className="text-gray-400 font-medium text-[9px] sm:text-[11px] truncate">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

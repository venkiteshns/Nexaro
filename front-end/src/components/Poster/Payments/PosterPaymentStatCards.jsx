import { Wallet, ShieldAlert, CheckCircle2, TrendingUp } from "lucide-react";

export default function PosterPaymentStatCards({ stats = {}, isLoading = false }) {
  const {
    totalSpent = 0,
    spentThisMonth = 0,
    inEscrow = 0,
    escrowPaymentsCount = 0,
    successfullyReleased = 0,
    releasedPaymentsCount = 0,
  } = stats;

  const cardData = [
    {
      label: "TOTAL SPENT",
      value: `₹${Number(totalSpent).toLocaleString("en-IN")}`,
      subtext: `+₹${Number(spentThisMonth).toLocaleString("en-IN")} this month`,
      icon: <Wallet size={17} className="text-[#0A6E5C]" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      valueColor: "text-[#111827]",
      subtextColor: "text-emerald-600 flex items-center gap-1",
      hasTrend: true,
    },
    {
      label: "IN ESCROW",
      value: `₹${Number(inEscrow).toLocaleString("en-IN")}`,
      subtext: `${escrowPaymentsCount} payment${escrowPaymentsCount === 1 ? "" : "s"} held safely`,
      icon: <ShieldAlert size={17} className="text-amber-500" />,
      iconBg: "bg-amber-50 border-amber-100",
      valueColor: "text-amber-600",
      subtextColor: "text-gray-400",
    },
    {
      label: "SUCCESSFULLY RELEASED",
      value: `₹${Number(successfullyReleased).toLocaleString("en-IN")}`,
      subtext: `${releasedPaymentsCount} payment${releasedPaymentsCount === 1 ? "" : "s"} released`,
      icon: <CheckCircle2 size={17} className="text-emerald-500" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      valueColor: "text-[#0A6E5C]",
      subtextColor: "text-gray-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs animate-pulse space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="w-8 h-8 rounded-xl bg-gray-200" />
            </div>
            <div className="h-7 w-28 bg-gray-200 rounded" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {card.label}
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div>
            <h3 className={`text-2xl sm:text-[26px] font-extrabold tracking-tight ${card.valueColor}`}>
              {card.value}
            </h3>

            <div className="mt-1 flex items-center justify-between gap-2 flex-wrap text-[11px]">
              <span className={`font-medium ${card.subtextColor}`}>
                {card.hasTrend && <TrendingUp size={12} className="shrink-0" />}
                {card.subtext}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

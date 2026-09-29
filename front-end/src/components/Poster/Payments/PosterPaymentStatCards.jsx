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
      subtext: `+₹${Number(spentThisMonth).toLocaleString("en-IN")} this mo`,
      fullSubtext: `+₹${Number(spentThisMonth).toLocaleString("en-IN")} this month`,
      icon: <Wallet size={14} className="text-[#0A6E5C] sm:w-[17px] sm:h-[17px]" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      valueColor: "text-[#111827]",
      subtextColor: "text-emerald-600 flex items-center gap-0.5 sm:gap-1",
      hasTrend: true,
    },
    {
      label: "IN ESCROW",
      value: `₹${Number(inEscrow).toLocaleString("en-IN")}`,
      subtext: `${escrowPaymentsCount} held safely`,
      fullSubtext: `${escrowPaymentsCount} payment${escrowPaymentsCount === 1 ? "" : "s"} held safely`,
      icon: <ShieldAlert size={14} className="text-amber-500 sm:w-[17px] sm:h-[17px]" />,
      iconBg: "bg-amber-50 border-amber-100",
      valueColor: "text-amber-600",
      subtextColor: "text-gray-400",
    },
    {
      label: "RELEASED",
      fullLabel: "SUCCESSFULLY RELEASED",
      value: `₹${Number(successfullyReleased).toLocaleString("en-IN")}`,
      subtext: `${releasedPaymentsCount} released`,
      fullSubtext: `${releasedPaymentsCount} payment${releasedPaymentsCount === 1 ? "" : "s"} released`,
      icon: <CheckCircle2 size={14} className="text-emerald-500 sm:w-[17px] sm:h-[17px]" />,
      iconBg: "bg-emerald-50 border-emerald-100",
      valueColor: "text-[#0A6E5C]",
      subtextColor: "text-gray-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-2.5 sm:p-4 shadow-xs animate-pulse space-y-1.5 sm:space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="h-2.5 sm:h-3 w-12 sm:w-20 bg-gray-200 rounded" />
              <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg bg-gray-200" />
            </div>
            <div className="h-4 sm:h-6 w-14 sm:w-24 bg-gray-200 rounded" />
            <div className="h-2 sm:h-2.5 w-14 sm:w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200/80 rounded-xl p-2.5 sm:p-4 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">
              {card.fullLabel ? (
                <>
                  <span className="sm:hidden">{card.label}</span>
                  <span className="hidden sm:inline">{card.fullLabel}</span>
                </>
              ) : (
                card.label
              )}
            </span>
            <div
              className={`w-5 h-5 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              {card.icon}
            </div>
          </div>

          <div>
            <h3 className={`text-sm sm:text-xl font-extrabold tracking-tight truncate ${card.valueColor}`}>
              {card.value}
            </h3>

            <div className="mt-0.5 flex items-center gap-1 text-[8.5px] sm:text-[11px] truncate">
              <span className={`font-medium truncate ${card.subtextColor}`}>
                {card.hasTrend && <TrendingUp size={10} className="shrink-0" />}
                <span className="sm:hidden truncate">{card.subtext}</span>
                <span className="hidden sm:inline truncate">{card.fullSubtext}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

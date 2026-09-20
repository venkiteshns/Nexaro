export default function PlMetricsDisplay({ metrics, isLoading }) {
  return (
    <div className="grid grid-cols-2 gap-3 pt-2">
      <div className="bg-[#F8FBFA] p-3 rounded-xl border border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
          Gross Volume
        </span>
        <span className="text-sm sm:text-base font-extrabold text-[#111827]">
          {isLoading ? "..." : metrics.formattedGmv}
        </span>
      </div>

      <div className="bg-[#F8FBFA] p-3 rounded-xl border border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A6E5C] block mb-0.5">
          Net Margin ({metrics.profitMargin})
        </span>
        <span className="text-sm sm:text-base font-extrabold text-[#0A6E5C]">
          {isLoading ? "..." : metrics.formattedNetProfit}
        </span>
      </div>
    </div>
  );
}

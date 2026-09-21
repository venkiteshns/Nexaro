import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { useGetPosterSpendingChartQuery } from "../../../store/services/posterApi";

export default function PosterSpendingChart() {
  const [timeframe, setTimeframe] = useState("30D");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data, isLoading } = useGetPosterSpendingChartQuery(timeframe);

  const chartData = data?.chartData || [];
  const totalSpent = data?.totalSpent || 0;

  const maxAmount = Math.max(...chartData.map((d) => d.amount || 0), 100);

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              Spending Overview
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/50">
              <TrendingUp size={12} />
              ₹{Number(totalSpent).toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Your task payment distributions and escrow investments over time
          </p>
        </div>

        {/* Timeframe Selector Tabs */}
        <div className="flex items-center p-1 bg-[#F6FAF8] border border-emerald-100 rounded-xl self-start sm:self-auto">
          {["7D", "30D", "3M", "6M"].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                setHoveredIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${timeframe === tf
                  ? "bg-[#0A6E5C] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="pt-6">
        {isLoading ? (
          <div className="h-56 flex items-center justify-center animate-pulse">
            <div className="flex items-end gap-3 h-36 w-full px-4 justify-between">
              {[45, 65, 30, 80, 50, 75, 40].map((height, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-t-lg w-full"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-gray-400 text-xs gap-2">
            <BarChart3 size={32} className="text-gray-300" />
            <p>No payment records in this timeframe</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-8">
              {chartData.map((item, idx) => {
                const heightPercent = Math.max(8, Math.round((item.amount / maxAmount) * 100));
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 z-20 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <span>₹{Number(item.amount).toLocaleString("en-IN")}</span>
                        <div className="text-[9px] text-gray-300 font-normal">{item.date || item.name}</div>
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full max-w-[42px] flex items-end justify-center h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all duration-300 ${item.amount > 0
                            ? isHovered
                              ? "bg-[#0A6E5C] shadow-md shadow-[#0A6E5C]/30 scale-y-105"
                              : "bg-[#0A6E5C]/80 group-hover:bg-[#0A6E5C]"
                            : "bg-gray-100 group-hover:bg-gray-200"
                          }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis Labels */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 border-t border-gray-100 pt-2 text-[11px] text-gray-400 font-medium">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex-1 text-center truncate">
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

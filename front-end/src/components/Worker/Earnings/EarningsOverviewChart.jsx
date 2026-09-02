import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

const CHART_DATA = {
  "7D": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [450, 650, 0, 800, 1200, 1800, 600],
    dates: ["23 Aug", "24 Aug", "25 Aug", "26 Aug", "27 Aug", "28 Aug", "29 Aug"],
    total: "₹5,500",
  },
  "30D": {
    labels: ["1 Nov", "5 Nov", "10 Nov", "15 Nov", "20 Nov", "25 Nov", "30 Nov"],
    values: [
      350, 600, 400, 750, 500, 900, 450, 650, 300, 850, 700, 1100, 450, 600, 950,
      700, 500, 800,
    ],
    dates: [
      "1 Nov", "3 Nov", "5 Nov", "8 Nov", "10 Nov", "12 Nov", "15 Nov", "17 Nov",
      "19 Nov", "20 Nov", "22 Nov", "24 Nov", "26 Nov", "27 Nov", "28 Nov",
      "29 Nov", "30 Nov", "1 Dec",
    ],
    total: "₹8,400",
  },
  "3M": {
    labels: ["Sep", "Oct", "Nov"],
    values: [7200, 9500, 8400],
    dates: ["September 2024", "October 2024", "November 2024"],
    total: "₹25,100",
  },
  "1Y": {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    values: [3200, 4500, 6100, 5800, 7200, 8400],
    dates: ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"],
    total: "₹28,000",
  },
};

export default function EarningsOverviewChart() {
  const [timeframe, setTimeframe] = useState("30D"); // "7D" | "30D" | "3M" | "1Y"
  const [hoveredBar, setHoveredBar] = useState(null);

  const currentDataset = CHART_DATA[timeframe];
  const maxVal = Math.max(...currentDataset.values, 100);

  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
      {/* Header with Title and Timeframe Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#111827]">Earnings Overview</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C]">
              <TrendingUp size={12} />
              {currentDataset.total}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Daily income distribution and earnings momentum
          </p>
        </div>

        {/* Timeframe selector pills */}
        <div className="flex items-center p-1 bg-[#F6FAF8] border border-emerald-100 rounded-2xl self-start sm:self-auto">
          {["7D", "30D", "3M", "1Y"].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setTimeframe(tf);
                setHoveredBar(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === tf
                  ? "bg-[#0A6E5C] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-8 pb-3">
        <div className="relative h-48 sm:h-56 w-full flex items-end justify-between gap-1.5 sm:gap-2.5 px-2">
          {/* Subtle Grid baseline lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div className="border-b border-dashed border-gray-200 w-full" />
            <div className="border-b border-dashed border-gray-200 w-full" />
            <div className="border-b border-gray-200 w-full" />
          </div>

          {/* Render Interactive Bars */}
          {currentDataset.values.map((val, idx) => {
            const heightPercent = Math.max((val / maxVal) * 100, 6);
            const isHovered = hoveredBar === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                className="relative flex-1 flex flex-col items-center justify-end h-full group cursor-pointer z-10"
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 z-30 px-3 py-1.5 bg-[#111827] text-white text-xs rounded-xl shadow-lg whitespace-nowrap animate-in fade-in zoom-in-90 duration-150">
                    <p className="font-bold text-emerald-400">
                      ₹{val.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-gray-300">
                      {currentDataset.dates[idx]}
                    </p>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#111827] rotate-45" />
                  </div>
                )}

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] sm:max-w-[34px] rounded-t-lg transition-all duration-300 ${
                    isHovered
                      ? "bg-gradient-to-t from-[#0A6E5C] to-emerald-300 shadow-md shadow-[#0A6E5C]/30 scale-y-105"
                      : "bg-gradient-to-t from-[#0A6E5C]/80 to-emerald-400 hover:from-[#0A6E5C] hover:to-emerald-300"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Date Labels */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 pt-3 px-3">
          {currentDataset.labels.map((label, idx) => (
            <span key={idx} className="uppercase tracking-wider">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

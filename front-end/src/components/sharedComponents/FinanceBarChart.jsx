
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Loader2 } from "lucide-react";

/**
 * Custom Tooltip component for rich formatting
 */
const CustomTooltip = ({ active, payload, label, isVolume = false, currencySymbol = "₹" }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    const rawVal = Number(payload[0].value || 0);
    const displayVal = isVolume
      ? `${rawVal.toLocaleString()} orders`
      : `${currencySymbol}${rawVal.toLocaleString("en-IN", {
          minimumFractionDigits: rawVal % 1 !== 0 ? 2 : 0,
          maximumFractionDigits: 2,
        })}`;

    return (
      <div className="bg-[#111827] text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-800">
        <p className="font-bold text-emerald-400">{displayVal}</p>
        <p className="text-[10px] text-gray-300 mt-0.5">{item.date || label}</p>
      </div>
    );
  }
  return null;
};

const DEFAULT_TIMEFRAMES = [
  { label: "7 Days", shortLabel: "7D", value: "7D" },
  { label: "1 Month", shortLabel: "1M", value: "1M" },
  { label: "6 Months", shortLabel: "6M", value: "6M" },
  { label: "1 Year", shortLabel: "1Y", value: "1Y" },
];

export default function FinanceBarChart({
  title = "Revenue Trends",
  subtitle = "Financial momentum and transaction distribution",
  data = [],
  dataKey = "value",
  timeframe = "7D",
  onTimeframeChange,
  timeframeOptions = DEFAULT_TIMEFRAMES,
  metricTabs = null,
  activeMetric = null,
  onMetricChange = null,
  badgeText = null,
  badgeIcon: BadgeIcon = TrendingUp,
  isLoading = false,
  isFetching = false,
  currencySymbol = "₹",
}) {
  const isVolumeMetric = activeMetric === "volume" || activeMetric === "orders";

  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-7 shadow-xs">
      {/* Header with Title, Badge, Metric Tabs, and Timeframe Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              {title}
            </h3>
            {badgeText && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C] border border-emerald-100">
                {BadgeIcon && <BadgeIcon size={12} />}
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Optional Metric Switcher Tabs (e.g. Net Revenue, GMV, Volume) */}
          {metricTabs && metricTabs.length > 0 && (
            <div className="flex items-center gap-1 p-1 bg-[#F6FAF8] border border-emerald-100/60 rounded-2xl text-xs font-semibold">
              {metricTabs.map((tab) => {
                const isActive = activeMetric === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => onMetricChange && onMetricChange(tab.value)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-[#0A6E5C] shadow-xs font-bold border border-emerald-200/60"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Timeframe Selector Pill Component */}
          {timeframeOptions && timeframeOptions.length > 0 && (
            <div className="flex items-center gap-2">
              {isFetching && !isLoading && (
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              )}
              <div className="flex items-center p-1 bg-[#F6FAF8] border border-emerald-100/80 rounded-2xl">
                {timeframeOptions.map((option) => {
                  const isSelected = timeframe === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={isLoading}
                      onClick={() => onTimeframeChange && onTimeframeChange(option.value)}
                      className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected
                          ? "bg-[#0A6E5C] text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-800 hover:bg-emerald-50/50"
                      }`}
                    >
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="inline sm:hidden">
                        {option.shortLabel || option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-3 pb-1">
        {isLoading ? (
          <div className="w-full h-44 sm:h-52 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#0A6E5C]" />
            <span className="text-xs">Loading chart data...</span>
          </div>
        ) : data && data.length > 0 ? (
          <div className="w-full h-44 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="financeBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#0A6E5C" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tick={{ fill: "#6B7280", fontWeight: 500 }}
                />

                <YAxis
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    if (isVolumeMetric) {
                      return val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`;
                    }
                    return val >= 1000
                      ? `${currencySymbol}${(val / 1000).toFixed(1)}k`
                      : `${currencySymbol}${val}`;
                  }}
                  tick={{ fill: "#9CA3AF" }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(10, 110, 92, 0.05)" }}
                  content={
                    <CustomTooltip
                      isVolume={isVolumeMetric}
                      currencySymbol={currencySymbol}
                    />
                  }
                />

                <Bar
                  dataKey={dataKey}
                  fill="url(#financeBarGrad)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                  minPointSize={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="w-full h-44 flex flex-col items-center justify-center text-gray-400">
            <p className="text-xs">No chart data available for this timeframe</p>
          </div>
        )}
      </div>
    </div>
  );
}

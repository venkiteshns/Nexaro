import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

/**
 * Custom Tooltip component for Recharts
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg border border-gray-800">
        <p className="font-bold text-emerald-400">
          ₹{Number(data.amount || 0).toLocaleString("en-IN")}
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5">{data.day}</p>
      </div>
    );
  }
  return null;
};

/**
 * RevenueOverviewCard Component
 * Powered by Recharts chart library
 * Displays interactive revenue trajectory bar chart with Week/Month toggle
 * and bottom 3 metrics (THIS MONTH, TODAY, SUCCESS) in Nexaro's White & Green theme
 */
const RevenueOverviewCard = ({ data = {}, isLoading = false }) => {
  const [timeframe, setTimeframe] = useState("week"); // "week" | "month"

  const {
    thisMonth = 0,
    today = 0,
    weekTrajectory = [],
    monthTrajectory = [],
  } = data;

  const formatCompact = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${Number(val).toLocaleString("en-IN")}`;
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const currentTrajectory =
    timeframe === "month"
      ? monthTrajectory && monthTrajectory.length > 0
        ? monthTrajectory
        : weekTrajectory
      : weekTrajectory;

  const chartData =
    currentTrajectory && currentTrajectory.length > 0
      ? currentTrajectory.map((item) => ({
          day: item.day,
          amount: Number(item.amount || 0),
        }))
      : daysOfWeek.map((day) => ({ day, amount: 0 }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Revenue Overview
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {timeframe === "week"
              ? "Platform fee earnings for the last 7 days"
              : "Platform fee earnings for the last 4 weeks"}
          </p>
        </div>

        {/* Week / Month Toggle Pill */}
        <div className="inline-flex items-center self-start sm:self-auto p-1 bg-gray-100/90 rounded-xl border border-gray-200/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "week"
                ? "bg-[#0A6E5C] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "month"
                ? "bg-[#0A6E5C] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Recharts Bar Chart Canvas */}
      <div className="pt-1 pb-1 h-32 sm:h-36 w-full">
        {isLoading ? (
          <div className="h-full w-full bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-xs text-gray-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="adminRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#34D399" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#0A6E5C" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                dy={8}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(10, 110, 92, 0.05)", radius: 8 }}
              />
              <Bar
                dataKey="amount"
                fill="url(#adminRevenueGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={44}
                minPointSize={5}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom 2 Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 pt-3.5 mt-2 border-t border-gray-100">
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3 text-center">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            This Month
          </p>
          <p className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {formatCompact(thisMonth)}
          </p>
        </div>

        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3 text-center">
          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            Today
          </p>
          <p className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            ₹{Number(today).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverviewCard;

import React, { useState } from "react";
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
import TimeframeSelector from "./TimeframeSelector";
import { useGetWorkerEarningsChartQuery } from "../../../store/services/workerApi";

// Custom Tooltip component for rich formatting
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-[#111827] text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-800">
        <p className="font-bold text-emerald-400">
          ₹{Number(payload[0].value || 0).toLocaleString("en-IN")}
        </p>
        <p className="text-[10px] text-gray-300 mt-0.5">
          {item.date || label}
        </p>
      </div>
    );
  }
  return null;
};

export const EarningsChart = () => {
  const [timeframe, setTimeframe] = useState("7D");
  const { data, isLoading, isFetching } = useGetWorkerEarningsChartQuery(timeframe);

  const chartData = data?.chartData || [];
  const totalEarnings = data?.totalEarnings || 0;

  return (
    <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
      {/* Header with Title, Total Badge, and Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#111827]">Earnings Overview</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#0A6E5C]">
              <TrendingUp size={12} />
              ₹{totalEarnings.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Income distribution and earnings momentum from completed jobs
          </p>
        </div>

        {/* Timeframe Selector Pill Component */}
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
          )}
          <TimeframeSelector
            selectedTimeframe={timeframe}
            onChange={setTimeframe}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="pt-6 pb-2">
        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#0A6E5C]" />
            <span className="text-xs">Loading chart data...</span>
          </div>
        ) : (
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsBarGrad" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
                  tick={{ fill: "#9CA3AF" }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(10, 110, 92, 0.05)" }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="earnings"
                  fill="url(#earningsBarGrad)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsChart;
import { useState } from "react";
import { TrendingUp, BarChart3, Info } from "lucide-react";

/**
 * RevenueTrendsChart Component
 * Container for the Revenue Trends chart section in white & green theme.
 * Empty slot ready for custom chart integration (Chart.js, Recharts, ApexCharts, etc.).
 */
export default function RevenueTrendsChart({ title = "Revenue Trends", subtitle = "Platform earnings over the last 30 operational days." }) {
  const [activeMetric, setActiveMetric] = useState("revenue"); // "revenue" | "gmv" | "orders"

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs">
      {/* Header section with title, subtitle and metric toggle tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0A6E5C]">
              <TrendingUp size={13} />
              +14.2% Growth
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Quick View Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F6FAF8] border border-emerald-100/60 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMetric("revenue")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "revenue"
                ? "bg-white text-[#0A6E5C] shadow-xs font-bold border border-emerald-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Net Revenue
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("gmv")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "gmv"
                ? "bg-white text-[#0A6E5C] shadow-xs font-bold border border-emerald-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            GMV
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("orders")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === "orders"
                ? "bg-white text-[#0A6E5C] shadow-xs font-bold border border-emerald-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* 
        Chart Canvas Area (Left empty for user to insert their chart component) 
        Responsive height, pristine white & green background container
      */}
      <div className="w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[340px] pt-4 flex flex-col items-center justify-center relative">
        {/*
          =======================================================
          USER CHART COMPONENT SLOT:
          Insert your chart library component here (e.g. Recharts,
          Chart.js, ApexCharts, Canvas, etc.)
          =======================================================
        */}
        <div className="w-full h-full min-h-[260px] sm:min-h-[300px] rounded-xl border border-dashed border-emerald-200/80 bg-emerald-50/20 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-center text-[#0A6E5C] mb-3">
            <BarChart3 size={24} />
          </div>
          <h4 className="text-sm font-semibold text-gray-800">
            Revenue Trends Chart Slot
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            This component is configured and ready. Insert your preferred chart library (Recharts, Chart.js, etc.) here.
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 bg-white rounded-lg border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
            <Info size={13} className="text-[#0A6E5C]" />
            Component ready for custom chart implementation
          </div>
        </div>
      </div>
    </div>
  );
}

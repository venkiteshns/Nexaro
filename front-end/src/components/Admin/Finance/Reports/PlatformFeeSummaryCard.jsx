import React, { useState } from "react";
import { Percent, Download, Loader2, CheckCircle2 } from "lucide-react";
import { useAdminGetPlatformFeeSummaryQuery } from "../../../../store/services/adminApi";
import { exportPlatformFeeSummaryPDF } from "../../../../utils/reportExportUtils";

/**
 * PlatformFeeSummaryCard Component
 * Full-width banner card displaying Platform Fee Summary, Fiscal Year PTD metric, and Download action.
 */
export default function PlatformFeeSummaryCard() {
  const { data, isLoading, refetch } = useAdminGetPlatformFeeSummaryQuery();
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formattedAmount = data?.formattedAmount || "₹0";
  const commissionRate = data?.commissionRate || "5%";

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const result = await refetch();
      const reportData = result?.data || data;

      exportPlatformFeeSummaryPDF(reportData);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Platform fee summary export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Top subtle emerald gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#0A6E5C] to-teal-600 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left Side: Icon + Title + Description */}
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-100/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
            <Percent size={22} className="text-[#0A6E5C]" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight">
              Platform Fee Summary
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
              Total net earnings from the {commissionRate} standard platform commission fee across all categories.
            </p>
          </div>
        </div>

        {/* Right Side: Big Fiscal Metric + Primary Download Button */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 sm:gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          {/* Fiscal Metric Column */}
          <div className="text-left lg:text-right">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight block">
              {isLoading ? "..." : formattedAmount}
            </span>
          </div>

          {/* Download Action Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-[#0A6E5C] hover:bg-[#085a4b] shadow-xs hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer min-w-[140px]"
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Preparing...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-white" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download size={16} className="text-white" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

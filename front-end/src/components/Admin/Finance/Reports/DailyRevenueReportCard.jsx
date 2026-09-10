import { useState } from "react";
import { TrendingUp, FileDown, Loader2, CheckCircle2 } from "lucide-react";
import ReportCardWrapper from "./ReportCardWrapper";
import { useAdminGetDailyReportQuery } from "../../../../store/services/adminApi";
import {
  exportDailyRevenueReportPDF,
} from "../../../../utils/reportExportUtils";

/**
 * DailyRevenueReportCard Component
 * Displays Daily Revenue Report card with "AUTO-GENERATED" badge and PDF export.
 */
export default function DailyRevenueReportCard() {
  const { data, isLoading, refetch } = useAdminGetDailyReportQuery();
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const summary = data?.summary || {
    formattedGmv: "₹0",
    formattedRevenue: "₹0",
    totalTransactionsToday: 0,
    completedEscrowCount: 0,
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      // Ensure latest data
      const result = await refetch();
      const reportData = result?.data || data;

      // Trigger branded PDF print/download
      exportDailyRevenueReportPDF(reportData);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Daily revenue export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ReportCardWrapper
      icon={TrendingUp}
      title="Daily Revenue Report"
      description="Aggregated real-time revenue stream including transaction fees and premium listings."
      actionButton={
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-700 hover:text-[#0A6E5C] hover:border-emerald-300 hover:bg-emerald-50/40 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isExporting ? (
            <>
              <Loader2 size={17} className="animate-spin text-[#0A6E5C]" />
              <span>Generating PDF...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 size={17} className="text-emerald-600" />
              <span className="text-emerald-700">Ready for Download</span>
            </>
          ) : (
            <>
              <FileDown size={17} className="text-gray-500 group-hover:text-[#0A6E5C]" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      }
    >
      {/* Real-time snapshot metrics */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-[#F8FBFA] p-3 rounded-xl border border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
            Today's GMV
          </span>
          <span className="text-base font-extrabold text-[#111827]">
            {isLoading ? "..." : summary.formattedGmv}
          </span>
        </div>

        <div className="bg-[#F8FBFA] p-3 rounded-xl border border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A6E5C] block mb-0.5">
            Platform Net
          </span>
          <span className="text-base font-extrabold text-[#0A6E5C]">
            {isLoading ? "..." : summary.formattedRevenue}
          </span>
        </div>
      </div>
    </ReportCardWrapper>
  );
}

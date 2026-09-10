import { useState, useMemo } from "react";
import { Receipt, FileDown, Loader2, Calendar, CheckCircle2 } from "lucide-react";
import ReportCardWrapper from "./ReportCardWrapper";
import SelectDropdown from "../../../sharedComponents/SelectDropdown";
import { useAdminGetMonthlyPlReportQuery } from "../../../../store/services/adminApi";
import { exportMonthlyPlStatementPDF } from "../../../../utils/reportExportUtils";

/**
 * MonthlyPlReportCard Component
 * Displays Monthly P&L Statement card with month selector and PDF export.
 */
export default function MonthlyPlReportCard() {
  // Generate dynamic list of past 12 months for selector
  const monthOptions = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      list.push({
        label,
        value: `${d.getFullYear()}-${d.getMonth()}`,
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return list;
  }, []);

  const [selectedMonthValue, setSelectedMonthValue] = useState(
    monthOptions[0]?.value || ""
  );
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Parse current selected year and month
  const selectedOption = useMemo(
    () => monthOptions.find((opt) => opt.value === selectedMonthValue) || monthOptions[0],
    [monthOptions, selectedMonthValue]
  );

  const { data, isLoading, refetch } = useAdminGetMonthlyPlReportQuery({
    year: selectedOption?.year,
    month: selectedOption?.month,
  });

  const metrics = data?.metrics || {
    formattedGmv: "₹0",
    formattedPayouts: "₹0",
    formattedNetProfit: "₹0",
    profitMargin: "5.0%",
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const result = await refetch();
      const reportData = result?.data || data;

      exportMonthlyPlStatementPDF(reportData);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Monthly P&L export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ReportCardWrapper
      icon={Receipt}
      title="Monthly P&L Statement"
      description="Comprehensive profit and loss breakdown including operational overhead and skilled worker payouts."
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
              <span>Generating Statement...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 size={17} className="text-emerald-600" />
              <span className="text-emerald-700">Statement Generated</span>
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
      {/* Month Selector using existing reusable SelectDropdown */}
      <div className="space-y-2 pt-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
          SELECT MONTH
        </label>

        <div className="w-full">
          <SelectDropdown
            options={monthOptions}
            value={selectedMonthValue}
            onChange={setSelectedMonthValue}
            icon={Calendar}
            className="w-full"
            buttonClassName="w-full justify-between py-2.5 bg-[#F8FBFA] border-gray-200 text-xs sm:text-sm"
            menuClassName="w-full"
            align="left"
          />
        </div>

        {/* Selected Month Preview Pills */}
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
      </div>
    </ReportCardWrapper>
  );
}

import { useState, useMemo } from "react";
import { Receipt } from "lucide-react";
import ReportCardWrapper from "./ReportCardWrapper";
import { useAdminGetMonthlyPlReportQuery } from "../../../../store/services/adminApi";
import {
  exportMonthlyPlStatementPDF,
  exportMonthlyPlStatementCSV,
} from "../../../../utils/reportExportUtils";
import {
  PlModeSelector,
  PlMonthFilter,
  PlDateRangeFilter,
  PlMetricsDisplay,
  PlActionButtons,
} from "./PlReport";

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function MonthlyPlReportCard() {
  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => toYMD(now), [now]);
  const defaultFirstDayMonthStr = useMemo(
    () => toYMD(new Date(now.getFullYear(), now.getMonth(), 1)),
    [now]
  );

  const [filterMode, setFilterMode] = useState("month"); // "month" | "range"

  // Date range state
  const [fromDate, setFromDate] = useState(defaultFirstDayMonthStr);
  const [toDate, setToDate] = useState(todayStr);

  const monthOptions = useMemo(() => {
    const list = [];
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
  }, [now]);

  const [selectedMonthValue, setSelectedMonthValue] = useState(
    monthOptions[0]?.value || ""
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const selectedOption = useMemo(
    () => monthOptions.find((opt) => opt.value === selectedMonthValue) || monthOptions[0],
    [monthOptions, selectedMonthValue]
  );

  const dateError = useMemo(() => {
    if (filterMode !== "range") return null;
    if (!fromDate || !toDate) return "Please choose both From and To dates.";
    if (fromDate > toDate) return "From Date cannot be later than To Date.";
    return null;
  }, [filterMode, fromDate, toDate]);

  const queryArgs = useMemo(() => {
    if (filterMode === "range") {
      return { fromDate, toDate };
    }
    return {
      year: selectedOption?.year,
      month: selectedOption?.month,
    };
  }, [filterMode, fromDate, toDate, selectedOption]);

  const { data, isLoading, refetch } = useAdminGetMonthlyPlReportQuery(queryArgs, {
    skip: filterMode === "range" && Boolean(dateError),
  });

  const metrics = data?.metrics || {
    formattedGmv: "₹0",
    formattedPayouts: "₹0",
    formattedNetProfit: "₹0",
    profitMargin: "5.0%",
  };

  const applyPreset = (preset) => {
    const today = new Date();
    const tStr = toYMD(today);
    if (preset === "today") {
      setFromDate(tStr);
      setToDate(tStr);
    } else if (preset === "7days") {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      setFromDate(toYMD(past));
      setToDate(tStr);
    } else if (preset === "30days") {
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      setFromDate(toYMD(past));
      setToDate(tStr);
    } else if (preset === "thisMonth") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(toYMD(first));
      setToDate(tStr);
    }
  };

  const handleDownload = async () => {
    if (dateError) return;
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

  const handleDownloadCSV = async () => {
    if (dateError) return;
    try {
      setIsExportingCsv(true);
      const result = await refetch();
      const reportData = result?.data || data;

      exportMonthlyPlStatementCSV(reportData);
    } catch (err) {
      console.error("Monthly P&L CSV export failed:", err);
    } finally {
      setIsExportingCsv(false);
    }
  };

  return (
    <ReportCardWrapper
      icon={Receipt}
      title={filterMode === "range" ? "P&L Statement (Date Range)" : "Monthly P&L Statement"}
      description={
        filterMode === "range"
          ? "Profit and loss breakdown including gross volume, worker payouts and commission for the selected period."
          : "Comprehensive profit and loss breakdown including operational overhead and skilled worker payouts."
      }
      actionButton={
        <PlActionButtons
          isExporting={isExporting}
          downloadSuccess={downloadSuccess}
          isExportingCsv={isExportingCsv}
          disabled={Boolean(dateError) || isLoading}
          onDownloadPdf={handleDownload}
          onDownloadCsv={handleDownloadCSV}
        />
      }
    >
      <div className="space-y-2 pt-1">
        {/* Mode Selector */}
        <PlModeSelector
          filterMode={filterMode}
          onSelectMode={setFilterMode}
        />

        {/* Filter Inputs */}
        {filterMode === "month" ? (
          <PlMonthFilter
            monthOptions={monthOptions}
            selectedMonthValue={selectedMonthValue}
            onMonthChange={setSelectedMonthValue}
          />
        ) : (
          <PlDateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            todayStr={todayStr}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onApplyPreset={applyPreset}
            dateError={dateError}
          />
        )}

        {/* Metrics Display */}
        <PlMetricsDisplay
          metrics={metrics}
          isLoading={isLoading}
        />
      </div>
    </ReportCardWrapper>
  );
}

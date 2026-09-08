import { useState } from "react";
import { TrendingUp } from "lucide-react";
import FinanceBarChart from "../../sharedComponents/FinanceBarChart";
import { useAdminGetFinanceChartQuery } from "../../../store/services/adminApi";

const TIMEFRAME_OPTIONS = [
  { label: "7 Days", shortLabel: "7D", value: "7D" },
  { label: "1 Month", shortLabel: "1M", value: "1M" },
  { label: "6 Months", shortLabel: "6M", value: "6M" },
  { label: "1 Year", shortLabel: "1Y", value: "1Y" },
  { label: "All Time", shortLabel: "ALL", value: "ALL" },
];

export default function RevenueTrendsChart({
  title = "Revenue Trends",
  subtitle = "Platform commission earnings and revenue momentum from completed bookings",
}) {
  const [timeframe, setTimeframe] = useState("7D");

  const { data, isLoading, isFetching } = useAdminGetFinanceChartQuery({
    timeframe,
    metric: "revenue",
  });

  const chartData = data?.chartData || [];

  const badgeText = `₹${Number(data?.totalRevenue || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <FinanceBarChart
      title={title}
      subtitle={subtitle}
      data={chartData}
      dataKey="revenue"
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      timeframeOptions={TIMEFRAME_OPTIONS}
      badgeText={badgeText}
      badgeIcon={TrendingUp}
      isLoading={isLoading}
      isFetching={isFetching}
      currencySymbol="₹"
    />
  );
}


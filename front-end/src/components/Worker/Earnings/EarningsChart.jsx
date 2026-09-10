import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { useGetWorkerEarningsChartQuery } from "../../../store/services/workerApi";
import FinanceBarChart from "../../sharedComponents/FinanceBarChart";

export const EarningsChart = () => {
  const [timeframe, setTimeframe] = useState("7D");
  const { data, isLoading, isFetching } = useGetWorkerEarningsChartQuery(timeframe);

  const chartData = data?.chartData || [];
  const totalEarnings = data?.totalEarnings || 0;

  return (
    <FinanceBarChart
      title="Earnings Overview"
      subtitle="Income distribution and earnings momentum from completed jobs"
      data={chartData}
      dataKey="earnings"
      timeframe={timeframe}
      onTimeframeChange={setTimeframe}
      badgeText={`₹${Number(totalEarnings || 0).toLocaleString("en-IN")}`}
      badgeIcon={TrendingUp}
      isLoading={isLoading}
      isFetching={isFetching}
      currencySymbol="₹"
    />
  );
};

export default EarningsChart;
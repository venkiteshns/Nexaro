import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/Slices/AdminSlice";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import PaymentStatsCards from "../../components/Admin/Finance/PaymentStatsCards";
import RevenueTrendsChart from "../../components/Admin/Finance/RevenueTrendsChart";
import PaymentsTable from "../../components/Admin/Finance/PaymentsTable";
import SelectDropdown from "../../components/sharedComponents/SelectDropdown";
import { Calendar } from "lucide-react";
import { useAdminGetFinanceStatsQuery } from "../../store/services/adminApi";

export default function AdminPayments() {
  const dispatch = useDispatch();

  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const dateRangeOptions = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "This Year",
    "All Time",
  ];

  useEffect(() => {
    dispatch(setActivePage("Payments & Revenue"));
  }, [dispatch]);

  const { data: statsData, isLoading: statsLoading } =
    useAdminGetFinanceStatsQuery(selectedRange);

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      <AdminNavBar />

      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 w-full space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Payments & Revenue
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Monitor platform revenue, GMV, and live transactions across all service categories.
              </p>
            </div>

            <div className="self-start sm:self-auto">
              <SelectDropdown
                options={dateRangeOptions}
                value={selectedRange}
                onChange={setSelectedRange}
                icon={Calendar}
                align="right"
              />
            </div>
          </div>

          <section aria-label="Financial Overview">
            <PaymentStatsCards
              stats={statsData?.stats}
              isLoading={statsLoading}
            />
          </section>

          <section aria-label="Revenue Trends Chart">
            <RevenueTrendsChart />
          </section>

          <section aria-label="Transactions Table">
            <PaymentsTable dateRange={selectedRange} />
          </section>
        </main>
      </div>
    </div>
  );
}

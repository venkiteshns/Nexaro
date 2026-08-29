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

/**
 * AdminPayments Page
 * Route: /admin/finance/payments
 * White and green theme for Nexaro Admin Portal
 */
export default function AdminPayments() {
  const dispatch = useDispatch();

  // Date range filter state
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");

  const dateRangeOptions = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "This Year",
  ];

  // Set active navigation page on mount
  useEffect(() => {
    dispatch(setActivePage("Payments & Revenue"));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR NAVIGATION */}
      <AdminNavBar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Page Header: Helper text + Date Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                Payments & Revenue
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Monitor platform revenue and transaction trends across all service categories.
              </p>
            </div>

            {/* Reusable Date Range Selector */}
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

          {/* 1. TOP STATS CARDS COMPONENT */}
          <section aria-label="Financial Overview">
            <PaymentStatsCards />
          </section>

          {/* 2. REVENUE TRENDS CHART COMPONENT (Empty container ready for chart) */}
          <section aria-label="Revenue Trends Chart">
            <RevenueTrendsChart />
          </section>

          {/* 3. PAYMENTS & TRANSACTIONS TABLE COMPONENT */}
          <section aria-label="Transactions Table">
            <PaymentsTable />
          </section>
        </main>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/Slices/AdminSlice";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import DailyRevenueReportCard from "../../components/Admin/Finance/Reports/DailyRevenueReportCard";
import MonthlyPlReportCard from "../../components/Admin/Finance/Reports/MonthlyPlReportCard";
import PlatformFeeSummaryCard from "../../components/Admin/Finance/Reports/PlatformFeeSummaryCard";

export default function AdminFinancialReports() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Financial Reports"));
  }, [dispatch]);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <AdminNavBar />

      <div className="flex-1 min-w-0 md:overflow-hidden flex flex-col">
        <AdminHeader />

        <main className="flex-1 md:overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] w-full space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Financial Reports
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                Generate and export platform financial data for fiscal governance and auditing.
              </p>
            </div>
          </div>

          <section aria-label="Core Financial Reports" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <DailyRevenueReportCard />
            <MonthlyPlReportCard />
          </section>

          <section aria-label="Platform Fee Summary">
            <PlatformFeeSummaryCard />
          </section>
        </main>
      </div>
    </div>
  );
}

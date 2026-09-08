import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/Slices/AdminSlice";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import DailyRevenueReportCard from "../../components/Admin/Finance/Reports/DailyRevenueReportCard";
import MonthlyPlReportCard from "../../components/Admin/Finance/Reports/MonthlyPlReportCard";
import PlatformFeeSummaryCard from "../../components/Admin/Finance/Reports/PlatformFeeSummaryCard";
import { ShieldCheck } from "lucide-react";

/**
 * AdminFinancialReports Page
 * Route: /admin/finance/reports
 * Theme: White & Green aesthetic for Nexaro Admin Portal
 */
export default function AdminFinancialReports() {
  const dispatch = useDispatch();

  // Set active navigation page in Redux state on mount
  useEffect(() => {
    dispatch(setActivePage("Financial Reports"));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR NAVIGATION */}
      <AdminNavBar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* Top Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Financial Reports
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                Generate and export platform financial data for fiscal governance and auditing.
              </p>
            </div>

            {/* Governance Indicator Pill */}
            <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-emerald-200/80 rounded-xl text-xs font-semibold text-[#0A6E5C] shadow-2xs">
              <ShieldCheck size={16} className="text-[#0A6E5C]" />
              <span>Audited Platform Financials</span>
            </div>
          </div>

          {/* 1. TOP SECTION: 2-COLUMN GRID (Daily Revenue + Monthly P&L) */}
          <section aria-label="Core Financial Reports" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyRevenueReportCard />
            <MonthlyPlReportCard />
          </section>

          {/* 2. BOTTOM SECTION: FULL WIDTH (Platform Fee Summary) */}
          <section aria-label="Platform Fee Summary">
            <PlatformFeeSummaryCard />
          </section>
        </main>
      </div>
    </div>
  );
}

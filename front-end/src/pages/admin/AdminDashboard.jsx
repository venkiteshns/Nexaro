import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActivePage } from "../../store/Slices/AdminSlice";
import { useAdminGetDashboardQuery } from "../../store/services/adminApi";
import AdminNavBar from "../../layouts/Admin/AdminNavBar";
import AdminHeader from "../../layouts/Admin/AdminHeader";
import DashboardHeader from "../../components/Admin/Dashboard/DashboardHeader";
import DashboardStatsGrid from "../../components/Admin/Dashboard/DashboardStatsGrid";
import RevenueOverviewCard from "../../components/Admin/Dashboard/RevenueOverviewCard";
import RecentSignupsCard from "../../components/Admin/Dashboard/RecentSignupsCard";
import LiveActivityCard from "../../components/Admin/Dashboard/LiveActivityCard";
import PlatformHealthCard from "../../components/Admin/Dashboard/PlatformHealthCard";

/**
 * AdminDashboard Page
 * Complete Admin Overview Dashboard matching user layout
 * Styled in Nexaro's native White & Green brand theme
 */
const AdminDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePage("Dashboard"));
  }, [dispatch]);

  const { data, isLoading } = useAdminGetDashboardQuery();

  const stats = data?.stats || {};
  const revenueOverview = data?.revenueOverview || {};
  const recentSignups = data?.recentSignups || [];
  const liveActivity = data?.liveActivity || [];
  const platformHealth = data?.platformHealth || {};

  return (
    <div className="min-h-screen bg-[#F6FAF8] flex">
      {/* SIDEBAR NAVIGATION */}
      <AdminNavBar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 w-full space-y-4 sm:space-y-5">
          {/* Top Subtitle & Date Pill */}
          <DashboardHeader subtitle="Platform overview" />

            {/* 4 Top Stats Cards */}
            <DashboardStatsGrid stats={stats} isLoading={isLoading} />

            {/* Main 2-Row 2-Column Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5">
              {/* Row 1: Revenue Trajectory (7 cols) + Live Activity (5 cols) */}
              <div className="xl:col-span-7 flex flex-col">
                <RevenueOverviewCard
                  data={revenueOverview}
                  isLoading={isLoading}
                />
              </div>
              <div className="xl:col-span-5 flex flex-col">
                <LiveActivityCard
                  activities={liveActivity}
                  isLoading={isLoading}
                />
              </div>

              {/* Row 2: Recent Signups (7 cols) + Platform Health (5 cols) */}
              <div className="xl:col-span-7 flex flex-col">
                <RecentSignupsCard
                  signups={recentSignups}
                  isLoading={isLoading}
                />
              </div>
              <div className="xl:col-span-5 flex flex-col">
                <PlatformHealthCard
                  health={platformHealth}
                  isLoading={isLoading}
                />
              </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
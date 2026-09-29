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
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <AdminNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <AdminHeader />

        <main className="flex-1 md:overflow-y-auto p-4 sm:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] w-full space-y-4 sm:space-y-5">
          <DashboardHeader subtitle="Platform overview" />

            <DashboardStatsGrid stats={stats} isLoading={isLoading} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5">
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
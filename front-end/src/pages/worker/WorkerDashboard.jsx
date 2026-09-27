import { useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Briefcase } from "lucide-react";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerDashboardHeader from "../../components/Worker/Dashboard/WorkerDashboardHeader";
import WorkerStatCards from "../../components/Worker/Dashboard/WorkerStatCards";
import WorkerCategoryTabs from "../../components/Worker/Dashboard/WorkerCategoryTabs";
import WorkerJobCard from "../../components/Worker/Dashboard/WorkerJobCard";
import WorkerProposalSidebar from "../../components/Worker/Dashboard/WorkerProposalSidebar";
import WorkerCompletedTasks from "../../components/Worker/Dashboard/WorkerCompletedTasks";
import WorkerDashboardFooter from "../../components/Worker/Dashboard/WorkerDashboardFooter";
import EarningsChart from "../../components/Worker/Earnings/EarningsChart";
import { useGetWorkerDashboardQuery } from "../../store/services/workerApi";

const WorkerDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading, isFetching, isError, error, refetch } = useGetWorkerDashboardQuery({
    category: selectedCategory,
  });

  const dashboardData = data?.data || {};
  const stats = dashboardData.stats || {
    activeBids: 0,
    jobsCompleted: 0,
    totalEarned: 0,
    rating: 4.8,
  };
  const categories = dashboardData.categories || [
    "All",
    "Electrician",
    "Plumber",
    "Painter",
    "Tutor",
    "Cleaning",
  ];
  const availableJobs = dashboardData.availableJobs || [];
  const recentBids = dashboardData.recentBids || [];
  const completedTasks = dashboardData.completedTasks || [];
  const userName = dashboardData.userName || "";
  const walletAmount = dashboardData.walletAmount || 0;
  const isLive = dashboardData.isLive ?? true;

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      {/* Sidebar Navigation */}
      <WorkerNavBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Top Header matching screenshot */}
        <WorkerDashboardHeader
          userName={userName}
          walletAmount={walletAmount}
          isLive={isLive}
        />

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 lg:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            {/* 4 KPI Stats Cards Row */}
            <WorkerStatCards stats={stats} />

            {/* Earnings Overview Graph */}
            <div className="mb-4">
              <EarningsChart showBadge={false} />
            </div>

            {/* Error Banner if any */}
            {isError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between gap-2.5 text-xs text-red-700">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>
                    {error?.data?.message || "Failed to load dashboard data. Please try again."}
                  </span>
                </div>
                <button
                  onClick={() => refetch()}
                  className="px-2.5 py-1 bg-white border border-red-200 hover:bg-red-100 rounded-lg text-xs font-bold text-red-700 flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <RefreshCw size={12} />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Content Layout: Available Opportunities on Left, Proposals & Completed Tasks Side-by-Side on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
              {/* Left Column (5 cols): Available Opportunities / Jobs */}
              <div className="lg:col-span-5">
                {/* Category Pills & View More link */}
                <WorkerCategoryTabs
                  categories={categories}
                  activeCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                />

                {/* Job Cards List */}
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 shrink-0" />
                          <div className="flex-1 space-y-2.5">
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-100 rounded w-5/6" />
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                          </div>
                        </div>
                        <div className="w-24 h-10 bg-gray-200 rounded-xl shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : availableJobs.length === 0 ? (
                  <div className="bg-white border border-gray-200/80 rounded-2xl p-8 text-center shadow-2xs">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mx-auto mb-3">
                      <Briefcase size={26} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                      No Open Tasks Found
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
                      {selectedCategory && selectedCategory !== "All"
                        ? `There are currently no open tasks in "${selectedCategory}". Try selecting "All" or checking back soon.`
                        : "There are currently no new open tasks matching your location. Check back soon for fresh opportunities!"}
                    </p>
                    {selectedCategory !== "All" && (
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className="px-4 py-2 bg-[#0A6E5C] text-white rounded-xl text-xs font-bold hover:bg-[#085a4b] transition-colors cursor-pointer"
                      >
                        Show All Categories
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    {isFetching && !isLoading && (
                      <div className="absolute top-2 right-2 z-10">
                        <Loader2 size={16} className="animate-spin text-[#0A6E5C]" />
                      </div>
                    )}
                    {availableJobs.map((job) => (
                      <WorkerJobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Area (7 cols): Proposals & Completed Tasks Side-by-Side */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <WorkerProposalSidebar proposals={recentBids} />
                <WorkerCompletedTasks completedTasks={completedTasks} />
              </div>
            </div>

            {/* NEXARO Footer */}
            <WorkerDashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;

import { useState } from "react";
import WorkerNavBar from "../../layouts/Worker/WorkerNavBar";
import WorkerHeader from "../../layouts/Worker/WorkerHeader";
import WorkerNotificationCard from "../../components/Worker/Notifications/WorkerNotificationCard";
import WorkerNotificationFilters from "../../components/Worker/Notifications/WorkerNotificationFilters";
import PaginationSections from "../../components/sharedComponents/PaginationSections";
import {
  useGetWorkerNotificationsQuery,
  useMarkAllWorkerNotificationsReadMutation,
  useMarkWorkerNotificationReadMutation,
} from "../../store/services/workerApi";
import { showSuccess, showError } from "../../utils/toast";
import { Bell, Sparkles, RefreshCw, Inbox } from "lucide-react";

const WorkerNotifications = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const limit = 6;

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetWorkerNotificationsQuery({
    page,
    limit,
    filter,
  });

  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllWorkerNotificationsReadMutation();
  const [markSingleRead] = useMarkWorkerNotificationReadMutation();

  const notifications = data?.notifications || [];
  const totalPages = data?.totalPages || 1;
  const counts = data?.counts || { unread: 0, payments: 0, system: 0 };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead().unwrap();
      showSuccess("All notifications marked as read");
    } catch (err) {
      showError(err?.data?.message || "Failed to mark notifications as read");
    }
  };

  const handleMarkSingleAsRead = async (id) => {
    try {
      await markSingleRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6FAF8]">
      <WorkerNavBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkerHeader />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          <div className="w-full space-y-3 sm:space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[#0A6E5C]">
                    <Bell size={15} />
                  </div>
                  <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                    Notifications
                  </h1>
                </div>
                <p className="text-xs text-gray-400 pl-9">
                  Real-time updates on your payments and system notices
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-[#0A6E5C] transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Refresh notifications"
                >
                  <RefreshCw size={13} className={isFetching ? "animate-spin text-[#0A6E5C]" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <WorkerNotificationFilters
              activeFilter={filter}
              onFilterChange={handleFilterChange}
              counts={counts}
              onMarkAllRead={handleMarkAllAsRead}
              isMarkingAllRead={isMarkingAll}
            />

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="p-2.5 sm:p-3 rounded-xl bg-white border border-gray-100 animate-pulse space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-2.5 bg-gray-200 rounded w-20" />
                      <div className="h-2 bg-gray-100 rounded w-12" />
                    </div>
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center shadow-xs">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-emerald-50 text-[#0A6E5C] flex items-center justify-center">
                  <Inbox size={20} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  No notifications found
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-3">
                  {filter !== "all"
                    ? `You don't have any notifications under "${filter.replace("_", " ")}".`
                    : "You're all caught up! When you receive payments or system updates, they'll appear here in real-time."}
                </p>
                {filter !== "all" && (
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0A6E5C] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Sparkles size={12} />
                    <span>View all notifications</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-2.5">
                {notifications.map((notification) => (
                  <WorkerNotificationCard
                    key={notification._id}
                    notification={notification}
                    onMarkRead={handleMarkSingleAsRead}
                  />
                ))}
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="pt-2 pb-4">
                <PaginationSections
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkerNotifications;

import { useState } from "react";
import PosterNavBar from "../../layouts/Poster/PosterNavBar";
import PosterHeader from "../../layouts/Poster/PosterHeader";
import PosterNotificationHeader from "../../components/Poster/Notifications/PosterNotificationHeader";
import PosterNotificationFilters from "../../components/Poster/Notifications/PosterNotificationFilters";
import PosterNotificationCard from "../../components/Poster/Notifications/PosterNotificationCard";
import PosterNotificationSkeleton from "../../components/Poster/Notifications/PosterNotificationSkeleton";
import PosterNotificationEmptyState from "../../components/Poster/Notifications/PosterNotificationEmptyState";
import PaginationSections from "../../components/sharedComponents/PaginationSections";
import {
  useGetPosterNotificationsQuery,
  useMarkAllPosterNotificationsReadMutation,
  useMarkPosterNotificationReadMutation,
} from "../../store/services/posterApi";
import { showSuccess, showError } from "../../utils/toast";

const PosterNotifications = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const limit = 6;

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetPosterNotificationsQuery({
    page,
    limit,
    filter,
  });

  const [markAllRead, { isLoading: isMarkingAll }] =
    useMarkAllPosterNotificationsReadMutation();
  const [markSingleRead] = useMarkPosterNotificationReadMutation();

  const notifications = data?.notifications || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const counts = data?.counts || {
    all: 0,
    unread: 0,
    payments: 0,
    system: 0,
  };

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

  const startIndex = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-[#F6FAF8]">
      <PosterNavBar />

      <div className="flex-1 flex flex-col min-w-0 md:overflow-hidden">
        <PosterHeader />

        <main className="flex-1 md:overflow-y-auto p-3 sm:p-5 lg:p-6 pb-28 sm:pb-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
          <div className="w-full space-y-3 sm:space-y-3.5">
            <PosterNotificationHeader
              unreadCount={counts.unread}
              isFetching={isFetching}
              onRefresh={() => refetch()}
              onMarkAllRead={handleMarkAllAsRead}
              isMarkingAllRead={isMarkingAll}
            />

            <PosterNotificationFilters
              activeFilter={filter}
              onFilterChange={handleFilterChange}
              counts={counts}
            />

            {isLoading ? (
              <PosterNotificationSkeleton count={4} />
            ) : notifications.length === 0 ? (
              <PosterNotificationEmptyState
                filter={filter}
                onResetFilter={() => handleFilterChange("all")}
              />
            ) : (
              <div className="space-y-2.5">
                {notifications.map((notification) => (
                  <PosterNotificationCard
                    key={notification._id}
                    notification={notification}
                    onMarkRead={handleMarkSingleAsRead}
                  />
                ))}
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <div className="pt-2 pb-6 space-y-2">
                <PaginationSections
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />

                {totalItems > 0 && (
                  <p className="text-center text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    SHOWING {startIndex}-{endIndex} OF {totalItems} NOTIFICATIONS
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PosterNotifications;

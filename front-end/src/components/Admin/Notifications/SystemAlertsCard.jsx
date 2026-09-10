
import NotificationItem from "./NotificationItem";
import PaginationSections from "../../sharedComponents/PaginationSections";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

/**
 * Reusable SystemAlertsCard component
 * Displays list of alerts, unread counts, mark all as read action, and pagination.
 */
const SystemAlertsCard = ({
  notifications = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  unreadCount = 0,
  onPageChange,
  onMarkAllAsRead,
  onMarkRead,
  isMarkingAll = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-4 sm:p-5 flex flex-col">
      <div>
        {/* Card Header: Title + Unread Count + MARK ALL AS READ */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-[#0A6E5C] rounded-full" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#111827] tracking-tight">
              System Alerts
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0A6E5C] border border-emerald-200/70">
                {unreadCount} unread
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0 || isMarkingAll || isLoading}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A6E5C] hover:text-[#085849] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isMarkingAll ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <CheckCheck size={14} />
            )}
            <span>Mark All As Read</span>
          </button>
        </div>

        {/* Alerts List / Skeletons / Empty State */}
        <div className="mt-3 space-y-2">
          {isLoading ? (
            // Skeletons
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`alert-skeleton-${idx}`}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-gray-100 bg-gray-50/50 animate-pulse"
              >
                <div className="flex items-center gap-3 w-3/4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
                <div className="w-12 h-3 bg-gray-200 rounded" />
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0A6E5C] flex items-center justify-center mx-auto mb-3">
                <Bell size={22} />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                No system alerts right now
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Platform notifications and activity logs will appear here in real-time.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <NotificationItem
                key={item._id || item.id}
                notification={item}
                onMarkRead={onMarkRead}
              />
            ))
          )}
        </div>
      </div>

      {/* Reusable Pagination Section */}
      {totalPages > 1 && (
        <div className="pt-4 mt-4 border-t border-gray-100">
          <PaginationSections
            totalPages={totalPages}
            onPageChange={onPageChange}
            page={currentPage}
            className="mt-0"
          />
        </div>
      )}
    </div>
  );
};

export default SystemAlertsCard;

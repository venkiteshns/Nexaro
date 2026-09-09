import { Bell, RefreshCw, CheckCheck } from "lucide-react";

const PosterNotificationHeader = ({
  unreadCount = 0,
  isFetching = false,
  onRefresh,
  onMarkAllRead,
  isMarkingAllRead = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0A6E5C] shadow-2xs">
            <Bell size={18} />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-[#0A6E5C] border border-emerald-200">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 pl-10">
          Stay updated on your tasks and bids
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            disabled={isMarkingAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0A6E5C] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            title="Mark all notifications as read"
          >
            <CheckCheck size={13} />
            <span>{isMarkingAllRead ? "Marking..." : "Mark all as read"}</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-[#0A6E5C] transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          title="Refresh notifications"
        >
          <RefreshCw
            size={13}
            className={isFetching ? "animate-spin text-[#0A6E5C]" : ""}
          />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default PosterNotificationHeader;

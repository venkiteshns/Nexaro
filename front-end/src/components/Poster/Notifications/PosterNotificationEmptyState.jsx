import { Inbox, Sparkles } from "lucide-react";

const PosterNotificationEmptyState = ({ filter = "all", onResetFilter }) => {
  const getMessage = () => {
    switch (filter) {
      case "unread":
        return "You're all caught up! There are no unread notifications right now.";
      case "bids":
        return "No bids received yet. Once professionals start submitting bids on your tasks, they will appear here.";
      case "payments":
        return "No payment notifications yet. Escrow updates and milestone releases will be tracked here.";
      case "tasks":
        return "No task updates yet. Progress and status changes on your tasks will appear here.";
      case "system":
        return "No system announcements at the moment.";
      default:
        return "You're all caught up! When workers bid on your tasks, progress is logged, or payments are processed, updates will appear here in real time.";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 sm:p-12 text-center shadow-2xs">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 text-[#0A6E5C] border border-emerald-100 flex items-center justify-center">
        <Inbox size={26} />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
        No notifications found
      </h3>

      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-5 leading-relaxed">
        {getMessage()}
      </p>

      {filter !== "all" && (
        <button
          type="button"
          onClick={onResetFilter}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#0A6E5C] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Sparkles size={14} />
          <span>View all notifications</span>
        </button>
      )}
    </div>
  );
};

export default PosterNotificationEmptyState;

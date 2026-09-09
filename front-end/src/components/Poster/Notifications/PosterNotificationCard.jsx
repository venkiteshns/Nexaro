import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  ClipboardList,
  Star,
  Megaphone,
  Check,
  Bell,
} from "lucide-react";

import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const PosterNotificationCard = ({ notification, onMarkRead }) => {
  const {
    _id,
    type,
    title,
    description,
    workerName,
    workerAvatar,
    isRead,
    dotColor = "emerald",
    createdAt,
  } = notification;

  const handleCardClick = () => {
    if (!isRead && onMarkRead) {
      onMarkRead(_id);
    }
  };

  const handleMarkReadClick = (e) => {
    e.stopPropagation();
    if (!isRead && onMarkRead) {
      onMarkRead(_id);
    }
  };

  // Render left avatar or icon based on notification type
  const renderLeftMedia = () => {
    if (type === "new_bid") {
      if (workerAvatar) {
        return (
          <img
            src={workerAvatar}
            alt={workerName || "Worker"}
            className="w-10 h-10 rounded-full object-cover border border-emerald-200 shrink-0 shadow-2xs"
          />
        );
      }
      return (
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#0A6E5C] font-bold text-sm border border-emerald-200 shrink-0 shadow-2xs">
          {workerName ? workerName.charAt(0).toUpperCase() : "W"}
        </div>
      );
    }

    if (type === "multiple_bids") {
      return (
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
          <Users size={18} />
        </div>
      );
    }

    if (type === "payment_escrow") {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck size={18} />
        </div>
      );
    }

    if (type === "task_completed") {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
          <CheckCircle2 size={18} />
        </div>
      );
    }

    if (type === "worker_assigned") {
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 shadow-2xs">
          <Briefcase size={18} />
        </div>
      );
    }

    if (type === "task_posted") {
      return (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
          <ClipboardList size={18} />
        </div>
      );
    }

    if (type === "review_reminder") {
      return (
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
          <Star size={18} className="fill-amber-400 text-amber-500" />
        </div>
      );
    }

    if (type === "announcement") {
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
          <Megaphone size={18} />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A6E5C] border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
        <Bell size={18} />
      </div>
    );
  };

  const dotColorClasses = {
    emerald: "bg-[#0A6E5C] ring-emerald-100",
    blue: "bg-sky-500 ring-sky-100",
    amber: "bg-amber-500 ring-amber-100",
    rose: "bg-rose-500 ring-rose-100",
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 ${
        !isRead
          ? "bg-white border-emerald-300 shadow-xs hover:border-[#0A6E5C] cursor-pointer"
          : "bg-white border-gray-200 shadow-2xs hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Media / Icon */}
        {renderLeftMedia()}

        {/* Body Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Title & Timestamp */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h3
              className={`text-sm sm:text-base font-bold truncate ${
                !isRead ? "text-gray-900" : "text-gray-800"
              }`}
            >
              {title}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                {formatTimeAgo(createdAt)}
              </span>

              {!isRead && (
                <span
                  className={`w-2.5 h-2.5 rounded-full ring-4 ${
                    dotColorClasses[dotColor] || dotColorClasses.emerald
                  } animate-pulse`}
                  title="Unread notification"
                />
              )}

              {/* Mark as read quick action on hover */}
              {!isRead && (
                <button
                  type="button"
                  onClick={handleMarkReadClick}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-[#0A6E5C] hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                  title="Mark as read"
                >
                  <Check size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterNotificationCard;

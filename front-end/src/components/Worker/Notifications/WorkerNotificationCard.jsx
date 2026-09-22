import {
  IndianRupee,
  Star,
  Megaphone,
  Check,
  Bell,
} from "lucide-react";

import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const WorkerNotificationCard = ({ notification, onMarkRead }) => {
  const {
    _id,
    type,
    title,
    description,
    amount,
    rating,
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

  const dotColorClass = {
    emerald: "bg-emerald-500 ring-emerald-100",
    amber: "bg-amber-500 ring-amber-100",
    blue: "bg-blue-500 ring-blue-100",
    rose: "bg-rose-500 ring-rose-100",
  }[dotColor] || "bg-emerald-500 ring-emerald-100";

  return (
    <div
      onClick={handleCardClick}
      className={`relative group bg-white rounded-xl border transition-all duration-150 p-2.5 sm:p-3 shadow-2xs hover:shadow-xs ${
        !isRead
          ? "border-emerald-200 bg-emerald-50/15 cursor-pointer"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-2.5">
        <div className="pt-1 shrink-0">
          <span
            className={`block w-2 h-2 rounded-full ring-2 transition-transform group-hover:scale-110 ${dotColorClass} ${
              !isRead ? "animate-pulse" : "opacity-60"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex flex-wrap items-center gap-1">
              {type === "payment_received" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#0A6E5C] border border-emerald-200">
                  <IndianRupee size={9} className="text-[#0A6E5C]" />
                  Payment
                </span>
              )}

              {type === "review" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  <Star size={9} className="text-amber-500 fill-amber-500" />
                  Review
                </span>
              )}

              {type === "announcement" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  <Megaphone size={9} className="text-purple-600" />
                  Announcement
                </span>
              )}

              {type === "system" && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                  <Bell size={9} className="text-gray-600" />
                  Notice
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-gray-400 font-normal">
                {formatTimeAgo(createdAt)}
              </span>
              {!isRead && onMarkRead && (
                <button
                  onClick={handleMarkReadClick}
                  title="Mark as read"
                  className="text-gray-400 hover:text-[#0A6E5C] transition-colors p-0.5 rounded hover:bg-emerald-50 cursor-pointer"
                >
                  <Check size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-1.5 mb-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight leading-snug">
              {title}
            </h3>
            {amount !== null && amount !== undefined && (
              <span className="text-xs sm:text-sm font-extrabold text-[#0A6E5C] shrink-0">
                ₹{Number(amount).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {rating && (
            <div className="flex items-center gap-0.5 mb-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  }
                />
              ))}
              <span className="text-[10px] font-semibold text-gray-600 ml-1">
                {rating}.0
              </span>
            </div>
          )}

          <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerNotificationCard;

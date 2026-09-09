import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Star,
  Megaphone,
  Check,
} from "lucide-react";

import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const WorkerNotificationCard = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();
  const {
    _id,
    type,
    title,
    description,
    amount,
    distance,
    location,
    rating,
    jobId,
    tip,
    expiresAt,
    actionLink,
    isRead,
    dotColor = "emerald",
    createdAt,
  } = notification;

  // Real-time countdown for urgent tasks
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiresAt) return;
    const calculateTime = () => {
      const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const mins = Math.floor(diff / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${mins}m ${secs}s left`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const isAnnouncement = type === "announcement";
  const isPayment = type === "payment_received" || notification.category === "payments";
  const canNavigate = Boolean(actionLink && !isAnnouncement && !isPayment);

  const handleCardClick = () => {
    if (!isRead && onMarkRead) {
      onMarkRead(_id);
    }
    if (canNavigate) {
      navigate(actionLink);
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
      className={`relative group bg-white rounded-xl sm:rounded-2xl border transition-all duration-150 p-3 sm:p-4 shadow-2xs hover:shadow-xs ${
        canNavigate
          ? "cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/20"
          : !isRead
          ? "cursor-pointer"
          : ""
      } ${
        !isRead
          ? "border-emerald-200 bg-emerald-50/15"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start gap-2.5 sm:gap-3.5">
        {/* Left Status Dot */}
        <div className="pt-1 shrink-0">
          <span
            className={`block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ring-3 transition-transform group-hover:scale-110 ${dotColorClass} ${
              !isRead ? "animate-pulse" : "opacity-60"
            }`}
          />
        </div>

        {/* Card Body */}
        <div className="flex-1 min-w-0">
          {/* Top Metadata Row: Badge & Timestamp */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {type === "urgent_task" && (
                <>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                    <Flame size={11} className="text-rose-600 animate-bounce" />
                    Urgent Task
                  </span>
                  {timeLeft && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock size={10} className="text-amber-600" />
                      {timeLeft}
                    </span>
                  )}
                </>
              )}

              {type === "nearby_task" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  New Task
                </span>
              )}

              {type === "bid_accepted" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={11} className="text-[#0A6E5C]" />
                  Bid Won! 🎉
                </span>
              )}

              {type === "bid_rejected" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                  <XCircle size={11} className="text-gray-500" />
                  Update
                </span>
              )}

              {type === "payment_received" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 text-[#0A6E5C] border border-emerald-200">
                  <IndianRupee size={10} className="text-[#0A6E5C]" />
                  Payment
                </span>
              )}

              {type === "review" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  Review
                </span>
              )}

              {type === "announcement" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  <Megaphone size={10} className="text-purple-600" />
                  Announcement
                </span>
              )}

              {distance && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400">
                  <MapPin size={10} className="text-gray-400" />
                  {distance} away {location ? `• ${location}` : ""}
                </span>
              )}
            </div>

            {/* Relative Time and Mark as Read Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] sm:text-xs text-gray-400 font-normal">
                {formatTimeAgo(createdAt)}
              </span>
              {!isRead && onMarkRead && (
                <button
                  onClick={handleMarkReadClick}
                  title="Mark as read"
                  className="text-gray-400 hover:text-[#0A6E5C] transition-colors p-1 rounded-md hover:bg-emerald-50"
                >
                  <Check size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Title & Amount Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-1.5 mb-1">
            <h3 className="text-xs sm:text-sm md:text-[15px] font-semibold text-gray-900 tracking-tight leading-snug">
              {title}
            </h3>
            {amount !== null && amount !== undefined && (
              <span className="text-xs sm:text-sm md:text-[15px] font-bold text-[#0A6E5C] shrink-0">
                ₹{Number(amount).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Star Rating Display for Reviews */}
          {rating && (
            <div className="flex items-center gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200"
                  }
                />
              ))}
              <span className="text-[11px] font-semibold text-gray-600 ml-1">
                {rating}.0
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
            {description}
          </p>

          {/* Optional Tip Callout (e.g. for rejected bids) */}
          {tip && (
            <div className="mt-1.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900 font-medium">
              <span>{tip}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerNotificationCard;
